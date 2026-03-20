'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Empty } from '@/components/ui/empty'
import { Music, Clock, Zap } from 'lucide-react'

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

  const difficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const typeIcon = (type: string) => {
    switch (type) {
      case 'meditation':
        return '🧘'
      case 'breathing_exercise':
        return '💨'
      case 'relaxation':
        return '😌'
      case 'mindfulness':
        return '🧠'
      default:
        return '✨'
    }
  }

  if (loading) {
    return <div>{t('common.loading')}</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">{t('chillZone.title')}</h2>
        <p className="text-gray-600">{t('chillZone.subtitle')}</p>
      </div>

      {resources.length === 0 ? (
        <Empty
          icon="Music"
          title={t('chillZone.noResourcesFound')}
          description="No relaxation resources available at the moment"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-lg transition-shadow overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-3xl">{typeIcon(resource.type)}</div>
                  <Badge
                    variant="secondary"
                    className={difficultyColor(resource.difficulty_level)}
                  >
                    {t(`chillZone.${resource.difficulty_level}`)}
                  </Badge>
                </div>
                <CardTitle className="mt-3 text-lg">{resource.title}</CardTitle>
                <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{resource.duration_minutes} {t('chillZone.minutes')}</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={() => setPlaying(playing === resource.id ? null : resource.id)}
                  variant={playing === resource.id ? 'default' : 'outline'}
                >
                  {playing === resource.id ? (
                    <>
                      <Music className="mr-2 h-4 w-4 animate-spin" />
                      {t('chillZone.pause')}
                    </>
                  ) : (
                    <>
                      <Music className="mr-2 h-4 w-4" />
                      {t('chillZone.play')}
                    </>
                  )}
                </Button>

                {playing === resource.id && resource.audio_url && (
                  <audio
                    src={resource.audio_url}
                    controls
                    autoPlay
                    className="w-full mt-2"
                    onEnded={() => setPlaying(null)}
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
