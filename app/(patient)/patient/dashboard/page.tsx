'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { useIsMobile } from '@/hooks/use-mobile'
import MobileTabBar from '@/components/mobile-tab-bar'
import PatientNav from '@/components/patient/patient-nav'
import TreatmentPlans from '@/components/patient/treatment-plans'
import GoalsSection from '@/components/patient/goals-section'
import ActionsSection from '@/components/patient/actions-section'
import ChillZone from '@/components/patient/chill-zone'
import MoodLog from '@/components/patient/mood-log'
import MindshiftToolkit from '@/components/patient/mindshift-toolkit'
import ShareExperience from '@/components/patient/share-experience'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Brain, 
  HeartPulse, 
  Target, 
  TrendingUp, 
  Sparkles, 
  Bell, 
  Settings, 
  ChevronRight,
  Calendar,
  Activity,
  BookOpen,
  Smile,
  Sun,
  Moon,
  Coffee
} from 'lucide-react'

export default function PatientDashboard() {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('home')
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

  const mobileTabConfig = useMemo(() => ([
    { value: 'home', label: 'Home' },
    { value: 'goals', label: 'Goals' },
    { value: 'me', label: 'Me' },
    { value: 'action', label: 'Action' },
  ]), [])

  const completedActions = summary.actions.filter((a: any) => a.status === 'completed').length
  const totalActions = summary.actions.length
  const progressValue = totalActions ? Math.round((completedActions / totalActions) * 100) : 0
  const completedGoals = summary.goals.filter((g: any) => g.status === 'completed').length
  const averageMood = summary.moodLogs.length
    ? Math.round(summary.moodLogs.reduce((sum: number, log: any) => sum + Number(log.mood_level || 0), 0) / summary.moodLogs.length)
    : 0

  const getTimeGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return { text: 'Good morning', icon: Sun }
    if (hour < 17) return { text: 'Good afternoon', icon: Coffee }
    return { text: 'Good evening', icon: Moon }
  }

  const greeting = getTimeGreeting()
  const GreetingIcon = greeting.icon

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
          <p className="text-sm text-slate-500">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  const renderHomeTab = () => (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-slate-500">
            <GreetingIcon className="h-4 w-4" />
            <span className="text-sm font-medium">{greeting.text}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {user?.fullName?.split(' ')[0] || 'Welcome'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5 text-slate-600" />
          </Button>
          <Avatar className="h-10 w-10 border-2 border-white shadow-md">
            <AvatarFallback className="bg-gradient-to-br from-slate-700 to-slate-900 text-white">
              {user?.fullName?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Mood Check Card */}
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm text-slate-300">How are you feeling today?</p>
              <div className="flex gap-2">
                {[
                  { emoji: '1F60A', label: 'Great' },
                  { emoji: '1F642', label: 'Good' },
                  { emoji: '1F610', label: 'Okay' },
                  { emoji: '1F614', label: 'Low' },
                ].map((mood, i) => (
                  <button
                    key={i}
                    className="flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-white/10 text-lg transition-all hover:bg-white/20 hover:scale-105 active:scale-95"
                  >
                    <span className="text-xl">{String.fromCodePoint(parseInt(mood.emoji, 16))}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
              <HeartPulse className="h-8 w-8 text-rose-300" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-0 bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                <Target className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{completedGoals}</p>
                <p className="text-xs text-slate-500">Goals achieved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{progressValue}%</p>
                <p className="text-xs text-slate-500">Action progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Focus */}
      <Card className="border-0 bg-white shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Today&apos;s Focus</CardTitle>
            <Badge variant="secondary" className="rounded-full bg-slate-100 text-slate-600">
              {summary.actions.filter((a: any) => a.status !== 'completed').length} remaining
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {summary.actions.slice(0, 3).map((action: any, i: number) => (
            <div key={i} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <div className={`h-3 w-3 rounded-full ${action.status === 'completed' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              <span className={`flex-1 text-sm ${action.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                {action.title || action.description || 'Action item'}
              </span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </div>
          ))}
          {summary.actions.length === 0 && (
            <div className="py-4 text-center text-sm text-slate-500">
              No actions yet. Start by setting some goals!
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { icon: BookOpen, label: 'Journal', color: 'bg-violet-100 text-violet-600' },
          { icon: Brain, label: 'Toolkit', color: 'bg-amber-100 text-amber-600' },
          { icon: Smile, label: 'Mood', color: 'bg-rose-100 text-rose-600' },
          { icon: Sparkles, label: 'Chill', color: 'bg-cyan-100 text-cyan-600' },
        ].map((item, i) => (
          <button key={i} className="flex flex-col items-center gap-2 rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-md active:scale-95">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.color}`}>
              <item.icon className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium text-slate-600">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )

  const renderGoalsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Goals</h1>
          <p className="text-sm text-slate-500">Track your progress and milestones</p>
        </div>
        <Button size="sm" className="rounded-full">
          Add Goal
        </Button>
      </div>

      {/* Progress Overview */}
      <Card className="border-0 bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-emerald-100">Goals Completed</p>
              <p className="text-3xl font-bold">{completedGoals} / {summary.goals.length}</p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
              <Target className="h-8 w-8" />
            </div>
          </div>
          <Progress value={summary.goals.length ? (completedGoals / summary.goals.length) * 100 : 0} className="mt-4 h-2 bg-white/20" />
        </CardContent>
      </Card>

      <GoalsSection userId={user?.userId} />
    </div>
  )

  const renderMeTab = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center">
        <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
          <AvatarFallback className="bg-gradient-to-br from-slate-700 to-slate-900 text-2xl text-white">
            {user?.fullName?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
        <h1 className="mt-4 text-xl font-bold text-slate-900">{user?.fullName || 'User'}</h1>
        <p className="text-sm text-slate-500">{user?.email || 'Patient'}</p>
        <Button variant="outline" size="sm" className="mt-3 rounded-full">
          <Settings className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-0 bg-white shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-slate-900">{averageMood || '-'}</p>
            <p className="text-xs text-slate-500">Avg Mood</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-white shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-slate-900">{summary.moodLogs.length}</p>
            <p className="text-xs text-slate-500">Check-ins</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-white shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-slate-900">{summary.plans.length}</p>
            <p className="text-xs text-slate-500">Plans</p>
          </CardContent>
        </Card>
      </div>

      {/* Menu Items */}
      <Card className="border-0 bg-white shadow-sm">
        <CardContent className="divide-y p-0">
          {[
            { icon: Calendar, label: 'My Treatment Plans', onClick: () => {} },
            { icon: HeartPulse, label: 'Mood History', onClick: () => {} },
            { icon: Brain, label: 'Mindshift Toolkit', onClick: () => {} },
            { icon: Sparkles, label: 'Chill Zone', onClick: () => {} },
          ].map((item, i) => (
            <button key={i} className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-slate-50" onClick={item.onClick}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <item.icon className="h-5 w-5 text-slate-600" />
              </div>
              <span className="flex-1 text-sm font-medium text-slate-700">{item.label}</span>
              <ChevronRight className="h-5 w-5 text-slate-400" />
            </button>
          ))}
        </CardContent>
      </Card>

      <TreatmentPlans userId={user?.userId} />
    </div>
  )

  const renderActionTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Actions</h1>
          <p className="text-sm text-slate-500">Daily tasks and activities</p>
        </div>
        <Button size="sm" className="rounded-full">
          Add Action
        </Button>
      </div>

      {/* Progress Card */}
      <Card className="border-0 bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-blue-100">Actions Completed</p>
              <p className="text-3xl font-bold">{completedActions} / {totalActions}</p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
              <TrendingUp className="h-8 w-8" />
            </div>
          </div>
          <Progress value={progressValue} className="mt-4 h-2 bg-white/20" />
        </CardContent>
      </Card>

      <ActionsSection userId={user?.userId} />
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return renderHomeTab()
      case 'goals':
        return renderGoalsTab()
      case 'me':
        return renderMeTab()
      case 'action':
        return renderActionTab()
      default:
        return renderHomeTab()
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {!isMobile && <PatientNav user={user} onLanguageToggle={toggleLanguage} />}

      <main className="mx-auto max-w-lg px-4 pb-32 pt-6 md:pb-8">
        {renderContent()}
      </main>

      <MobileTabBar 
        items={mobileTabConfig} 
        value={activeTab} 
        onValueChange={setActiveTab} 
        variant="patient" 
      />
    </div>
  )
}
