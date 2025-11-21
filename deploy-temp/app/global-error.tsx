'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 记录全局错误到控制台或错误监控服务
    console.error('Global error:', error)
  }, [error])

  return (
    <html lang="zh-CN">
      <body>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="text-6xl">⚠️</div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">严重错误</h1>
              <p className="text-gray-600">
                应用程序遇到了严重错误。请刷新页面或联系支持。
              </p>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4 text-left bg-gray-50 rounded-lg p-4">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                  错误详情（开发模式）
                </summary>
                <pre className="mt-2 text-xs text-gray-600 overflow-auto">
                  {error.message}
                  {error.stack && `\n\n${error.stack}`}
                </pre>
              </details>
            )}
            <div className="flex gap-4 justify-center">
              <button
                onClick={reset}
                className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-950 transition-colors"
              >
                重试
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                返回首页
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}


