'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Empty } from '@/components/ui/empty'
import { Calendar } from 'lucide-react'

interface SessionsProps {
  therapistId?: number
}

export default function Sessions({ therapistId }: SessionsProps) {
  const { t } = useTranslation()
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSessions = async () => {
      if (!therapistId) return
      try {
        const response = await fetch(`/api/sessions?therapistId=${therapistId}`)
        if (response.ok) {
          const data = await response.json()
          setSessions(data)
        }
      } catch (error) {
        console.error('Error fetching sessions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSessions()
  }, [therapistId])

  if (loading) {
    return <div>{t('common.loading')}</div>
  }

  const statusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-4">{t('therapist.sessions')}</h2>
      </div>

      {sessions.length === 0 ? (
        <Empty
          icon="Calendar"
          title="No Sessions"
          description="No therapy sessions scheduled yet."
        />
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <Card key={session.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">Patient ID: {session.patient_id}</CardTitle>
                  </div>
                  <Badge className={statusColor(session.status)}>
                    {session.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">
                  <strong>Date:</strong> {new Date(session.session_date).toLocaleString()}
                </p>
                <p className="text-sm">
                  <strong>Type:</strong> {session.session_type}
                </p>
                {session.notes && (
                  <p className="text-sm">
                    <strong>Notes:</strong> {session.notes}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
