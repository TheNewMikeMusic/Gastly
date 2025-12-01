'use client'

import { SignIn } from '@clerk/nextjs'
import { Navigation } from '@/components/Navigation'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'

function SignInContent() {
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect_url') || '/'
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 检查Clerk配置
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  const isClerkConfigured = publishableKey && 
    publishableKey !== 'pk_test_dummy' && 
    !publishableKey.includes('你的Clerk') &&
    (publishableKey.startsWith('pk_test_') || publishableKey.startsWith('pk_live_'))

  if (!mounted) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-20 bg-white">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">加载中...</p>
          </div>
        </div>
      </>
    )
  }

  if (!isClerkConfigured) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-20 bg-white">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold mb-4 text-gray-900">登录不可用</h1>
            <p className="text-gray-600 mb-6">
              Clerk认证未配置。请检查环境变量设置。
            </p>
            <a
              href="/"
              className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-950 transition-colors"
            >
              返回首页
            </a>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-20 bg-white">
        <div className="w-full max-w-md">
          <SignIn
            appearance={{
              elements: {
                rootBox: 'mx-auto w-full',
                card: 'bg-white shadow-lg border border-gray-200/50 w-full',
                headerTitle: 'text-gray-900',
                headerSubtitle: 'text-gray-600',
                socialButtonsBlockButton: 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50',
                formButtonPrimary: 'bg-gray-900 text-white hover:bg-gray-950',
                formFieldInput: 'bg-white border-gray-300 text-gray-900',
                formFieldLabel: 'text-gray-700',
                footerActionLink: 'text-gray-900 hover:text-gray-700',
              },
            }}
            routing="path"
            path="/sign-in"
            fallbackRedirectUrl={redirectUrl}
            signUpUrl="/sign-up"
          />
        </div>
      </div>
    </>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-20 bg-white">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">加载中...</p>
          </div>
        </div>
      </>
    }>
      <SignInContent />
    </Suspense>
  )
}

