'use client'

import { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Empty } from '@/components/ui/empty'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from '@/components/ui/sheet'
import { 
  ArrowRight, 
  Footprints, 
  Mountain, 
  ShieldCheck, 
  Check, 
  RotateCcw,
  Clock,
  ChevronLeft
} from 'lucide-react'

interface ActionsSectionProps {
  userId?: number
  onRefresh?: () => void
}

const curatedActions = [
  {
    title: 'Facing Fears',
    description: 'Overcome your fears by gradually facing them in small steps.',
    icon: Mountain,
    tint: 'from-[#7aa7ff] to-[#8d83ff]',
    steps: [
      'Identify one specific fear you want to work on',
      'Rate your anxiety level (1-10)',
      'Take one small step toward facing it',
      'Notice your feelings without judgment',
      'Celebrate your courage, no matter the outcome'
    ]
  },
  {
    title: 'Comfort Zone Challenges',
    description: 'Do things that are new and challenging to widen your comfort zone.',
    icon: Footprints,
    tint: 'from-[#90d7c4] to-[#86b8ff]',
    steps: [
      'Choose something slightly outside your comfort zone',
      'Set a specific, achievable goal',
      'Prepare mentally with positive self-talk',
      'Take action and stay present',
      'Reflect on what you learned'
    ]
  },
  {
    title: 'Supportive Routine',
    description: 'Turn tiny actions into repeatable routines that help you feel safe and steady.',
    icon: ShieldCheck,
    tint: 'from-[#93c5fd] to-[#c084fc]',
    steps: [
      'Pick one small action to make a habit',
      'Link it to an existing routine',
      'Start with just 2 minutes',
      'Track your progress daily',
      'Gradually increase duration'
    ]
  },
]

export default function ActionsSection({ userId, onRefresh }: ActionsSectionProps) {
  const { t } = useTranslation()
  const [actions, setActions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [selectedGuide, setSelectedGuide] = useState<typeof curatedActions[0] | null>(null)

  const fetchActions = useCallback(async () => {
    if (!userId) return
    try {
      const response = await fetch(`/api/actions?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setActions(data)
      }
    } catch (error) {
      console.error('Error fetching actions:', error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchActions()
  }, [fetchActions])

  const handleToggleAction = async (actionId: number, currentStatus: string) => {
    setUpdatingId(actionId)
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed'
    
    try {
      const response = await fetch(`/api/actions/${actionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setActions(actions.map((a) => (a.id === actionId ? { ...a, status: newStatus } : a)))
        onRefresh?.()
      }
    } catch (error) {
      console.error('Error updating action:', error)
    } finally {
      setUpdatingId(null)
    }
  }

  const statusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-700'
      case 'in_progress':
        return 'bg-sky-100 text-sky-700'
      case 'pending':
        return 'bg-slate-100 text-slate-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Take Action</h2>
        <p className="text-sm text-slate-500">Choose a tool to help manage your anxiety and build confidence.</p>
      </div>

      {/* Guided Actions */}
      <div className="grid gap-3">
        {curatedActions.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.title}
              onClick={() => setSelectedGuide(item)}
              className="w-full text-left transition-all active:scale-[0.98]"
            >
              <Card className="overflow-hidden rounded-2xl border-0 shadow-lg">
                <CardContent className={`bg-gradient-to-r ${item.tint} p-0`}>
                  <div className="flex items-center gap-4 bg-gradient-to-r from-black/10 to-transparent p-4 text-white">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-semibold">{item.title}</p>
                      <p className="text-sm text-white/80">{item.description}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-white/60" />
                  </div>
                </CardContent>
              </Card>
            </button>
          )
        })}
      </div>

      {/* User Actions */}
      <div className="pt-2">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Your Actions</h3>
        {actions.length === 0 ? (
          <Empty icon="ListChecks" title={t('action.noActionsFound')} description="No actions yet. Create actions from your goals." />
        ) : (
          <div className="space-y-2">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleToggleAction(action.id, action.status)}
                disabled={updatingId === action.id}
                className="flex w-full items-center gap-3 rounded-xl bg-white p-4 text-left shadow-sm transition-all hover:shadow-md active:scale-[0.99] disabled:opacity-50"
              >
                <div 
                  className={`flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all ${
                    action.status === 'completed' 
                      ? 'border-emerald-500 bg-emerald-500' 
                      : 'border-slate-300'
                  }`}
                >
                  {updatingId === action.id ? (
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : action.status === 'completed' ? (
                    <Check className="h-4 w-4 text-white" />
                  ) : null}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${action.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                    {action.title}
                  </p>
                  {action.due_date && (
                    <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="h-3 w-3" />
                      <span>Due {new Date(action.due_date).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
                <Badge variant="secondary" className={`shrink-0 ${statusColor(action.status)}`}>
                  {action.status === 'completed' ? 'Done' : 'To Do'}
                </Badge>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Guided Action Sheet */}
      <Sheet open={!!selectedGuide} onOpenChange={(open) => !open && setSelectedGuide(null)}>
        <SheetContent side="bottom" className="h-[85vh] overflow-y-auto rounded-t-3xl">
          {selectedGuide && (
            <>
              <div className="flex items-center gap-3 pb-4">
                <Button variant="ghost" size="icon" onClick={() => setSelectedGuide(null)}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <SheetTitle>{selectedGuide.title}</SheetTitle>
              </div>
              
              <div className={`mb-6 rounded-2xl bg-gradient-to-r ${selectedGuide.tint} p-6 text-white`}>
                <selectedGuide.icon className="mb-4 h-10 w-10" />
                <p className="text-lg font-medium">{selectedGuide.description}</p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">Steps to Follow</h3>
                {selectedGuide.steps.map((step, index) => (
                  <div key={index} className="flex gap-4 rounded-xl bg-slate-50 p-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <p className="flex-1 pt-1 text-sm text-slate-700">{step}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 rounded-xl"
                  onClick={() => setSelectedGuide(null)}
                >
                  Close
                </Button>
                <Button 
                  className="flex-1 rounded-xl"
                  onClick={() => {
                    setSelectedGuide(null)
                  }}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Mark as Done
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
