import { prisma } from './prisma'

export interface AddressInput {
  label?: string
  name: string
  phone: string
  email?: string
  address: string
  city: string
  state?: string
  zip: string
  country: string
  isDefault?: boolean
}

export async function saveAddress(userId: string, address: AddressInput) {
  // 如果设置为默认地址，取消其他默认地址
  if (address.isDefault) {
    await prisma.savedAddress.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    })
  }

  return await prisma.savedAddress.create({
    data: {
      userId,
      ...address,
    },
  })
}

export async function getAddresses(userId: string) {
  return await prisma.savedAddress.findMany({
    where: { userId },
    orderBy: [
      { isDefault: 'desc' },
      { createdAt: 'desc' },
    ],
  })
}

export async function getDefaultAddress(userId: string) {
  return await prisma.savedAddress.findFirst({
    where: {
      userId,
      isDefault: true,
    },
  })
}

export async function updateAddress(userId: string, addressId: string, address: Partial<AddressInput>) {
  // 如果设置为默认地址，取消其他默认地址
  if (address.isDefault) {
    await prisma.savedAddress.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    })
  }

  return await prisma.savedAddress.update({
    where: { id: addressId },
    data: address,
  })
}

export async function deleteAddress(userId: string, addressId: string) {
  return await prisma.savedAddress.delete({
    where: { id: addressId },
  })
}

