'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const user = await response.json()
          // Redirect to appropriate dashboard based on role
          if (user.role === 'therapist') {
            router.push('/therapist/dashboard')
          } else {
            router.push('/patient/dashboard')
          }
        } else {
          // Not authenticated, redirect to login
          router.push('/login')
        }
      } catch (error) {
        // Error checking auth, redirect to login
        router.push('/login')
      }
    }

    checkAuth()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <main className="flex w-full max-w-3xl flex-col items-center gap-8 px-6 py-16 text-center sm:items-start sm:text-left">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Hakim
          </h1>
          <p className="max-w-md text-lg text-muted-foreground">
            Redirecting...
          </p>
        </div>
      </main>
    </div>
  );
}
