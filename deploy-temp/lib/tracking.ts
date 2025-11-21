import { Prisma, type Order } from '@prisma/client'

import { prisma } from './prisma'
import { getFourPXClient } from './fourpx'

export type TrackingStatus =
  | 'pending'
  | 'label_created'
  | 'info_received'
  | 'in_transit'
  | 'customs'
  | 'exception'
  | 'out_for_delivery'
  | 'delivered'
  | 'unknown'

export interface TrackingEvent {
  code: string
  description: string
  location?: string
  time: string
  status?: TrackingStatus
}

export interface TrackingSnapshot {
  trackingNumber: string
  status: TrackingStatus
  statusLabel: string
  events: TrackingEvent[]
  delivered: boolean
  provider: string
  eta?: string | null
  lastSyncedAt: Date | null
  fallback: boolean
}

const STALE_WINDOW_MS = 15 * 60 * 1000

export async function enrichOrdersWithTracking(
  orders: Order[],
  options?: { force?: boolean }
) {
  return Promise.all(
    orders.map(async (order) => ({
      ...order,
      trackingSnapshot: await getTrackingSnapshotForOrder(order, options),
    }))
  )
}

export async function getTrackingSnapshotForOrder(
  order: Order,
  options?: { force?: boolean }
): Promise<TrackingSnapshot | null> {
  if (!order.trackingNumber) {
    return null
  }

  const cachedEvents = parseTrackingEvents(order.trackingEvents)
  const canUseCache =
    !options?.force &&
    cachedEvents.length > 0 &&
    order.trackingLastSyncedAt &&
    Date.now() - order.trackingLastSyncedAt.getTime() < STALE_WINDOW_MS

  if (canUseCache) {
    return buildSnapshotFromStored(order, cachedEvents)
  }

  return refreshTrackingFromSource(order, cachedEvents)
}

async function refreshTrackingFromSource(order: Order, cached: TrackingEvent[]) {
  const client = getFourPXClient()

  if (!client.isConfigured) {
    return buildSnapshotFromSample(order, cached)
  }

  try {
    const response = await client.track({
      trackingNumber: order.trackingNumber!,
      referenceNumber: order.id,
      countryCode: order.shippingCountry,
      postalCode: order.shippingZip,
    })

    const normalized = normalizeFourPXResponse(response, order.trackingNumber!)
    const now = new Date()
    await prisma.order.update({
      where: { id: order.id },
      data: {
        trackingStatus: normalized.status,
        trackingEvents: normalized.events as unknown as Prisma.JsonArray,
        trackingLastSyncedAt: now,
        trackingEta: normalized.eta ? new Date(normalized.eta) : null,
        trackingMeta: normalized.meta
          ? (normalized.meta as Prisma.JsonObject)
          : Prisma.JsonNull,
      },
    })

    return {
      trackingNumber: order.trackingNumber!,
      status: normalized.status,
      statusLabel: trackingStatusToLabel(normalized.status),
      events: normalized.events,
      delivered: normalized.delivered,
      provider: '4PX',
      eta: normalized.eta,
      lastSyncedAt: now,
      fallback: false,
    }
  } catch (error) {
    console.error('4PX tracking error:', error)
    return buildSnapshotFromStored(order, cached, true)
  }
}

function buildSnapshotFromStored(
  order: Order,
  events: TrackingEvent[],
  fallback = false
): TrackingSnapshot {
  if (events.length === 0) {
    return buildSnapshotFromSample(order, events)
  }

  const status = normalizeTrackingStatus(order.trackingStatus)
  return {
    trackingNumber: order.trackingNumber || '',
    status,
    statusLabel: trackingStatusToLabel(status),
    events: sortEvents(events),
    delivered: status === 'delivered',
    provider: order.trackingCarrier || '4PX',
    eta: order.trackingEta ? order.trackingEta.toISOString() : null,
    lastSyncedAt: order.trackingLastSyncedAt || null,
    fallback,
  }
}

function buildSnapshotFromSample(order: Order, cached: TrackingEvent[]): TrackingSnapshot {
  const events = cached.length > 0 ? cached : generateSampleEvents(order)
  const sorted = sortEvents(events)
  const lastEvent = sorted[sorted.length - 1]
  const status = lastEvent?.status ?? order.trackingStatus ?? 'in_transit'
  const normalizedStatus = normalizeTrackingStatus(status)

  return {
    trackingNumber: order.trackingNumber || `TEMP-${order.id.slice(0, 8).toUpperCase()}`,
    status: normalizedStatus,
    statusLabel: trackingStatusToLabel(normalizedStatus),
    events: sorted,
    delivered: normalizeTrackingStatus(status) === 'delivered',
    provider: order.trackingCarrier || '4PX',
    eta: order.trackingEta ? order.trackingEta.toISOString() : null,
    lastSyncedAt: new Date(),
    fallback: true,
  }
}

