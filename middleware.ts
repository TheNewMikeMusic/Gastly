import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Conditional Clerk middleware support
const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
const isClerkConfigured = publishableKey && 
  publishableKey !== 'pk_test_dummy' && 
  !publishableKey.includes('你的Clerk')

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
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

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Handle admin routes separately
  if (isAdminRoute(pathname)) {
    const hasAdminSession = await checkAdminSession(request)
    if (!hasAdminSession) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // Use Clerk middleware if configured
  if (isClerkConfigured) {
    return clerkMiddleware(async (auth, req) => {
      // Protect routes that are not public
      if (!isPublicRoute(req)) {
        // Check authentication status
        const { userId } = await auth()
        if (!userId) {
          // Redirect to sign-in if not authenticated
          const signInUrl = new URL('/sign-in', req.url)
          signInUrl.searchParams.set('redirect_url', req.url)
          return NextResponse.redirect(signInUrl)
        }
      }
    })(request)
  }
  
  // Fallback: allow all routes if Clerk is not configured
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
