'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
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
  Coffee,
  Check,
  X,
  LogOut,
  User,
  Globe,
  ChevronLeft,
  Plus
} from 'lucide-react'

export default function PatientDashboard() {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('home')
  const [summary, setSummary] = useState({ plans: [], goals: [], actions: [], moodLogs: [] } as any)
  const isMobile = useIsMobile()
  
  // Modal states
  const [showAddGoalDialog, setShowAddGoalDialog] = useState(false)
  const [showAddActionDialog, setShowAddActionDialog] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileSheet, setShowProfileSheet] = useState(false)
  const [showMoodLogSheet, setShowMoodLogSheet] = useState(false)
  const [showToolkitSheet, setShowToolkitSheet] = useState(false)
  const [showChillSheet, setShowChillSheet] = useState(false)
  const [showPlansSheet, setShowPlansSheet] = useState(false)
  const [showMoodHistorySheet, setShowMoodHistorySheet] = useState(false)
  
  // Form states
  const [newGoalTitle, setNewGoalTitle] = useState('')
  const [newGoalDescription, setNewGoalDescription] = useState('')
  const [newGoalPriority, setNewGoalPriority] = useState('medium')
  const [newActionTitle, setNewActionTitle] = useState('')
  const [newActionDescription, setNewActionDescription] = useState('')
  const [selectedGoalForAction, setSelectedGoalForAction] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [moodSubmitting, setMoodSubmitting] = useState(false)
  const [selectedMood, setSelectedMood] = useState<number | null>(null)

  const fetchData = useCallback(async (userId: number) => {
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
  }, [])

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
          await fetchData(userId)
        }
      } catch (error) {
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router, fetchData])

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'am' ? 'om' : 'am')
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleQuickMoodLog = async (moodLevel: number) => {
    if (!user?.userId || moodSubmitting) return
    setSelectedMood(moodLevel)
    setMoodSubmitting(true)
    
    try {
      const response = await fetch('/api/mood-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.userId, 
          moodScore: moodLevel, 
          notes: '' 
        }),
      })

      if (response.ok) {
        await fetchData(user.userId)
        setTimeout(() => setSelectedMood(null), 1500)
      }
    } catch (error) {
      console.error('Error logging mood:', error)
    } finally {
      setMoodSubmitting(false)
    }
  }

  const handleCompleteAction = async (actionId: number) => {
    try {
      const response = await fetch(`/api/actions/${actionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      })

      if (response.ok && user?.userId) {
        await fetchData(user.userId)
      }
    } catch (error) {
      console.error('Error completing action:', error)
    }
  }

  const handleAddGoal = async () => {
    if (!newGoalTitle.trim() || submitting) return
    
    // Need a plan to add a goal - use first available plan
    const planId = summary.plans[0]?.id
    if (!planId) {
      alert('Please ask your therapist to create a treatment plan first.')
      return
    }
    
    setSubmitting(true)
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          title: newGoalTitle,
          description: newGoalDescription,
          priority: newGoalPriority,
        }),
      })

      if (response.ok && user?.userId) {
        await fetchData(user.userId)
        setNewGoalTitle('')
        setNewGoalDescription('')
        setNewGoalPriority('medium')
        setShowAddGoalDialog(false)
      }
    } catch (error) {
      console.error('Error creating goal:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddAction = async () => {
    if (!newActionTitle.trim() || !selectedGoalForAction || submitting) return
    
    setSubmitting(true)
    try {
      const response = await fetch('/api/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goalId: selectedGoalForAction,
          title: newActionTitle,
          description: newActionDescription,
        }),
      })

      if (response.ok && user?.userId) {
        await fetchData(user.userId)
        setNewActionTitle('')
        setNewActionDescription('')
        setSelectedGoalForAction(null)
        setShowAddActionDialog(false)
      }
    } catch (error) {
      console.error('Error creating action:', error)
    } finally {
      setSubmitting(false)
    }
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

  const moodOptions = [
    { emoji: '1F60A', label: 'Great', level: 9 },
    { emoji: '1F642', label: 'Good', level: 7 },
    { emoji: '1F610', label: 'Okay', level: 5 },
    { emoji: '1F614', label: 'Low', level: 3 },
  ]

  const quickActions = [
    { icon: BookOpen, label: 'Journal', color: 'bg-violet-100 text-violet-600', action: () => setShowToolkitSheet(true) },
    { icon: Brain, label: 'Toolkit', color: 'bg-amber-100 text-amber-600', action: () => setShowToolkitSheet(true) },
    { icon: Smile, label: 'Mood', color: 'bg-rose-100 text-rose-600', action: () => setShowMoodLogSheet(true) },
    { icon: Sparkles, label: 'Chill', color: 'bg-cyan-100 text-cyan-600', action: () => setShowChillSheet(true) },
  ]

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
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative rounded-full"
            onClick={() => setShowNotifications(true)}
          >
            <Bell className="h-5 w-5 text-slate-600" />
            {summary.actions.filter((a: any) => a.status !== 'completed').length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {Math.min(summary.actions.filter((a: any) => a.status !== 'completed').length, 9)}
              </span>
            )}
          </Button>
          <button 
            onClick={() => setActiveTab('me')}
            className="transition-transform active:scale-95"
          >
            <Avatar className="h-10 w-10 border-2 border-white shadow-md">
              <AvatarFallback className="bg-gradient-to-br from-slate-700 to-slate-900 text-white">
                {user?.fullName?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          </button>
        </div>
      </div>

      {/* Mood Check Card */}
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm text-slate-300">How are you feeling today?</p>
              <div className="flex gap-2">
                {moodOptions.map((mood, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickMoodLog(mood.level)}
                    disabled={moodSubmitting}
                    className={`flex h-12 w-12 flex-col items-center justify-center rounded-xl text-lg transition-all active:scale-95 ${
                      selectedMood === mood.level 
                        ? 'bg-emerald-500 ring-2 ring-emerald-300' 
                        : 'bg-white/10 hover:bg-white/20 hover:scale-105'
                    } ${moodSubmitting ? 'opacity-50' : ''}`}
                  >
                    {selectedMood === mood.level ? (
                      <Check className="h-5 w-5 text-white" />
                    ) : (
                      <span className="text-xl">{String.fromCodePoint(parseInt(mood.emoji, 16))}</span>
                    )}
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
        <button 
          onClick={() => setActiveTab('goals')}
          className="transition-all active:scale-[0.98]"
        >
          <Card className="border-0 bg-white shadow-sm hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                  <Target className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-slate-900">{completedGoals}</p>
                  <p className="text-xs text-slate-500">Goals achieved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </button>
        <button 
          onClick={() => setActiveTab('action')}
          className="transition-all active:scale-[0.98]"
        >
          <Card className="border-0 bg-white shadow-sm hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                  <Activity className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-slate-900">{progressValue}%</p>
                  <p className="text-xs text-slate-500">Action progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </button>
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
          {summary.actions.slice(0, 3).map((action: any) => (
            <button
              key={action.id}
              onClick={() => action.status !== 'completed' && handleCompleteAction(action.id)}
              className="flex w-full items-center gap-3 rounded-xl bg-slate-50 p-3 text-left transition-all hover:bg-slate-100 active:scale-[0.99]"
            >
              <div 
                className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${
                  action.status === 'completed' 
                    ? 'border-emerald-500 bg-emerald-500' 
                    : 'border-slate-300 hover:border-slate-400'
                }`}
              >
                {action.status === 'completed' && <Check className="h-3 w-3 text-white" />}
              </div>
              <span className={`flex-1 text-sm ${action.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                {action.title || action.description || 'Action item'}
              </span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </button>
          ))}
          {summary.actions.length === 0 && (
            <button 
              onClick={() => setActiveTab('goals')}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-6 text-sm text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-600"
            >
              <Plus className="h-4 w-4" />
              <span>Add your first goal to get started</span>
            </button>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-3">
        {quickActions.map((item, i) => (
          <button 
            key={i} 
            onClick={item.action}
            className="flex flex-col items-center gap-2 rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-md active:scale-95"
          >
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
        <Button 
          size="sm" 
          className="rounded-full"
          onClick={() => setShowAddGoalDialog(true)}
        >
          <Plus className="mr-1 h-4 w-4" />
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

      <GoalsSection userId={user?.userId} onRefresh={() => user?.userId && fetchData(user.userId)} />
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
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-3 rounded-full"
          onClick={() => setShowProfileSheet(true)}
        >
          <Settings className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <button 
          onClick={() => setShowMoodHistorySheet(true)}
          className="transition-all active:scale-[0.98]"
        >
          <Card className="border-0 bg-white shadow-sm hover:shadow-md">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-slate-900">{averageMood || '-'}</p>
              <p className="text-xs text-slate-500">Avg Mood</p>
            </CardContent>
          </Card>
        </button>
        <button 
          onClick={() => setShowMoodHistorySheet(true)}
          className="transition-all active:scale-[0.98]"
        >
          <Card className="border-0 bg-white shadow-sm hover:shadow-md">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-slate-900">{summary.moodLogs.length}</p>
              <p className="text-xs text-slate-500">Check-ins</p>
            </CardContent>
          </Card>
        </button>
        <button 
          onClick={() => setShowPlansSheet(true)}
          className="transition-all active:scale-[0.98]"
        >
          <Card className="border-0 bg-white shadow-sm hover:shadow-md">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-slate-900">{summary.plans.length}</p>
              <p className="text-xs text-slate-500">Plans</p>
            </CardContent>
          </Card>
        </button>
      </div>

      {/* Menu Items */}
      <Card className="border-0 bg-white shadow-sm">
        <CardContent className="divide-y p-0">
          {[
            { icon: Calendar, label: 'My Treatment Plans', onClick: () => setShowPlansSheet(true) },
            { icon: HeartPulse, label: 'Mood History', onClick: () => setShowMoodHistorySheet(true) },
            { icon: Brain, label: 'Mindshift Toolkit', onClick: () => setShowToolkitSheet(true) },
            { icon: Sparkles, label: 'Chill Zone', onClick: () => setShowChillSheet(true) },
          ].map((item, i) => (
            <button 
              key={i} 
              className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-slate-50 active:bg-slate-100" 
              onClick={item.onClick}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <item.icon className="h-5 w-5 text-slate-600" />
              </div>
              <span className="flex-1 text-sm font-medium text-slate-700">{item.label}</span>
              <ChevronRight className="h-5 w-5 text-slate-400" />
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Settings Section */}
      <Card className="border-0 bg-white shadow-sm">
        <CardContent className="divide-y p-0">
          <button 
            className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-slate-50 active:bg-slate-100"
            onClick={toggleLanguage}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
              <Globe className="h-5 w-5 text-blue-600" />
            </div>
            <span className="flex-1 text-sm font-medium text-slate-700">Language</span>
            <span className="text-sm text-slate-500">{i18n.language === 'am' ? 'Amharic' : 'Afan Oromo'}</span>
            <ChevronRight className="h-5 w-5 text-slate-400" />
          </button>
          <button 
            className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-slate-50 active:bg-slate-100"
            onClick={handleLogout}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100">
              <LogOut className="h-5 w-5 text-rose-600" />
            </div>
            <span className="flex-1 text-sm font-medium text-rose-600">Log Out</span>
          </button>
        </CardContent>
      </Card>
    </div>
  )

  const renderActionTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Actions</h1>
          <p className="text-sm text-slate-500">Daily tasks and activities</p>
        </div>
        <Button 
          size="sm" 
          className="rounded-full"
          onClick={() => setShowAddActionDialog(true)}
          disabled={summary.goals.length === 0}
        >
          <Plus className="mr-1 h-4 w-4" />
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

      <ActionsSection userId={user?.userId} onRefresh={() => user?.userId && fetchData(user.userId)} />
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

      {/* Add Goal Dialog */}
      <Dialog open={showAddGoalDialog} onOpenChange={setShowAddGoalDialog}>
        <DialogContent className="mx-4 max-w-sm rounded-3xl">
          <DialogHeader>
            <DialogTitle>Add New Goal</DialogTitle>
            <DialogDescription>
              Create a new goal to track your progress
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="goal-title">Goal Title</Label>
              <Input
                id="goal-title"
                placeholder="e.g., Practice mindfulness daily"
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal-description">Description (optional)</Label>
              <Textarea
                id="goal-description"
                placeholder="Add more details about your goal..."
                value={newGoalDescription}
                onChange={(e) => setNewGoalDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <div className="flex gap-2">
                {['low', 'medium', 'high'].map((p) => (
                  <Button
                    key={p}
                    type="button"
                    variant={newGoalPriority === p ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1 capitalize"
                    onClick={() => setNewGoalPriority(p)}
                  >
                    {p}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddGoalDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddGoal} disabled={!newGoalTitle.trim() || submitting}>
              {submitting ? 'Adding...' : 'Add Goal'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Action Dialog */}
      <Dialog open={showAddActionDialog} onOpenChange={setShowAddActionDialog}>
        <DialogContent className="mx-4 max-w-sm rounded-3xl">
          <DialogHeader>
            <DialogTitle>Add New Action</DialogTitle>
            <DialogDescription>
              Create an action step for one of your goals
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Goal</Label>
              <div className="space-y-2">
                {summary.goals.map((goal: any) => (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => setSelectedGoalForAction(goal.id)}
                    className={`w-full rounded-xl border p-3 text-left text-sm transition-colors ${
                      selectedGoalForAction === goal.id
                        ? 'border-slate-900 bg-slate-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {goal.title}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="action-title">Action Title</Label>
              <Input
                id="action-title"
                placeholder="e.g., Meditate for 10 minutes"
                value={newActionTitle}
                onChange={(e) => setNewActionTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="action-description">Description (optional)</Label>
              <Textarea
                id="action-description"
                placeholder="Add more details..."
                value={newActionDescription}
                onChange={(e) => setNewActionDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddActionDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddAction} 
              disabled={!newActionTitle.trim() || !selectedGoalForAction || submitting}
            >
              {submitting ? 'Adding...' : 'Add Action'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notifications Sheet */}
      <Sheet open={showNotifications} onOpenChange={setShowNotifications}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Notifications</SheetTitle>
            <SheetDescription>Your pending actions and updates</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            {summary.actions.filter((a: any) => a.status !== 'completed').length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">
                No pending notifications
              </div>
            ) : (
              summary.actions
                .filter((a: any) => a.status !== 'completed')
                .map((action: any) => (
                  <div key={action.id} className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <Activity className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{action.title}</p>
                      <p className="text-xs text-slate-500">Pending action</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCompleteAction(action.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                ))
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Profile Settings Sheet */}
      <Sheet open={showProfileSheet} onOpenChange={setShowProfileSheet}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
          <SheetHeader>
            <SheetTitle>Profile Settings</SheetTitle>
            <SheetDescription>Manage your account settings</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <div className="flex flex-col items-center">
              <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                <AvatarFallback className="bg-gradient-to-br from-slate-700 to-slate-900 text-2xl text-white">
                  {user?.fullName?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <p className="mt-3 text-lg font-semibold text-slate-900">{user?.fullName}</p>
              <p className="text-sm text-slate-500">{user?.email}</p>
            </div>
            <div className="space-y-4">
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-slate-600" />
                    <span className="text-sm font-medium">Account Type</span>
                  </div>
                  <Badge variant="secondary">Patient</Badge>
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-slate-600" />
                    <span className="text-sm font-medium">Language</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={toggleLanguage}>
                    {i18n.language === 'am' ? 'Amharic' : 'Afan Oromo'}
                  </Button>
                </div>
              </div>
            </div>
            <Button 
              variant="destructive" 
              className="w-full rounded-xl"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Mood Log Sheet */}
      <Sheet open={showMoodLogSheet} onOpenChange={setShowMoodLogSheet}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto rounded-t-3xl">
          <div className="flex items-center gap-3 pb-4">
            <Button variant="ghost" size="icon" onClick={() => setShowMoodLogSheet(false)}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <SheetTitle>Daily Check-In</SheetTitle>
          </div>
          <MoodLog userId={user?.userId} fullName={user?.fullName} />
        </SheetContent>
      </Sheet>

      {/* Toolkit Sheet */}
      <Sheet open={showToolkitSheet} onOpenChange={setShowToolkitSheet}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto rounded-t-3xl">
          <div className="flex items-center gap-3 pb-4">
            <Button variant="ghost" size="icon" onClick={() => setShowToolkitSheet(false)}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <SheetTitle>Relief zone Toolkit</SheetTitle>
          </div>
          <MindshiftToolkit />
        </SheetContent>
      </Sheet>

      {/* Chill Zone Sheet */}
      <Sheet open={showChillSheet} onOpenChange={setShowChillSheet}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto rounded-t-3xl bg-gradient-to-b from-sky-400 to-blue-600">
          <div className="flex items-center gap-3 pb-4">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={() => setShowChillSheet(false)}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <SheetTitle className="text-white">Chill Zone</SheetTitle>
          </div>
          <ChillZone language={i18n.language} />
        </SheetContent>
      </Sheet>

      {/* Treatment Plans Sheet */}
      <Sheet open={showPlansSheet} onOpenChange={setShowPlansSheet}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto rounded-t-3xl">
          <div className="flex items-center gap-3 pb-4">
            <Button variant="ghost" size="icon" onClick={() => setShowPlansSheet(false)}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <SheetTitle>Treatment Plans</SheetTitle>
          </div>
          <TreatmentPlans userId={user?.userId} />
        </SheetContent>
      </Sheet>

      {/* Mood History Sheet */}
      <Sheet open={showMoodHistorySheet} onOpenChange={setShowMoodHistorySheet}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto rounded-t-3xl">
          <div className="flex items-center gap-3 pb-4">
            <Button variant="ghost" size="icon" onClick={() => setShowMoodHistorySheet(false)}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <SheetTitle>Mood History</SheetTitle>
          </div>
          <div className="space-y-4">
            <Card className="border-0 bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-lg">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-rose-100">Average Mood</p>
                    <p className="text-3xl font-bold">{averageMood || '-'}/10</p>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                    <HeartPulse className="h-8 w-8" />
                  </div>
                </div>
                <p className="mt-3 text-sm text-rose-100">{summary.moodLogs.length} check-ins recorded</p>
              </CardContent>
            </Card>
            <MoodLog userId={user?.userId} fullName={user?.fullName} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
