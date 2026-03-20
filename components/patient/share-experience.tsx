'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Check, Copy, Link2, MessageCircleHeart, Share2, Sparkles } from 'lucide-react'

interface ShareExperienceProps {
  fullName?: string
}

const starterStories = [
  {
    id: 'starter-1',
    author: 'Community member',
    feeling: 'Hopeful',
    title: 'One small step still counts',
    story: 'I stopped waiting for the perfect day and finished one tiny action from my care plan. That small win changed the tone of my whole evening.',
    createdAt: 'Just now',
  },
  {
    id: 'starter-2',
    author: 'Peer support',
    feeling: 'Grounded',
    title: 'Breathing first helped',
    story: 'Before answering a stressful message, I tried the reset exercise and then wrote a more balanced response. It felt surprisingly empowering.',
    createdAt: 'Today',
  },
]

export default function ShareExperience({ fullName }: ShareExperienceProps) {
  const [copied, setCopied] = useState(false)
  const [title, setTitle] = useState('')
  const [feeling, setFeeling] = useState('Encouraged')
  const [story, setStory] = useState('')
  const [stories, setStories] = useState(starterStories)

  const shareLink = useMemo(() => {
    return 'https://fewash.app/progress-share?view=wellness-dashboard'
  }, [])

  useEffect(() => {
    const saved = window.localStorage.getItem('fewash-share-stories')
    if (saved) {
      setStories([...JSON.parse(saved), ...starterStories])
    }
  }, [])

  useEffect(() => {
    const customStories = stories.filter((item) => !item.id.startsWith('starter-'))
    window.localStorage.setItem('fewash-share-stories', JSON.stringify(customStories))
  }, [stories])

  const copyShareLink = async () => {
    await navigator.clipboard.writeText(shareLink)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  const useNativeShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'Fewash wellness progress',
        text: 'Here is my wellness dashboard link from Fewash.',
        url: shareLink,
      })
    } else {
      await copyShareLink()
    }
  }

  const publishStory = () => {
    if (!title.trim() || !story.trim()) return
    setStories((current) => [
      {
        id: crypto.randomUUID(),
        author: fullName || 'You',
        feeling,
        title: title.trim(),
        story: story.trim(),
        createdAt: 'Moments ago',
      },
      ...current,
    ])
    setTitle('')
    setStory('')
    setFeeling('Encouraged')
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.95fr,1.05fr]">
      <div className="space-y-5">
        <Card className="border-white/70 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white shadow-xl shadow-slate-300/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Link2 className="h-5 w-5 text-cyan-300" />
              Share link and invite friends to Hakim
            </CardTitle>
            <CardDescription className="text-slate-300">
              Let a trusted therapist, friend, or accountability partner see your progress snapshot.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200 break-all">
              {shareLink}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={copyShareLink} className="rounded-full bg-white text-slate-950 hover:bg-slate-100">
                {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                {copied ? 'Copied' : 'Copy link'}
              </Button>
              <Button onClick={useNativeShare} variant="outline" className="rounded-full border-white/20 bg-white/10 text-white hover:bg-white/20">
                <Share2 className="mr-2 h-4 w-4" />
                Share now
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/70 bg-white/90 shadow-lg shadow-slate-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <MessageCircleHeart className="h-5 w-5 text-rose-500" />
              Share your experience
            </CardTitle>
            <CardDescription>
              Turn your progress into a story that encourages reflection, support, and connection.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Give your story a title" />
            <Input value={feeling} onChange={(e) => setFeeling(e.target.value)} placeholder="How do you feel right now?" />
            <Textarea value={story} onChange={(e) => setStory(e.target.value)} placeholder="Describe what you faced, what helped, and what you learned." className="min-h-[160px]" />
            <Button onClick={publishStory} className="w-full">Publish reflection</Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/70 bg-white/90 shadow-lg shadow-slate-200/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-violet-600" />
            Community reflections
          </CardTitle>
          <CardDescription>
            A warm, story-first space inspired by users wanting more connection around their mental-health journey.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {stories.map((entry) => (
            <div key={entry.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{entry.title}</p>
                  <p className="text-sm text-slate-500">By {entry.author} · {entry.createdAt}</p>
                </div>
                <Badge variant="secondary" className="rounded-full px-3 py-1">{entry.feeling}</Badge>
              </div>
              <p className="text-sm leading-7 text-slate-700">{entry.story}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
