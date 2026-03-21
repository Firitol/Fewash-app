'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Brain, CalendarCheck2, HeartPulse, Sparkles, Target, TrendingUp } from 'lucide-react'

interface DashboardOverviewProps {
  fullName?: string
  plans: any[]
  goals: any[]
  actions: any[]
  moodLogs: Array<{ mood_level: number; created_at: string }>
  onNavigate: (tab: string) => void
}

export default function DashboardOverview({
  fullName,
  plans,
  goals,
  actions,
  moodLogs,
  onNavigate,
}: DashboardOverviewProps) {
  const completedActions = actions.filter((action) => action.status === 'completed').length
  const activePlans = plans.filter((plan) => plan.status === 'active').length
  const completedGoals = goals.filter((goal) => goal.status === 'completed').length
  const averageMood = moodLogs.length
    ? Math.round(
        moodLogs.reduce((sum, log) => sum + Number(log.mood_level || 0), 0) / moodLogs.length
      )
    : 0
  const progressValue = actions.length ? Math.round((completedActions / actions.length) * 100) : 0

  const insightCards = [
    {
      title: 'Mind care score',
      value: `${averageMood || '-'} / 10`,
      description: 'Based on your recent check-ins and emotional tracking.',
      icon: HeartPulse,
      tone: 'from-pink-500/15 via-rose-500/10 to-transparent',
    },
    {
      title: 'Plans in motion',
      value: String(activePlans),
      description: 'Structured care plans currently helping you move forward.',
      icon: CalendarCheck2,
      tone: 'from-sky-500/15 via-cyan-500/10 to-transparent',
    },
    {
      title: 'Goals achieved',
      value: String(completedGoals),
      description: 'Milestones already completed on your recovery journey.',
      icon: Target,
      tone: 'from-emerald-500/15 via-lime-500/10 to-transparent',
    },
    {
      title: 'Action momentum',
      value: `${progressValue}%`,
      description: 'How much of your current action list has been completed.',
      icon: TrendingUp,
      tone: 'from-violet-500/15 via-fuchsia-500/10 to-transparent',
    },
  ]

  const toolkitHighlights = [
    'Thought journal prompts to reframe difficult moments.',
    'Fear-ladder planning for gradual exposure and confidence building.',
    'Quick calming routines with breathing, grounding, and self-kindness cues.',
    'Story-sharing and personal reflections to strengthen community support.',
  ]

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(217,70,239,0.14),_transparent_28%)]" />
        <div className="relative grid gap-6 lg:grid-cols-[1.5fr,0.9fr] lg:items-center">
          <div className="space-y-4">
            <Badge className="rounded-full bg-slate-900 px-4 py-1.5 text-white hover:bg-slate-900">
              Relief zone is the app for wellness hub
            </Badge>
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                Welcome back{fullName ? `, ${fullName}` : ''}. Your calmer next step starts here.
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
                Your dashboard now brings together guided self-help tools, progress tracking,
                coping support, shareable updates, and reflection spaces in one beautiful care experience.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => onNavigate('toolkit')} size="lg" className="rounded-full px-6">
                Open CBT toolkit
              </Button>
              <Button onClick={() => onNavigate('share')} variant="outline" size="lg" className="rounded-full px-6">
                Share your experience
              </Button>
            </div>
          </div>

          <Card className="border-white/70 bg-slate-950 text-white shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Brain className="h-5 w-5 text-cyan-300" />
                Daily momentum
              </CardTitle>
              <CardDescription className="text-slate-300">
                A quick pulse-check built from your plans, actions, and check-ins.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                  <span>Care plan completion</span>
                  <span>{progressValue}%</span>
                </div>
                <Progress value={progressValue} className="h-3 bg-slate-800" />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-slate-400">Completed actions</p>
                  <p className="mt-1 text-2xl font-semibold">{completedActions}</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-slate-400">Recent mood trend</p>
                  <p className="mt-1 text-2xl font-semibold">{averageMood || '-'}/10</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {insightCards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.title} className="overflow-hidden border-white/70 bg-white/90 shadow-lg shadow-slate-200/50">
              <CardContent className="relative p-5">
                <div className={`absolute inset-0 bg-gradient-to-br ${card.tone}`} />
                <div className="relative space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-600">{card.title}</p>
                    <span className="rounded-full bg-white/80 p-2 text-slate-800 shadow-sm">
                      <Icon className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="text-3xl font-semibold text-slate-950">{card.value}</p>
                  <p className="text-sm leading-6 text-slate-600">{card.description}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
        <Card className="border-white/70 bg-white/90 shadow-lg shadow-slate-200/50">
          <CardHeader>
            <CardTitle className="text-xl">Relief zone is self-help toolkit</CardTitle>
            <CardDescription>
              Inspired by common CBT support patterns such as thought journals, fear ladders,
              daily check-ins, and calming routines.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {toolkitHighlights.map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                {item}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/70 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-xl shadow-indigo-200/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-5 w-5" />
              Gentle routine for today
            </CardTitle>
            <CardDescription className="text-indigo-100">
              A balanced sequence you can revisit whenever you need steadiness.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-2xl bg-white/10 p-4">1. Pause for a 60-second breathing reset.</div>
            <div className="rounded-2xl bg-white/10 p-4">2. Record one helpful thought in your journal.</div>
            <div className="rounded-2xl bg-white/10 p-4">3. Finish one tiny action that supports your main goal.</div>
            <div className="rounded-2xl bg-white/10 p-4">4. Share a reflection or progress link with someone you trust.</div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
