'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'

export default function LoginPage() {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || t('common.error'))
        return
      }

      // Redirect based on role
      if (data.role === 'therapist') {
        router.push('/therapist/dashboard')
      } else {
        router.push('/patient/dashboard')
      }
    } catch (err) {
      setError(t('common.error'))
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'am' ? 'om' : 'am')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <Button variant="outline" size="sm" onClick={toggleLanguage}>
          {i18n.language === 'am' ? 'አማርኛ' : 'ኦሮሞ'}
        </Button>
      </div>

      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-blue-600">Hakim</CardTitle>
          <CardDescription className="text-lg mt-2">
            {t('auth.login')}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium">{t('auth.email')}</label>
              <Input
                type="email"
                placeholder={t('auth.email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">{t('auth.password')}</label>
              <Input
                type="password"
                placeholder={t('auth.password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  {t('common.loading')}
                </>
              ) : (
                t('auth.login')
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              {t('auth.alreadyHaveAccount')}{' '}
              <Link href="/register" className="text-blue-600 hover:underline font-semibold">
                {t('auth.createNewAccount')}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
