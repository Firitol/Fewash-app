'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import TherapistNav from '@/components/therapist/therapist-nav'
import PatientList from '@/components/therapist/patient-list'
import CreatePlan from '@/components/therapist/create-plan'
import TherapistNotes from '@/components/therapist/therapist-notes'
import Sessions from '@/components/therapist/sessions'

export default function TherapistDashboard() {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check authentication and get user data
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (!response.ok) {
          router.push('/login')
          return
        }
        const userData = await response.json()
        setUser(userData)
      } catch (error) {
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'am' ? 'om' : 'am')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">{t('common.loading')}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      <TherapistNav user={user} onLanguageToggle={toggleLanguage} />

      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t('therapist.dashboard')}
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome, Dr. {user?.fullName}
          </p>
        </div>

        <Tabs defaultValue="patients" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="patients">{t('therapist.myPatients')}</TabsTrigger>
            <TabsTrigger value="create">{t('therapist.createPlan')}</TabsTrigger>
            <TabsTrigger value="notes">{t('therapist.viewNotes')}</TabsTrigger>
            <TabsTrigger value="sessions">{t('therapist.sessions')}</TabsTrigger>
          </TabsList>

          <TabsContent value="patients">
            <PatientList therapistId={user?.userId} />
          </TabsContent>

          <TabsContent value="create">
            <CreatePlan therapistId={user?.userId} />
          </TabsContent>

          <TabsContent value="notes">
            <TherapistNotes therapistId={user?.userId} />
          </TabsContent>

          <TabsContent value="sessions">
            <Sessions therapistId={user?.userId} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
