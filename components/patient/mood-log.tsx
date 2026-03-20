'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { Empty } from '@/components/ui/empty'
import { ChevronRight, Heart, Sparkles } from 'lucide-react'

interface MoodLogProps {
  userId?: number
  fullName?: string
}

interface MoodEntry {
  id: number
  mood_level: number
  mood_description: string
  notes: string
  created_at: string
}

export default function MoodLog({ userId, fullName }: MoodLogProps) {
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
        body: JSON.stringify({ userId, moodScore, notes }),
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
    if (score <= 6) return '😌'
    if (score <= 8) return '🙂'
    return '😄'
  }

  const moodLabel = useMemo(() => {
    if (moodScore <= 2) return 'I need extra support today.'
    if (moodScore <= 4) return 'I am feeling stretched.'
    if (moodScore <= 6) return "I'm feeling ok."
    if (moodScore <= 8) return 'I feel more steady today.'
    return 'I feel strong and hopeful.'
  }, [moodScore])

  if (loading) return <div>{t('common.loading')}</div>

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-[#0e5fd8]">Daily Check-In</h2>
        <p className="text-sm text-slate-500">Use the slider to describe your feeling and log your progress.</p>
      </div>

      <Card className="overflow-hidden rounded-[2rem] border-0 bg-white shadow-[0_24px_80px_rgba(89,110,255,0.18)]">
        <CardContent className="space-y-6 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xl font-bold text-[#0e5fd8]">How are you today{fullName ? `, ${fullName.split(' ')[0]}` : ''}?</p>
              <p className="mt-1 text-sm text-slate-500">Track anxiety, mood, and what support you need right now.</p>
            </div>
            <div className="rounded-full border border-[#d9e6ff] p-2 text-[#0e5fd8]">
              <Heart className="h-4 w-4" />
            </div>
          </div>

          <div className="relative flex flex-col items-center rounded-[2rem] bg-[radial-gradient(circle_at_top,_rgba(236,205,255,0.8),transparent_52%),linear-gradient(180deg,#ffffff_0%,#fbf9ff_100%)] px-4 py-6">
            <div className="absolute left-2 top-4 text-6xl font-bold tracking-tight text-[#edd8ff] sm:left-4">OK</div>
            <div className="relative z-10 flex h-40 w-40 items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,#d8c6ff_0%,#8a82ff_55%,#6f66ff_100%)] text-6xl shadow-[0_25px_60px_rgba(129,107,255,0.45)]">
              {getMoodEmoji(moodScore)}
            </div>
            <div className="mt-5 w-full max-w-xs">
              <Slider value={[moodScore]} onValueChange={(value) => setMoodScore(value[0])} min={1} max={10} step={1} className="w-full" />
            </div>
            <Button
              onClick={handleSubmitMood}
              disabled={submitting}
              className="mt-6 h-12 w-full rounded-full bg-white text-[#0e5fd8] shadow-[0_18px_38px_rgba(67,120,255,0.18)] transition-all hover:bg-white hover:scale-[1.01]"
            >
              {submitting ? t('common.loading') : `${moodLabel} Submit`}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <div className="rounded-[1.5rem] border border-[#edf2ff] bg-[#f8fbff] p-4">
            <p className="mb-2 text-sm font-medium text-[#0e5fd8]">Add a short note</p>
            <Textarea
              placeholder={t('moodLog.notes')}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[96px] rounded-2xl border-0 bg-white shadow-inner"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#0e5fd8]">Check-in summary</h3>
          <span className="text-xs text-slate-400">Recent entries</span>
        </div>
        {logs.length === 0 ? (
          <Empty icon="Heart" title={t('moodLog.noLogsFound')} description="No mood entries yet. Start tracking your mood!" />
        ) : (
          logs.slice(0, 4).map((log) => (
            <Card key={log.id} className="rounded-[1.75rem] border border-white/70 bg-white/90 shadow-sm">
              <CardContent className="flex items-start gap-4 p-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#eef2ff] text-3xl">{getMoodEmoji(log.mood_level)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{log.mood_level}/10 · {log.mood_description || 'Mood logged'}</p>
                      <p className="text-xs text-slate-500">{new Date(log.created_at).toLocaleDateString()} · {new Date(log.created_at).toLocaleTimeString()}</p>
                    </div>
                    <Sparkles className="h-4 w-4 text-violet-500" />
                  </div>
                  {log.notes && <p className="mt-3 text-sm leading-6 text-slate-600">{log.notes}</p>}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
