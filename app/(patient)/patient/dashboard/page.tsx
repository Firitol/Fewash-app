'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PatientNav from '@/components/patient/patient-nav'
import TreatmentPlans from '@/components/patient/treatment-plans'
import GoalsSection from '@/components/patient/goals-section'
import ActionsSection from '@/components/patient/actions-section'
import ChillZone from '@/components/patient/chill-zone'
import MoodLog from '@/components/patient/mood-log'
import MindshiftToolkit from '@/components/patient/mindshift-toolkit'
import ShareExperience from '@/components/patient/share-experience'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Brain, HeartHandshake, Home, Share2, Sparkles, Target, Wind } from 'lucide-react'

const quickReliefActions = [
  { label: 'Take a breath', icon: Wind },
  { label: 'Shift your thinking', icon: Brain },
  { label: 'Ground yourself', icon: Sparkles },
  { label: 'Take a small step', icon: Target },
  { label: 'Get help', icon: HeartHandshake },
]

export default function PatientDashboard() {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('home')
  const [summary, setSummary] = useState({ plans: [], goals: [], actions: [], moodLogs: [] } as any)
  const [reliefOpen, setReliefOpen] = useState(false)

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
    { value: 'home', label: 'Home', icon: Home },
    { value: 'community', label: 'Community', icon: Share2 },
    { value: 'goals', label: 'Goals', icon: Target },
    { value: 'tools', label: 'Tools', icon: Brain },
  ]), [])

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white"><div className="text-xl">{t('common.loading')}</div></div>
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#111827_0%,#3b1d72_26%,#d7ebff_100%)]">
      <PatientNav user={user} onLanguageToggle={toggleLanguage} />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 text-white">
          <Badge className="rounded-full bg-white/15 px-4 py-1.5 text-white hover:bg-white/15">MindShift-style mobile experience</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">When you need help fast.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/75">
            Your patient dashboard now feels more like a polished wellness app: quick relief tools, daily check-ins, guided meditations, supportive community features, and action-focused progress tracking.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[430px,1fr] lg:items-start">
          <div className="mx-auto w-full max-w-[430px] rounded-[2.7rem] border border-white/20 bg-[#f8fbff] p-3 shadow-[0_30px_100px_rgba(16,24,40,0.45)]">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="relative overflow-hidden rounded-[2.2rem] bg-white shadow-inner">
              <div className="bg-[linear-gradient(180deg,#9a59ff_0%,#7c74ff_100%)] px-5 pb-6 pt-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-white/70">Daily check-in</p>
                    <h2 className="mt-2 text-2xl font-semibold">How are you today, {user?.fullName?.split(' ')[0] || 'there'}?</h2>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-full bg-white/10 text-white hover:bg-white/15" onClick={() => setReliefOpen((open) => !open)}>
                    <Sparkles className="h-5 w-5" />
                  </Button>
                </div>
                <p className="mt-3 text-sm text-white/75">Use the tools below to check in, get calm quickly, take action, and stay connected.</p>
              </div>

              <div className="relative min-h-[860px] bg-[linear-gradient(180deg,#ffffff_0%,#f6f9ff_100%)] px-4 pb-28 pt-4">
                {reliefOpen && (
                  <div className="absolute inset-0 z-30 flex items-end justify-center bg-slate-950/45 px-6 pb-24 pt-6 backdrop-blur-[2px]">
                    <div className="flex flex-col items-center gap-4 rounded-[2rem] bg-[radial-gradient(circle_at_top,#3e2a67_0%,#1f1c37_70%)] px-8 py-8 text-white shadow-[0_28px_90px_rgba(31,28,55,0.45)]">
                      <p className="text-2xl font-semibold">Quick Relief</p>
                      {quickReliefActions.map((action) => {
                        const Icon = action.icon
                        return (
                          <button key={action.label} type="button" className="flex flex-col items-center gap-2 text-center">
                            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#69a6ff] shadow-[0_14px_30px_rgba(105,166,255,0.4)]"><Icon className="h-7 w-7" /></span>
                            <span className="text-sm font-medium">{action.label}</span>
                          </button>
                        )
                      })}
                      <Button size="icon" onClick={() => setReliefOpen(false)} className="mt-2 h-14 w-14 rounded-full bg-white text-[#3b82f6] hover:bg-white">×</Button>
                    </div>
                  </div>
                )}

                <TabsContent value="home" className="mt-0 space-y-5">
                  <MoodLog userId={user?.userId} fullName={user?.fullName} />
                  <ActionsSection userId={user?.userId} />
                </TabsContent>

                <TabsContent value="community" className="mt-0">
                  <ShareExperience fullName={user?.fullName} />
                </TabsContent>

                <TabsContent value="goals" className="mt-0 space-y-5">
                  <GoalsSection userId={user?.userId} />
                  <TreatmentPlans userId={user?.userId} />
                </TabsContent>

                <TabsContent value="tools" className="mt-0 space-y-5">
                  <MindshiftToolkit />
                  <ChillZone language={i18n.language} />
                </TabsContent>
              </div>

              <TabsList className="absolute inset-x-4 bottom-4 z-40 grid h-20 grid-cols-5 rounded-[1.9rem] border border-slate-200 bg-white/95 p-2 shadow-[0_18px_50px_rgba(88,126,255,0.2)] backdrop-blur">
                {tabConfig.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <TabsTrigger key={tab.value} value={tab.value} className="flex h-full flex-col gap-1 rounded-[1.3rem] text-[11px] text-slate-500 data-[state=active]:bg-[#eef4ff] data-[state=active]:text-[#0e5fd8]">
                      <Icon className="h-5 w-5" />
                      {tab.label}
                    </TabsTrigger>
                  )
                })}
                <button
                  type="button"
                  onClick={() => setReliefOpen((open) => !open)}
                  className="-mt-8 flex h-16 w-16 items-center justify-center self-center justify-self-center rounded-full bg-[linear-gradient(180deg,#67b0ff_0%,#4f8ff8_100%)] text-white shadow-[0_18px_40px_rgba(79,143,248,0.45)]"
                >
                  <Sparkles className="h-7 w-7" />
                </button>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-5 text-white">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[2rem] border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
                <p className="text-sm text-white/70">Mood entries</p>
                <p className="mt-2 text-4xl font-semibold">{summary.moodLogs.length}</p>
                <p className="mt-2 text-sm text-white/65">Daily check-ins tracked over time.</p>
              </div>
              <div className="rounded-[2rem] border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
                <p className="text-sm text-white/70">Actions completed</p>
                <p className="mt-2 text-4xl font-semibold">{summary.actions.filter((action: any) => action.status === 'completed').length}</p>
                <p className="mt-2 text-sm text-white/65">Tiny wins that move recovery forward.</p>
              </div>
              <div className="rounded-[2rem] border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
                <p className="text-sm text-white/70">Active goals</p>
                <p className="mt-2 text-4xl font-semibold">{summary.goals.length}</p>
                <p className="mt-2 text-sm text-white/65">Your current focus areas and milestones.</p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/15 bg-white/10 p-6 backdrop-blur-xl">
              <h3 className="text-2xl font-semibold">Professional app-style upgrades</h3>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-white/80">
                <li>• A stronger mobile-first shell with bottom navigation and a centered quick relief action button.</li>
                <li>• Daily check-in UI redesigned to feel much closer to the provided references, with clearer hierarchy and polished CTA buttons.</li>
                <li>• Guided meditation, community support, and action cards restyled to feel more like a premium mental wellness application.</li>
                <li>• Your existing plans, goals, actions, and mood data still power the experience instead of replacing your backend structure.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
