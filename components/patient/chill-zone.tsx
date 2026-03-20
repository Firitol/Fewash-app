'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Empty } from '@/components/ui/empty'
import { Music2, RotateCcw } from 'lucide-react'

interface ChillZoneProps {
  language: string
}

interface Resource {
  id: number
  title: string
  description: string
  type: string
  duration_minutes: number
  difficulty_level: string
  audio_url: string
}

export default function ChillZone({ language }: ChillZoneProps) {
  const { t } = useTranslation()
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [playing, setPlaying] = useState<number | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const lang = language === 'am' ? 'amharic' : 'afan_oromo'
        const response = await fetch(`/api/chill-zone?language=${lang}`)
        if (response.ok) {
          const data = await response.json()
          setResources(data)
        }
      } catch (error) {
        console.error('Error fetching resources:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
  }, [language])

  const current = useMemo(() => {
    if (!resources.length) return null
    return resources.find((resource) => resource.id === playing) ?? resources[0]
  }, [playing, resources])

  if (loading) return <div>{t('common.loading')}</div>

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-white">Guided Meditations</h2>
        <p className="text-sm text-white/75">A soft, immersive player for breathing, relaxation, and mental vacation sessions.</p>
      </div>

      {resources.length === 0 || !current ? (
        <Empty icon="Music" title={t('chillZone.noResourcesFound')} description="No relaxation resources available at the moment" />
      ) : (
        <Card className="overflow-hidden rounded-[2.2rem] border border-white/20 bg-[linear-gradient(180deg,#79c0ff_0%,#5da6ff_48%,#4c8ff9_100%)] text-white shadow-[0_28px_80px_rgba(65,132,255,0.35)]">
          <CardContent className="space-y-6 p-6">
            <div className="text-center">
              <p className="text-sm text-white/75">Chill Zone</p>
              <h3 className="mt-3 text-2xl font-medium">{current.title}</h3>
              <p className="mt-2 text-sm text-white/75">Now playing · {current.duration_minutes} {t('chillZone.minutes')}</p>
            </div>

            <div className="mx-auto flex h-64 w-64 items-center justify-center rounded-full bg-[radial-gradient(circle,#ffffff_0%,#ffffff_40%,rgba(255,255,255,0.4)_41%,rgba(255,255,255,0.24)_58%,rgba(255,255,255,0.16)_74%,rgba(255,255,255,0.1)_100%)]">
              <Button
                size="icon"
                className="h-32 w-32 rounded-full bg-white text-[#5b97ff] shadow-[0_20px_50px_rgba(255,255,255,0.35)] hover:bg-white"
                onClick={() => setPlaying(playing === current.id ? null : current.id)}
              >
                <Music2 className={`h-10 w-10 ${playing === current.id ? 'animate-pulse' : ''}`} />
              </Button>
            </div>

            {current.audio_url && playing === current.id && (
              <audio src={current.audio_url} controls autoPlay className="w-full" onEnded={() => setPlaying(null)} />
            )}

            <div className="flex items-center justify-between gap-3">
              <Button variant="ghost" className="rounded-full text-white hover:bg-white/10">
                <RotateCcw className="mr-2 h-4 w-4" />
                Restart
              </Button>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {resources.slice(0, 4).map((resource) => (
                  <Button
                    key={resource.id}
                    variant="ghost"
                    onClick={() => setPlaying(resource.id)}
                    className={`rounded-full border px-4 text-white ${current.id === resource.id ? 'border-white/70 bg-white/20' : 'border-white/10 bg-white/10'}`}
                  >
                    {resource.title}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
