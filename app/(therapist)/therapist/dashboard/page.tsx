'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useIsMobile } from '@/hooks/use-mobile'
import MobileTabBar from '@/components/mobile-tab-bar'
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
  const [activeTab, setActiveTab] = useState('patients')
  const isMobile = useIsMobile()

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

  const tabConfig = useMemo(() => ([
    { value: 'patients', label: t('therapist.myPatients') },
    { value: 'create', label: t('therapist.createPlan') },
    { value: 'notes', label: t('therapist.viewNotes') },
    { value: 'sessions', label: t('therapist.sessions') },
  ]), [t])

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

      <main className="container mx-auto px-4 py-6 pb-28 md:py-8 md:pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t('therapist.dashboard')}
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome, Dr. {user?.fullName}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="mb-8 grid h-auto w-full grid-cols-2 gap-2 rounded-3xl border border-white/70 bg-white/80 p-2 shadow-sm md:grid-cols-4">
            {tabConfig.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="rounded-2xl px-4 py-2 data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                {tab.label}
              </TabsTrigger>
            ))}
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

      {isMobile ? (
        <MobileTabBar items={tabConfig} value={activeTab} onValueChange={setActiveTab} />
      ) : null}
    </div>
  )
}
