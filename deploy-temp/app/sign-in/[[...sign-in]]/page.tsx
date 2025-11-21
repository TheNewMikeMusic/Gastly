import { SignIn } from '@clerk/nextjs'
import { Navigation } from '@/components/Navigation'

export default function SignInPage({
  searchParams,
}: {
  searchParams: { redirect_url?: string }
}) {
  return (
    <>
      <Navigation />
      <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-20">
        <SignIn
          appearance={{
            elements: {
              rootBox: 'mx-auto',
            },
          }}
          routing="path"
          path="/sign-in"
          fallbackRedirectUrl={searchParams.redirect_url || '/checkout'}
          signUpUrl="/sign-up"
        />
      </div>
    </>
  )
}

