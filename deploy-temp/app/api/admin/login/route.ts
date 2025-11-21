import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminCredentials, createAdminSession, setAdminSession } from '@/lib/admin-auth'

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
    await setAdminSession(sessionToken)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'Login failed, please try again later' },
      { status: 500 }
    )
  }
}

