import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 预览模式：暂时禁用 Clerk 中间件，允许所有路由访问
export default function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
