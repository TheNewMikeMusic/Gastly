import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminCredentials, createAdminSession } from '@/lib/admin-auth'

const ADMIN_SESSION_KEY = 'admin_session'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    const isValid = await verifyAdminCredentials(username, password)
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      )
    }

    const sessionToken = await createAdminSession()
    
    // 在响应中直接设置cookie
    const response = NextResponse.json({ success: true })
    
    // 设置cookie - 使用HTTP环境（secure: false）
    response.cookies.set(ADMIN_SESSION_KEY, sessionToken, {
      httpOnly: true,
      secure: false, // HTTP环境设为false
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'Login failed, please try again later' },
      { status: 500 }
    )
  }
}

