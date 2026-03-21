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
} from '@/components/ui/sheet'
import { 
  Target, 
  ChevronRight, 
  Calendar, 
  Flag, 
  CheckCircle2, 
  Circle,
  ChevronLeft,
  Plus
} from 'lucide-react'

interface GoalsSectionProps {
  userId?: number
  onRefresh?: () => void
}

export default function GoalsSection({ userId, onRefresh }: GoalsSectionProps) {
  const { t } = useTranslation()
  const [goals, setGoals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedGoal, setSelectedGoal] = useState<any>(null)
  const [goalActions, setGoalActions] = useState<any[]>([])
  const [loadingActions, setLoadingActions] = useState(false)

  const fetchGoals = useCallback(async () => {
    if (!userId) return
    try {
      const response = await fetch(`/api/goals?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setGoals(data)
      }
    } catch (error) {
      console.error('Error fetching goals:', error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchGoals()
  }, [fetchGoals])

  const fetchGoalActions = async (goalId: number) => {
    setLoadingActions(true)
    try {
      const response = await fetch(`/api/actions?goalId=${goalId}`)
      if (response.ok) {
        const data = await response.json()
        setGoalActions(data)
      }
    } catch (error) {
      console.error('Error fetching goal actions:', error)
    } finally {
      setLoadingActions(false)
    }
  }

  const handleGoalClick = (goal: any) => {
    setSelectedGoal(goal)
    fetchGoalActions(goal.id)
  }

  const handleToggleGoalStatus = async (goalId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'in_progress' : 'completed'
    try {
      const response = await fetch(`/api/goals/${goalId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (response.ok) {
        setGoals(goals.map((g) => (g.id === goalId ? { ...g, status: newStatus } : g)))
        if (selectedGoal?.id === goalId) {
          setSelectedGoal({ ...selectedGoal, status: newStatus })
        }
        onRefresh?.()
      }
    } catch (error) {
      console.error('Error updating goal:', error)
    }
  }

  const handleCompleteAction = async (actionId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed'
    try {
      const response = await fetch(`/api/actions/${actionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (response.ok) {
        setGoalActions(goalActions.map((a) => (a.id === actionId ? { ...a, status: newStatus } : a)))
        onRefresh?.()
      }
    } catch (error) {
      console.error('Error updating action:', error)
    }
  }

  const priorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-rose-100 text-rose-700'
      case 'medium':
        return 'bg-amber-100 text-amber-700'
      case 'low':
        return 'bg-emerald-100 text-emerald-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  const statusIcon = (status: string) => {
    return status === 'completed' ? (
      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
    ) : (
      <Circle className="h-5 w-5 text-slate-300" />
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">{t('goal.goals')}</h2>
        <p className="text-sm text-slate-500">Tap a goal to see details and actions</p>
      </div>

      {goals.length === 0 ? (
        <Empty
          icon="Target"
          title={t('goal.noGoalsFound')}
          description="No goals yet. Work with your therapist to create treatment goals."
        />
      ) : (
        <div className="space-y-3">
          {goals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => handleGoalClick(goal)}
              className="flex w-full items-center gap-4 rounded-2xl bg-white p-4 text-left shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleToggleGoalStatus(goal.id, goal.status)
                }}
                className="shrink-0 transition-transform active:scale-90"
              >
                {statusIcon(goal.status)}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 shrink-0 text-slate-400" />
                  <p className={`font-medium truncate ${goal.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                    {goal.title}
                  </p>
                </div>
                {goal.description && (
                  <p className="mt-1 text-sm text-slate-500 line-clamp-1">{goal.description}</p>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className={`text-xs ${priorityColor(goal.priority)}`}>
                    <Flag className="mr-1 h-3 w-3" />
                    {goal.priority}
                  </Badge>
                  {goal.target_date && (
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Calendar className="h-3 w-3" />
                      {new Date(goal.target_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-slate-400" />
            </button>
          ))}
        </div>
      )}

      {/* Goal Detail Sheet */}
      <Sheet open={!!selectedGoal} onOpenChange={(open) => !open && setSelectedGoal(null)}>
        <SheetContent side="bottom" className="h-[85vh] overflow-y-auto rounded-t-3xl">
          {selectedGoal && (
            <>
              <div className="flex items-center gap-3 pb-4">
                <Button variant="ghost" size="icon" onClick={() => setSelectedGoal(null)}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <SheetTitle className="flex-1">Goal Details</SheetTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleGoalStatus(selectedGoal.id, selectedGoal.status)}
                  className={selectedGoal.status === 'completed' ? 'text-emerald-600' : ''}
                >
                  {selectedGoal.status === 'completed' ? 'Completed' : 'Mark Done'}
                </Button>
              </div>

              <div className="space-y-6">
                {/* Goal Info */}
                <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                      <Target className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{selectedGoal.title}</h3>
                      {selectedGoal.description && (
                        <p className="mt-2 text-sm text-slate-300">{selectedGoal.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge className={`${priorityColor(selectedGoal.priority)} border-0`}>
                      <Flag className="mr-1 h-3 w-3" />
                      {selectedGoal.priority} priority
                    </Badge>
                    {selectedGoal.target_date && (
                      <Badge variant="secondary" className="bg-white/20 text-white">
                        <Calendar className="mr-1 h-3 w-3" />
                        Due {new Date(selectedGoal.target_date).toLocaleDateString()}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Actions for this Goal */}
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-semibold text-slate-900">Actions</h4>
                    <span className="text-sm text-slate-500">
                      {goalActions.filter((a) => a.status === 'completed').length} / {goalActions.length} done
                    </span>
                  </div>

                  {loadingActions ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
                    </div>
                  ) : goalActions.length === 0 ? (
                    <div className="rounded-xl border-2 border-dashed border-slate-200 py-8 text-center">
                      <p className="text-sm text-slate-500">No actions for this goal yet</p>
                      <Button variant="ghost" size="sm" className="mt-2">
                        <Plus className="mr-1 h-4 w-4" />
                        Add Action
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {goalActions.map((action) => (
                        <button
                          key={action.id}
                          onClick={() => handleCompleteAction(action.id, action.status)}
                          className="flex w-full items-center gap-3 rounded-xl bg-slate-50 p-4 text-left transition-all active:scale-[0.99]"
                        >
                          <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${
                            action.status === 'completed' 
                              ? 'border-emerald-500 bg-emerald-500' 
                              : 'border-slate-300'
                          }`}>
                            {action.status === 'completed' && (
                              <CheckCircle2 className="h-4 w-4 text-white" />
                            )}
                          </div>
                          <span className={`flex-1 text-sm ${action.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                            {action.title}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
