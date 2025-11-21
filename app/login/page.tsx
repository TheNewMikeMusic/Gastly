import { Navigation } from '@/components/Navigation'

export default function LoginPage() {
  const hasClerk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== 'pk_test_dummy'
  
  if (!hasClerk) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center px-4 pt-24">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Login</h1>
            <p className="text-foreground/70 mb-8">
              Clerk authentication is not configured. Please set up Clerk keys in .env.local to enable login.
            </p>
            <a
              href="/"
              className="inline-block px-6 py-3 bg-foreground text-background rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Back to Home
            </a>
          </div>
        </div>
      </>
    )
  }
  
  // 动态导入 SignIn 组件
  const { SignIn } = require('@clerk/nextjs')
  
  return (
    <>
      <Navigation />
      <div className="min-h-screen flex items-center justify-center px-4 pt-24 bg-white">
        <SignIn
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'bg-white shadow-lg border border-gray-200/50',
              headerTitle: 'text-gray-900',
              headerSubtitle: 'text-gray-600',
              socialButtonsBlockButton: 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50',
              formButtonPrimary: 'bg-gray-900 text-white hover:bg-gray-950',
              formFieldInput: 'bg-white border-gray-300 text-gray-900',
              formFieldLabel: 'text-gray-700',
              footerActionLink: 'text-gray-900 hover:text-gray-700',
            },
          }}
        />
      </div>
    </>
  )
}

