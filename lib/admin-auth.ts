import { cookies } from 'next/headers'
import crypto from 'crypto'

const ADMIN_USERNAME = 'Alex'
const ADMIN_PASSWORD = '13572468a'
const ADMIN_SESSION_KEY = 'admin_session'
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'change-this-secret-key-in-production'

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD
}

export async function createAdminSession(): Promise<string> {
  // 生成一个64字符的hex token作为session
  const sessionToken = crypto.randomBytes(32).toString('hex')
  return sessionToken
}

export async function verifyAdminSession(sessionToken: string | undefined): Promise<boolean> {
  if (!sessionToken) {
    return false
  }

  // 简单的验证：检查session token是否存在且格式正确
  // 在生产环境中，应该存储session到数据库或Redis中
  try {
    // 验证token是否为有效的hex字符串
    if (!/^[0-9a-f]{64}$/i.test(sessionToken)) {
      return false
    }
    // 这里可以添加更复杂的验证逻辑，比如检查token是否在有效期内
    // 目前使用简单的存在性检查
    return true
  } catch {
    return false
  }
}

export async function getAdminSession(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(ADMIN_SESSION_KEY)?.value || null
}

export async function setAdminSession(sessionToken: string) {
  const cookieStore = await cookies()
  cookieStore.set(ADMIN_SESSION_KEY, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export async function clearAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_SESSION_KEY)
}

export async function requireAdmin(): Promise<boolean> {
  const session = await getAdminSession()
  return await verifyAdminSession(session)
}

