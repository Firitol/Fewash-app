'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Empty } from '@/components/ui/empty'
import { Calendar, User } from 'lucide-react'

interface TreatmentPlansProps {
  userId?: number
}

export default function TreatmentPlans({ userId }: TreatmentPlansProps) {
  const { t } = useTranslation()
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlans = async () => {
      if (!userId) return
      try {
        const response = await fetch(`/api/treatment-plans?userId=${userId}`)
        if (response.ok) {
          const data = await response.json()
          setPlans(data)
        }
      } catch (error) {
        console.error('Error fetching plans:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlans()
  }, [userId])

  if (loading) {
    return <div>{t('common.loading')}</div>
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-slate-950">{t('plan.treatmentPlans')}</h2>
      </div>

      {plans.length === 0 ? (
        <Empty
          icon="FileX"
          title={t('plan.noPlanFound')}
          description="Contact your therapist to start a treatment plan"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {plans.map((plan) => (
            <Card key={plan.id} className="overflow-hidden border-white/70 bg-white/90 hover:-translate-y-0.5 hover:shadow-xl transition-all shadow-lg shadow-slate-200/50">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{plan.title}</CardTitle>
                    <CardDescription className="mt-2">{plan.description}</CardDescription>
                  </div>
                  <Badge variant={plan.status === 'active' ? 'default' : 'secondary'}>
                    {plan.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Start: {new Date(plan.start_date).toLocaleDateString()}</span>
                  </div>
                  {plan.end_date && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>End: {new Date(plan.end_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="h-4 w-4" />
                    <span>Therapist ID: {plan.therapist_id}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
