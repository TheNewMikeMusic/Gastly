import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Conditional Clerk middleware support
const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
const isClerkConfigured = publishableKey && 
  publishableKey !== 'pk_test_dummy' && 
  !publishableKey.includes('你的Clerk') &&
  !publishableKey.includes('placeholder') &&
  (publishableKey.startsWith('pk_test_') || publishableKey.startsWith('pk_live_'))

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/',
  '/contact',
  '/privacy',
  '/terms',
  '/success',
  '/admin/login', // 管理员登录页面是公开的
])

// Admin routes that require admin authentication
const isAdminRoute = (pathname: string) => {
  return pathname.startsWith('/admin') && pathname !== '/admin/login'
}

// Check admin session from cookies
async function checkAdminSession(request: NextRequest): Promise<boolean> {
  const sessionCookie = request.cookies.get('admin_session')
  if (!sessionCookie?.value) {
    return false
  }
  // 简单的验证：检查session token格式
  return /^[0-9a-f]{64}$/i.test(sessionCookie.value)
}

// 基础中间件函数（不依赖 Clerk）
async function baseMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // API routes should not be protected by Clerk authentication
  // They handle their own authentication if needed
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Handle admin routes separately
  if (isAdminRoute(pathname)) {
    const hasAdminSession = await checkAdminSession(req)
    if (!hasAdminSession) {
      const loginUrl = new URL('/admin/login', req.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }
  
  return NextResponse.next()
}

// 根据 Clerk 配置选择中间件
const middleware = isClerkConfigured
  ? clerkMiddleware(async (auth, req: NextRequest) => {
      const { pathname } = req.nextUrl

      // Handle admin routes separately
      if (isAdminRoute(pathname)) {
        const hasAdminSession = await checkAdminSession(req)
        if (!hasAdminSession) {
          const loginUrl = new URL('/admin/login', req.url)
          loginUrl.searchParams.set('redirect', pathname)
          return NextResponse.redirect(loginUrl)
        }
        return NextResponse.next()
      }

      // API routes should not be protected by Clerk
      if (pathname.startsWith('/api/')) {
        return NextResponse.next()
      }

      // Protect routes that are not public (only if Clerk is configured)
      // But don't protect if it's a public route
      if (!isPublicRoute(req)) {
        try {
          await auth().protect()
        } catch (error) {
          // If protection fails, redirect to sign-in
          const signInUrl = new URL('/sign-in', req.url)
          signInUrl.searchParams.set('redirect_url', pathname)
          return NextResponse.redirect(signInUrl)
        }
      }
      
      return NextResponse.next()
    })
  : baseMiddleware

export default middleware

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|mp4|mov|avi|webm)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
