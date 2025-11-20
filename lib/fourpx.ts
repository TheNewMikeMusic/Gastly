import crypto from 'crypto'

type PrimitiveRecord = Record<string, string>

export interface FourPXClientConfig {
  appKey: string
  appSecret: string
  customerCode?: string
  endpoint?: string
  apiVersion?: string
  method?: string
}

export interface FourPXTrackOptions {
  trackingNumber: string
  referenceNumber?: string
  logisticsOrderNo?: string
  countryCode?: string | null
  postalCode?: string | null
  forceMethod?: string
}

export interface FourPXCreateOrderOptions {
  refNo: string // 参考号（客户自有系统的单号）
  businessType?: string // 业务类型，默认BDS
  dutyType: 'U' | 'P' // U：DDU由收件人支付关税; P：DDP 由寄件方支付关税
  cargoType?: string // 货物类型（1：礼品;2：文件;3：商品货样;5：其它；默认值：5）
  sender: {
    name: string
    phone: string
    email?: string
    country: string
    state?: string
    city: string
    address: string
    zip?: string
  }
  recipient: {
    name: string
    phone: string
    email?: string
    country: string
    state?: string
    city: string
    address: string
    zip: string
  }
  parcelList: Array<{
    sku?: string
    name: string
    nameEn?: string
    quantity: number
    unitPrice: number
    currency: string
    weight?: number
    hsCode?: string
  }>
  logisticsServiceInfo: {
    productCode: string // 物流产品代码
  }
  returnInfo: {
    name: string
    phone: string
    country: string
    state?: string
    city: string
    address: string
    zip?: string
  }
  deliverTypeInfo: {
    deliverType: string // 到仓方式代码
  }
  deliverToRecipientInfo: {
    deliverType: string // 投递方式代码
  }
  isInsure: 'Y' | 'N'
  insuranceInfo?: {
    insuranceType: string
    insuranceAmount: number
    currency: string
  }
  // 可选字段
  vatNo?: string
  eoriNo?: string
  iossNo?: string
  buyerId?: string
  salesPlatform?: string
  tradeId?: string
  sellerId?: string
  freightCharges?: number
  currencyFreight?: string
  declareInsurance?: number
  currencyDeclareInsurance?: string
  parcelQty?: number
  isCommercialInvoice?: 'Y' | 'N'
}

export class FourPXClient {
  private config: Required<Pick<FourPXClientConfig, 'appKey' | 'appSecret'>> &
    Omit<FourPXClientConfig, 'appKey' | 'appSecret'>

  constructor(config?: Partial<FourPXClientConfig>) {
    const envConfig = getEnvConfig()
    const finalConfig = { ...envConfig, ...config }

    this.config = {
      appKey: finalConfig.appKey,
      appSecret: finalConfig.appSecret,
      customerCode: finalConfig.customerCode,
      endpoint: finalConfig.endpoint,
      apiVersion: finalConfig.apiVersion ?? '2.0',
      method: finalConfig.method ?? 'transfer.order.tracking',
    }
  }

  get isConfigured() {
    return Boolean(this.config.appKey && this.config.appSecret)
  }

  async track(options: FourPXTrackOptions) {
    if (!this.isConfigured) {
      throw new Error('FOURPX credentials are not configured')
    }

    const bodyPayload = buildParamPayload({
      ...options,
      customerCode: this.config.customerCode,
    })
    const bodyString = JSON.stringify(bodyPayload)

    const queryParams: PrimitiveRecord = {
      method: options.forceMethod ?? this.config.method ?? 'transfer.order.tracking',
      app_key: this.config.appKey,
      v: this.config.apiVersion ?? '2.0',
      timestamp: formatTimestamp(new Date()),
      format: 'json',
    }

    const sign = this.buildSignature(queryParams, bodyString)

    const url = new URL(this.config.endpoint ?? DEFAULT_ENDPOINT)
    Object.entries({ ...queryParams, sign }).forEach(([key, value]) => {
      if (typeof value !== 'undefined') {
        url.searchParams.append(key, value)
      }
    })

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      body: bodyString,
    })

    const responseText = await response.text()

    if (!response.ok) {
      throw new Error(`4PX request failed (${response.status}): ${responseText}`)
    }

    try {
      return JSON.parse(responseText)
    } catch (error) {
      throw new Error(`Unable to parse 4PX response: ${(error as Error).message}`)
    }
  }

  async createOrder(options: FourPXCreateOrderOptions) {
    if (!this.isConfigured) {
      throw new Error('FOURPX credentials are not configured')
    }

    const bodyPayload = buildCreateOrderPayload(options)
    const bodyString = JSON.stringify(bodyPayload)

    const queryParams: PrimitiveRecord = {
      method: 'ds.xms.order.create',
      app_key: this.config.appKey,
      v: '1.0',
      timestamp: formatTimestamp(new Date()),
      format: 'json',
    }

    const sign = this.buildSignature(queryParams, bodyString)

    const url = new URL(this.config.endpoint ?? DEFAULT_ENDPOINT)
    Object.entries({ ...queryParams, sign }).forEach(([key, value]) => {
      if (typeof value !== 'undefined') {
        url.searchParams.append(key, value)
      }
    })

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      body: bodyString,
    })

    const responseText = await response.text()

    if (!response.ok) {
      throw new Error(`4PX create order failed (${response.status}): ${responseText}`)
    }

    try {
      return JSON.parse(responseText)
    } catch (error) {
      throw new Error(`Unable to parse 4PX response: ${(error as Error).message}`)
    }
  }

  private buildSignature(params: PrimitiveRecord, bodyString: string) {
    const sortedKeys = Object.keys(params).sort()
    const concatenated =
      sortedKeys.map((key) => `${key}${params[key] ?? ''}`).join('') + bodyString + this.config.appSecret
    return crypto
      .createHash('md5')
      .update(concatenated)
      .digest('hex')
  }
}

