'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Empty } from '@/components/ui/empty'
import { Target } from 'lucide-react'

interface GoalsSectionProps {
  userId?: number
}

export default function GoalsSection({ userId }: GoalsSectionProps) {
  const { t } = useTranslation()
  const [goals, setGoals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGoals = async () => {
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
    }

    fetchGoals()
  }, [userId])

  if (loading) {
    return <div>{t('common.loading')}</div>
  }

  const priorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-4">{t('goal.goals')}</h2>
      </div>

      {goals.length === 0 ? (
        <Empty
          icon="Target"
          title={t('goal.noGoalsFound')}
          description="No goals yet. Work with your therapist to create treatment goals."
        />
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => (
            <Card key={goal.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      {goal.title}
                    </CardTitle>
                    {goal.description && (
                      <p className="text-sm text-gray-600 mt-2">{goal.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className={priorityColor(goal.priority)}>
                      {t(`goal.${goal.priority}`)}
                    </Badge>
                    <Badge variant="secondary">{goal.status}</Badge>
                  </div>
                </div>
              </CardHeader>
              {goal.target_date && (
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Target: {new Date(goal.target_date).toLocaleDateString()}
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