interface NormalizedFourPXResponse {
  events: TrackingEvent[]
  status: TrackingStatus
  delivered: boolean
  eta?: string | null
  meta?: Record<string, unknown>
}

function normalizeFourPXResponse(raw: any, trackingNumber: string): NormalizedFourPXResponse {
  const events = extractEventsFromResponse(raw)
  const sorted = sortEvents(events)
  const lastEvent = sorted[sorted.length - 1]

  const statusCandidate =
    normalizeTrackingStatus(
      raw?.status ||
        raw?.track_status ||
        raw?.order_status ||
        raw?.rsp_msg ||
        lastEvent?.status ||
        'in_transit'
    ) ?? 'in_transit'

  const eta =
    raw?.estimated_arrival_time ||
    raw?.eta ||
    raw?.expected_delivery ||
    raw?.estimate_date ||
    null

  return {
    events: sorted,
    status: statusCandidate,
    delivered: statusCandidate === 'delivered',
    eta: eta ? normalizeDateInput(eta) : null,
    meta: {
      trackingNumber,
      message: raw?.msg || raw?.message || raw?.rsp_msg,
      code: raw?.code || raw?.rsp_code,
    },
  }
}

function extractEventsFromResponse(raw: any): TrackingEvent[] {
  if (!raw) return []

  const events: TrackingEvent[] = []
  const queue: any[] = [raw]
  const visited = new Set<any>()

  while (queue.length > 0) {
    const item = queue.shift()
    if (!item || visited.has(item)) {
      continue
    }
    visited.add(item)

    if (Array.isArray(item)) {
      item.forEach((entry) => queue.push(entry))
      continue
    }

    if (typeof item === 'object') {
      const event = convertObjectToEvent(item)
      if (event) {
        events.push(event)
        continue
      }

      Object.values(item).forEach((value) => {
        if (value && typeof value === 'object') {
          queue.push(value)
        }
      })
    }
  }

  if (events.length > 0) {
    return events
  }

  return generateFallbackEventsFromRaw(raw)
}

function convertObjectToEvent(value: Record<string, any>): TrackingEvent | null {
  const timeKey = findFirstKey(value, TIME_KEYS)
  const descriptionKey = findFirstKey(value, DESCRIPTION_KEYS)

  if (!timeKey || !descriptionKey) {
    return null
  }

  const description = stringify(value[descriptionKey])
  const time = normalizeDateInput(value[timeKey])

  if (!description || !time) {
    return null
  }

  const code =
    stringify(value[findFirstKey(value, CODE_KEYS) ?? descriptionKey]) || 'EVENT_REPORTED'
  const location = stringify(value[findFirstKey(value, LOCATION_KEYS) ?? ''])
  const statusCandidate = mapTextToStatus(value)

  return {
    code,
    description,
    location: location || undefined,
    time,
    status: statusCandidate,
  }
}

function generateFallbackEventsFromRaw(raw: any): TrackingEvent[] {
  const message = raw?.msg || raw?.message || raw?.rsp_msg
  if (!message) return []

  return [
    {
      code: 'INFO_RECEIVED',
      description: message,
      time: new Date().toISOString(),
      status: 'info_received',
    },
  ]
}

function parseTrackingEvents(value: Prisma.JsonValue | null): TrackingEvent[] {
  if (!value || !Array.isArray(value)) {
    return []
  }

  const events: TrackingEvent[] = []
  for (const item of value) {
    if (!item || typeof item !== 'object') {
      continue
    }

    const record = item as Record<string, any>
    const time = normalizeDateInput(record.time)
    const description = stringify(record.description)
    if (!time || !description) {
      continue
    }

    events.push({
      code: stringify(record.code) || 'EVENT_REPORTED',
      description,
      location: stringify(record.location) || undefined,
      time,
      status: normalizeTrackingStatus(record.status),
    })
  }
  return events
}

function sortEvents(events: TrackingEvent[]) {
  return [...events].sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
  )
}

function normalizeDateInput(input: unknown): string | null {
  if (!input) return null
  if (input instanceof Date) return input.toISOString()
  if (typeof input === 'number') return new Date(input).toISOString()

  if (typeof input === 'string') {
    const trimmed = input.trim()
    if (!trimmed) return null
    if (trimmed.includes('T')) {
      const date = new Date(trimmed)
      return isNaN(date.getTime()) ? null : date.toISOString()
    }
    const normalized = trimmed.replace(' ', 'T')
    const date = new Date(`${normalized.endsWith('Z') ? normalized : `${normalized}Z`}`)
    return isNaN(date.getTime()) ? null : date.toISOString()
  }

  return null
}

function stringify(value: unknown) {
  if (typeof value === 'string') {
    return value.trim()
  }
  if (typeof value === 'number') {
    return value.toString()
  }
  return ''
}