const DEFAULT_ENDPOINT = 'https://open.4px.com/router/api/service'

function formatTimestamp(date: Date) {
  return date.getTime().toString()
}

function buildParamPayload(options: FourPXTrackOptions & { customerCode?: string }) {
  const payload: Record<string, string> = {
    tracking_no: options.trackingNumber,
  }

  if (options.customerCode) {
    payload.customer_code = options.customerCode
  }

  if (options.referenceNumber) {
    payload.reference_no = options.referenceNumber
  }

  if (options.logisticsOrderNo) {
    payload.logistics_no = options.logisticsOrderNo
  }

  if (options.countryCode) {
    payload.destination_country = options.countryCode
  }

  if (options.postalCode) {
    payload.destination_postcode = options.postalCode
  }

  return payload
}

function buildCreateOrderPayload(options: FourPXCreateOrderOptions) {
  const payload: any = {
    ref_no: options.refNo,
    business_type: options.businessType || 'BDS',
    duty_type: options.dutyType,
    cargo_type: options.cargoType || '5',
    sender: {
      name: options.sender.name,
      phone: options.sender.phone,
      country: options.sender.country,
      city: options.sender.city,
      address: options.sender.address,
    },
    recipient_info: {
      name: options.recipient.name,
      phone: options.recipient.phone,
      country: options.recipient.country,
      city: options.recipient.city,
      address: options.recipient.address,
      zip: options.recipient.zip,
    },
    parcel_list: options.parcelList.map((p) => ({
      name: p.name,
      quantity: p.quantity,
      unit_price: p.unitPrice,
      currency: p.currency,
    })),
    logistics_service_info: {
      product_code: options.logisticsServiceInfo.productCode,
    },
    return_info: {
      name: options.returnInfo.name,
      phone: options.returnInfo.phone,
      country: options.returnInfo.country,
      city: options.returnInfo.city,
      address: options.returnInfo.address,
    },
    deliver_type_info: {
      deliver_type: options.deliverTypeInfo.deliverType,
    },
    deliver_to_recipient_info: {
      deliver_type: options.deliverToRecipientInfo.deliverType,
    },
    is_insure: options.isInsure,
  }

  // 添加可选字段
  if (options.sender.email) payload.sender.email = options.sender.email
  if (options.sender.state) payload.sender.state = options.sender.state
  if (options.sender.zip) payload.sender.zip = options.sender.zip
  if (options.recipient.email) payload.recipient_info.email = options.recipient.email
  if (options.recipient.state) payload.recipient_info.state = options.recipient.state
  if (options.returnInfo.state) payload.return_info.state = options.returnInfo.state
  if (options.returnInfo.zip) payload.return_info.zip = options.returnInfo.zip

  if (options.vatNo) payload.vat_no = options.vatNo
  if (options.eoriNo) payload.eori_no = options.eoriNo
  if (options.iossNo) payload.ioss_no = options.iossNo
  if (options.buyerId) payload.buyer_id = options.buyerId
  if (options.salesPlatform) payload.sales_platform = options.salesPlatform
  if (options.tradeId) payload.trade_id = options.tradeId
  if (options.sellerId) payload.seller_id = options.sellerId
  if (options.freightCharges !== undefined) payload.freight_charges = options.freightCharges
  if (options.currencyFreight) payload.currency_freight = options.currencyFreight
  if (options.declareInsurance !== undefined) payload.declare_insurance = options.declareInsurance
  if (options.currencyDeclareInsurance) payload.currency_declare_insurance = options.currencyDeclareInsurance
  if (options.parcelQty) payload.parcel_qty = options.parcelQty
  if (options.isCommercialInvoice) payload.is_commercial_invoice = options.isCommercialInvoice

  if (options.insuranceInfo && options.isInsure === 'Y') {
    payload.insurance_info = {
      insurance_type: options.insuranceInfo.insuranceType,
      insurance_amount: options.insuranceInfo.insuranceAmount,
      currency: options.insuranceInfo.currency,
    }
  }

  // 处理包裹列表的额外字段
  options.parcelList.forEach((p, index) => {
    if (p.sku) payload.parcel_list[index].sku = p.sku
    if (p.nameEn) payload.parcel_list[index].name_en = p.nameEn
    if (p.weight !== undefined) payload.parcel_list[index].weight = p.weight
    if (p.hsCode) payload.parcel_list[index].hs_code = p.hsCode
  })

  return payload
}

function getEnvConfig(): FourPXClientConfig {
  return {
    appKey: process.env.FOURPX_API_KEY || '',
    appSecret: process.env.FOURPX_API_SECRET || '',
    customerCode: process.env.FOURPX_CUSTOMER_CODE,
    endpoint: process.env.FOURPX_API_ENDPOINT || DEFAULT_ENDPOINT,
    method: process.env.FOURPX_TRACKING_METHOD,
  }
}

let cachedClient: FourPXClient | null = null

export function getFourPXClient() {
  if (!cachedClient) {
    cachedClient = new FourPXClient()
  }
  return cachedClient
}
