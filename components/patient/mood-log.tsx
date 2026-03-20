'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { Empty } from '@/components/ui/empty'
import { Heart } from 'lucide-react'

interface MoodLogProps {
  userId?: number
}

interface MoodEntry {
  id: number
  mood_level: number
  mood_description: string
  notes: string
  created_at: string
}

export default function MoodLog({ userId }: MoodLogProps) {
  const { t } = useTranslation()
  const [moodScore, setMoodScore] = useState(5)
  const [notes, setNotes] = useState('')
  const [logs, setLogs] = useState<MoodEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchLogs()
  }, [userId])

  const fetchLogs = async () => {
    if (!userId) return
    try {
      const response = await fetch(`/api/mood-logs?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setLogs(data)
      }
    } catch (error) {
      console.error('Error fetching mood logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitMood = async () => {
    if (!userId) return

    setSubmitting(true)
    try {
      const response = await fetch('/api/mood-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          moodScore,
          notes,
        }),
      })

      if (response.ok) {
        setMoodScore(5)
        setNotes('')
        await fetchLogs()
      }
    } catch (error) {
      console.error('Error submitting mood:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const getMoodEmoji = (score: number) => {
    if (score <= 2) return '😢'
    if (score <= 4) return '😕'
    if (score <= 6) return '😐'
    if (score <= 8) return '🙂'
    return '😄'
  }

  if (loading) {
    return <div>{t('common.loading')}</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">{t('moodLog.title')}</h2>
      </div>

      {/* Mood Submission Form */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            {t('moodLog.howAreYou')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-lg font-semibold">{t('moodLog.moodScale')}</label>
              <div className="text-4xl">{getMoodEmoji(moodScore)}</div>
            </div>
            <Slider
              value={[moodScore]}
              onValueChange={(value) => setMoodScore(value[0])}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-600">
              <span>😢 Very Bad</span>
              <span className="font-semibold text-lg text-blue-600">{moodScore}/10</span>
              <span>😄 Great</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">{t('moodLog.notes')}</label>
            <Textarea
              placeholder={t('moodLog.notes')}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <Button
            onClick={handleSubmitMood}
            disabled={submitting}
            className="w-full"
            size="lg"
          >
            {submitting ? t('common.loading') : t('moodLog.submit')}
          </Button>
        </CardContent>
      </Card>

      {/* Mood History */}
      <div>
        <h3 className="text-xl font-bold mb-4">{t('moodLog.history')}</h3>

        {logs.length === 0 ? (
          <Empty
            icon="Heart"
            title={t('moodLog.noLogsFound')}
            description="No mood entries yet. Start tracking your mood!"
          />
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <Card key={log.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{getMoodEmoji(log.mood_level)}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">
                            Mood: {log.mood_level}/10
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {new Date(log.created_at).toLocaleDateString()}{' '}
                            {new Date(log.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      {log.notes && (
                        <p className="text-sm text-gray-700 mt-3 p-3 bg-gray-50 rounded">
                          {log.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
