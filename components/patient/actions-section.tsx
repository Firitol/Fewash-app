'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Empty } from '@/components/ui/empty'
import { ArrowRight, Footprints, Mountain, ShieldCheck } from 'lucide-react'

interface ActionsSectionProps {
  userId?: number
}

const curatedActions = [
  {
    title: 'Facing Fears',
    description: 'Overcome your fears by gradually facing them in small steps.',
    icon: Mountain,
    tint: 'from-[#7aa7ff] to-[#8d83ff]',
  },
  {
    title: 'Comfort Zone Challenges',
    description: 'Do things that are new and challenging to widen your comfort zone.',
    icon: Footprints,
    tint: 'from-[#90d7c4] to-[#86b8ff]',
  },
  {
    title: 'Supportive Routine',
    description: 'Turn tiny actions into repeatable routines that help you feel safe and steady.',
    icon: ShieldCheck,
    tint: 'from-[#93c5fd] to-[#c084fc]',
  },
]

export default function ActionsSection({ userId }: ActionsSectionProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const [actions, setActions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActions = async () => {
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
    }

    fetchActions()
  }, [userId])

  const handleCompleteAction = async (actionId: number) => {
    try {
      const response = await fetch(`/api/actions/${actionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      })

      if (response.ok) {
        setActions(actions.map((a) => (a.id === actionId ? { ...a, status: 'completed' } : a)))
      }
    } catch (error) {
      console.error('Error updating action:', error)
    }
  }

  if (loading) return <div>{t('common.loading')}</div>

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

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-[#0e5fd8]">Take Action</h2>
        <p className="text-sm text-slate-500">Choose a tool to help manage your anxiety and build confidence.</p>
      </div>

      <div className="grid gap-4">
        {curatedActions.map((item) => {
          const Icon = item.icon
          return (
            <Card key={item.title} className="overflow-hidden rounded-[1.85rem] border-0 shadow-[0_18px_45px_rgba(90,120,255,0.18)]">
              <CardContent className={`bg-gradient-to-r ${item.tint} p-0`}>
                <div className="flex min-h-40 flex-col justify-end bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(15,23,42,0.38))] p-5 text-white">
                  <Icon className="mb-8 h-8 w-8" />
                  <p className="text-2xl font-semibold">{item.title}</p>
                  <p className="mt-2 max-w-sm text-sm text-white/90">{item.description}</p>
                  <button type="button" onClick={() => router.push('/patient/dashboard')} className="mt-4 inline-flex w-fit items-center rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/30 hover:scale-[1.02]">Open tool</button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {actions.length === 0 ? (
        <Empty icon="ListChecks" title={t('action.noActionsFound')} description="No actions yet. Create actions from your goals." />
      ) : (
        <div className="space-y-3">
          {actions.map((action) => (
            <Card key={action.id} className={`rounded-[1.6rem] border border-white/80 bg-white transition-all hover:-translate-y-0.5 hover:shadow-md ${action.status === 'completed' ? 'opacity-75' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Checkbox checked={action.status === 'completed'} onCheckedChange={() => handleCompleteAction(action.id)} className="mt-1" />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className={`text-base font-semibold text-slate-900 ${action.status === 'completed' ? 'line-through text-slate-400' : ''}`}>{action.title}</p>
                      <Badge variant="secondary" className={statusColor(action.status)}>{t(`action.${action.status}`)}</Badge>
                    </div>
                    {action.description && <p className="mt-2 text-sm leading-6 text-slate-600">{action.description}</p>}
                    {action.due_date && <p className="mt-3 text-xs text-slate-400">Due {new Date(action.due_date).toLocaleDateString()}</p>}
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 text-slate-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
