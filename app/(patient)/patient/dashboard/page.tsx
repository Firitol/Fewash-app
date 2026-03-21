'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useIsMobile } from '@/hooks/use-mobile'
import MobileTabBar from '@/components/mobile-tab-bar'
import PatientNav from '@/components/patient/patient-nav'
import TreatmentPlans from '@/components/patient/treatment-plans'
import GoalsSection from '@/components/patient/goals-section'
import ActionsSection from '@/components/patient/actions-section'
import ChillZone from '@/components/patient/chill-zone'
import MoodLog from '@/components/patient/mood-log'
import DashboardOverview from '@/components/patient/dashboard-overview'
import MindshiftToolkit from '@/components/patient/mindshift-toolkit'
import ShareExperience from '@/components/patient/share-experience'

export default function PatientDashboard() {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [summary, setSummary] = useState({ plans: [], goals: [], actions: [], moodLogs: [] } as any)
  const isMobile = useIsMobile()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (!response.ok) {
          router.push('/login')
          return
        }
        const userData = await response.json()
        setUser(userData)

        const userId = userData?.userId
        if (userId) {
          const [plansRes, goalsRes, actionsRes, moodRes] = await Promise.all([
            fetch(`/api/treatment-plans?userId=${userId}`),
            fetch(`/api/goals?userId=${userId}`),
            fetch(`/api/actions?userId=${userId}`),
            fetch(`/api/mood-logs?userId=${userId}`),
          ])

          const [plans, goals, actions, moodLogs] = await Promise.all([
            plansRes.ok ? plansRes.json() : [],
            goalsRes.ok ? goalsRes.json() : [],
            actionsRes.ok ? actionsRes.json() : [],
            moodRes.ok ? moodRes.json() : [],
          ])

          setSummary({ plans, goals, actions, moodLogs })
        }
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
    { value: 'overview', label: 'Overview' },
    { value: 'toolkit', label: 'Toolkit' },
    { value: 'plans', label: t('patient.myPlans') },
    { value: 'goals', label: t('patient.myGoals') },
    { value: 'actions', label: t('patient.myActions') },
    { value: 'mood', label: t('patient.moodLog') },
    { value: 'chill', label: t('patient.chillZone') },
    { value: 'share', label: 'Share & stories' },
  ]), [t])

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white"><div className="text-xl">{t('common.loading')}</div></div>
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#f8fbff_0%,#eef2ff_46%,#fdf2f8_100%)]">
      <PatientNav user={user} onLanguageToggle={toggleLanguage} />

      <main className="container mx-auto space-y-6 px-4 py-6 pb-28 md:space-y-8 md:py-8 md:pb-8">
        <div className="flex flex-col gap-3">
          <div className="inline-flex w-fit items-center rounded-full border border-violet-200 bg-white/80 px-4 py-1 text-sm font-medium text-violet-700 shadow-sm">
            Elevated self-help dashboard
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              {t('patient.dashboard')}
            </h1>
            <p className="mt-2 max-w-3xl text-slate-600">
              A richer, more beautiful patient experience with guided tools, progress insights, shareable updates, and reflection spaces inspired by modern mental wellness apps.
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="no-scrollbar flex h-auto w-full justify-start gap-2 overflow-x-auto rounded-3xl border border-white/70 bg-white/80 p-2 shadow-sm md:flex-wrap md:overflow-visible">
            {tabConfig.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="shrink-0 rounded-2xl px-4 py-2 data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview">
            <DashboardOverview
              fullName={user?.fullName}
              plans={summary.plans}
              goals={summary.goals}
              actions={summary.actions}
              moodLogs={summary.moodLogs}
              onNavigate={setActiveTab}
            />
          </TabsContent>

          <TabsContent value="toolkit">
            <MindshiftToolkit />
          </TabsContent>

          <TabsContent value="plans">
            <TreatmentPlans userId={user?.userId} />
          </TabsContent>

          <TabsContent value="goals">
            <GoalsSection userId={user?.userId} />
          </TabsContent>

          <TabsContent value="actions">
            <ActionsSection userId={user?.userId} />
          </TabsContent>

          <TabsContent value="mood">
            <MoodLog userId={user?.userId} />
          </TabsContent>

          <TabsContent value="chill">
            <ChillZone language={i18n.language} />
          </TabsContent>

          <TabsContent value="share">
            <ShareExperience fullName={user?.fullName} />
          </TabsContent>
        </Tabs>
      </main>

      {isMobile ? (
        <MobileTabBar items={tabConfig} value={activeTab} onValueChange={setActiveTab} variant="patient" />
      ) : null}
    </div>
  )
}
