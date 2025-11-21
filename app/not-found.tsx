import { Navigation } from '@/components/Navigation'
import Link from 'next/link'

export default function NotFound() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen flex items-center justify-center px-4 pt-24">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="text-6xl">🔍</div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700">页面未找到</h2>
            <p className="text-gray-600">
              抱歉，您访问的页面不存在或已被移动。
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-950 transition-colors"
            >
              返回首页
            </Link>
            <Link
              href="/account"
              className="px-6 py-3 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              我的订单
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}




