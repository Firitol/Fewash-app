'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Empty } from '@/components/ui/empty'
import { CheckCircle, Circle } from 'lucide-react'

interface ActionsSectionProps {
  userId?: number
}

export default function ActionsSection({ userId }: ActionsSectionProps) {
  const { t } = useTranslation()
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
        setActions(
          actions.map((a) =>
            a.id === actionId ? { ...a, status: 'completed' } : a
          )
        )
      }
    } catch (error) {
      console.error('Error updating action:', error)
    }
  }

  if (loading) {
    return <div>{t('common.loading')}</div>
  }

  const statusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-4">{t('action.actions')}</h2>
      </div>

      {actions.length === 0 ? (
        <Empty
          icon="ListChecks"
          title={t('action.noActionsFound')}
          description="No actions yet. Create actions from your goals."
        />
      ) : (
        <div className="space-y-3">
          {actions.map((action) => (
            <Card
              key={action.id}
              className={`hover:shadow-md transition-all ${
                action.status === 'completed' ? 'opacity-75' : ''
              }`}
            >
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={action.status === 'completed'}
                    onCheckedChange={() => handleCompleteAction(action.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <CardTitle className={action.status === 'completed' ? 'line-through text-gray-500' : ''}>
                      {action.title}
                    </CardTitle>
                    {action.description && (
                      <p className="text-sm text-gray-600 mt-2">{action.description}</p>
                    )}
                  </div>
                  <Badge variant="secondary" className={statusColor(action.status)}>
                    {t(`action.${action.status}`)}
                  </Badge>
                </div>
              </CardHeader>
              {action.due_date && (
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Due: {new Date(action.due_date).toLocaleDateString()}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
