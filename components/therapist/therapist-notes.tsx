'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Empty } from '@/components/ui/empty'

interface TherapistNotesProps {
  therapistId?: number
}

export default function TherapistNotes({ therapistId }: TherapistNotesProps) {
  const { t } = useTranslation()
  const [notes, setNotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotes = async () => {
      if (!therapistId) return
      try {
        const response = await fetch(`/api/therapist/notes?therapistId=${therapistId}`)
        if (response.ok) {
          const data = await response.json()
          setNotes(data)
        }
      } catch (error) {
        console.error('Error fetching notes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotes()
  }, [therapistId])

  if (loading) {
    return <div>{t('common.loading')}</div>
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-4">{t('therapist.viewNotes')}</h2>
      </div>

      {notes.length === 0 ? (
        <Empty
          icon="FileText"
          title="No Notes"
          description="You haven't created any notes yet."
        />
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <Card key={note.id}>
              <CardHeader>
                <CardTitle className="text-lg">Patient ID: {note.patient_id}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-gray-700">{note.note}</p>
                <p className="text-xs text-gray-600">
                  {new Date(note.created_at).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