function findFirstKey(record: Record<string, any>, keys: string[]) {
  return keys.find((key) => key in record)
}

function mapTextToStatus(record: Record<string, any>): TrackingStatus | undefined {
  const text = [
    record?.status,
    record?.track_status,
    record?.event_status,
    record?.event_desc,
    record?.eventDescription,
    record?.description,
  ]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase())
    .join(' ')

  if (!text) return undefined

  if (text.includes('delivered') || text.includes('签收') || text.includes('delivered')) {
    return 'delivered'
  }

  if (text.includes('out for delivery') || text.includes('派送')) {
    return 'out_for_delivery'
  }

  if (text.includes('exception') || text.includes('failed') || text.includes('异常')) {
    return 'exception'
  }

  if (text.includes('customs') || text.includes('清关')) {
    return 'customs'
  }

  if (
    text.includes('in transit') ||
    text.includes('transit') ||
    text.includes('departure') ||
    text.includes('arrived') ||
    text.includes('离开') ||
    text.includes('到达')
  ) {
    return 'in_transit'
  }

  if (text.includes('label') || text.includes('info received')) {
    return 'info_received'
  }

  return undefined
}

function normalizeTrackingStatus(status: unknown): TrackingStatus {
  if (typeof status !== 'string') {
    return 'unknown'
  }
  const value = status.toLowerCase()
  if (value.includes('deliver')) return 'delivered'
  if (value.includes('out') && value.includes('delivery')) return 'out_for_delivery'
  if (value.includes('exception') || value.includes('fail') || value.includes('return'))
    return 'exception'
  if (value.includes('customs') || value.includes('clearance')) return 'customs'
  if (value.includes('info') || value.includes('label')) return 'info_received'
  if (value.includes('pending')) return 'pending'
  if (value.includes('transit') || value.includes('depart') || value.includes('arriv'))
    return 'in_transit'
  return 'unknown'
}

export function trackingStatusToLabel(status: TrackingStatus) {
  switch (status) {
    case 'pending':
      return '待创建'
    case 'label_created':
    case 'info_received':
      return '已创建运单'
    case 'in_transit':
      return '运输中'
    case 'customs':
      return '清关中'
    case 'out_for_delivery':
      return '派送中'
    case 'delivered':
      return '已签收'
    case 'exception':
      return '异常'
    default:
      return '未知状态'
  }
}

const TIME_KEYS = [
  'event_time',
  'eventTime',
  'time',
  'track_occur_date',
  'track_occur_time',
  'occur_date',
  'occurDate',
  'occur_time',
  'operate_time',
  'operateTime',
  'scan_date',
  'date',
]

const DESCRIPTION_KEYS = [
  'event_desc',
  'eventDesc',
  'description',
  'desc',
  'track_description',
  'trackDescription',
  'content',
  'message',
]

const LOCATION_KEYS = [
  'event_loc',
  'eventLoc',
  'location',
  'loc',
  'track_location',
  'trackLocation',
]

const STATUS_KEYS = ['status', 'track_status', 'event_status', 'order_status']
const CODE_KEYS = ['event_code', 'eventCode', 'code', 'track_code']

function generateSampleEvents(order: Order): TrackingEvent[] {
  const createdAt = order.createdAt ?? new Date()
  const baseTime = createdAt.getTime()
  const shippingCity = order.shippingCity || 'Shenzhen'
  const destination = order.shippingCountry || 'Destination'

  const timeline = [
    {
      offset: 2 * 60 * 60 * 1000,
      description: '4PX已收到包裹信息',
      status: 'info_received',
      location: 'Shenzhen, CN',
      code: 'INFO_RECEIVED',
    },
    {
      offset: 24 * 60 * 60 * 1000,
      description: '包裹已从仓库发出',
      status: 'in_transit',
      location: `${shippingCity}, CN`,
      code: 'DEPARTED_FACILITY',
    },
    {
      offset: 3 * 24 * 60 * 60 * 1000,
      description: '包裹到达国际转运中心',
      status: 'in_transit',
      location: 'Hong Kong, CN',
      code: 'ARRIVED_TRANSIT',
    },
    {
      offset: 6 * 24 * 60 * 60 * 1000,
      description: '包裹到达目的国海关',
      status: 'customs',
      location: destination,
      code: 'ARRIVED_DESTINATION',
    },
    {
      offset: 7 * 24 * 60 * 60 * 1000,
      description: '当地承运商已揽收',
      status: 'out_for_delivery',
      location: destination,
      code: 'OUT_FOR_DELIVERY',
    },
  ]

  return timeline.map((event) => ({
    code: event.code,
    description: event.description,
    location: event.location,
    status: event.status as TrackingStatus,
    time: new Date(baseTime + event.offset).toISOString(),
  }))
}
