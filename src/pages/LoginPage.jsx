import React from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LogIn } from 'lucide-react'

const LoginPage = () => {
  const { login, isLoading } = useAuth()

  const handleLogin = () => {
    login()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Club House Tags Admin
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please sign in to access the admin panel
          </p>
        </div>

        <Card className="mt-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>
              Use your Auth0 credentials to access the system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2"
              size="lg"
            >
              <LogIn className="h-5 w-5" />
              {isLoading ? 'Signing in...' : 'Sign in with Auth0'}
            </Button>

            <div className="text-center text-sm text-gray-500">
              <p>Secure authentication powered by Auth0</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage
