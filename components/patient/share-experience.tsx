'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Check, Copy, Filter, Link2, MessageCircleHeart, Share2 } from 'lucide-react'

interface ShareExperienceProps {
  fullName?: string
}

const starterStories = [
  {
    id: 'starter-1',
    author: 'Community member',
    feeling: 'Questions',
    title: 'I have a big exam coming up',
    story: "I am feeling really overwhelmed and anxious. I can't help but think I am going to fail. Does anyone have any tips for test anxiety?",
    createdAt: 'Latest posts',
  },
  {
    id: 'starter-2',
    author: 'Personal experience',
    feeling: 'Progress',
    title: 'Breathing first helped',
    story: 'Before answering a stressful message, I tried the reset exercise and then wrote a more balanced response. It felt surprisingly empowering.',
    createdAt: 'Today',
  },
]

export default function ShareExperience({ fullName }: ShareExperienceProps) {
  const [copied, setCopied] = useState(false)
  const [title, setTitle] = useState('')
  const [feeling, setFeeling] = useState('Personal Experience')
  const [story, setStory] = useState('')
  const [stories, setStories] = useState(starterStories)

  const shareLink = useMemo(() => 'https://fewash.app/progress-share?view=wellness-dashboard', [])

  useEffect(() => {
    const saved = window.localStorage.getItem('fewash-share-stories')
    if (saved) setStories([...JSON.parse(saved), ...starterStories])
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
      await navigator.share({ title: 'Fewash wellness progress', text: 'Here is my wellness dashboard link from Fewash.', url: shareLink })
    } else {
      await copyShareLink()
    }
  }

  const publishStory = () => {
    if (!title.trim() || !story.trim()) return
    setStories((current) => [{ id: crypto.randomUUID(), author: fullName || 'You', feeling, title: title.trim(), story: story.trim(), createdAt: 'Moments ago' }, ...current])
    setTitle('')
    setStory('')
    setFeeling('Personal Experience')
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-[#0e5fd8]">Find Your Support System</h2>
        <p className="text-sm text-slate-500">Discussion, progress sharing, and community support in a cleaner, more professional layout.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.95fr,1.05fr]">
        <div className="space-y-4">
          <Card className="rounded-[1.8rem] border-0 bg-[linear-gradient(180deg,#8b5cf6_0%,#c14fc8_100%)] text-white shadow-[0_24px_60px_rgba(177,79,200,0.28)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><Link2 className="h-5 w-5" /> Share link</CardTitle>
              <CardDescription className="text-white/80">Let a trusted therapist, friend, or accountability partner see your progress snapshot.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl bg-white/15 p-4 text-sm break-all">{shareLink}</div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={copyShareLink} className="rounded-full bg-white text-[#0e5fd8] hover:bg-white">{copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}{copied ? 'Copied' : 'Copy link'}</Button>
                <Button onClick={useNativeShare} variant="ghost" className="rounded-full border border-white/25 bg-white/10 text-white hover:bg-white/15"><Share2 className="mr-2 h-4 w-4" />Share now</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[1.8rem] border-0 bg-white shadow-[0_20px_50px_rgba(55,95,180,0.12)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-[#0e5fd8]"><MessageCircleHeart className="h-5 w-5" /> Create post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" className="rounded-full border-slate-200" />
              <Input value={feeling} onChange={(e) => setFeeling(e.target.value)} placeholder="Category" className="rounded-full border-slate-200" />
              <Textarea value={story} onChange={(e) => setStory(e.target.value)} placeholder="Share what happened, what helped, and what support you need." className="min-h-[150px] rounded-[1.3rem]" />
              <Button onClick={publishStory} className="h-12 w-full rounded-full bg-[linear-gradient(90deg,#60a5fa_0%,#4f8ff8_100%)] shadow-[0_18px_35px_rgba(79,143,248,0.35)]">Create Post →</Button>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-[1.8rem] border-0 bg-white shadow-[0_20px_50px_rgba(55,95,180,0.12)]">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle className="text-xl text-[#0e5fd8]">Latest posts</CardTitle>
                <CardDescription>Discussion and support from people working through similar feelings.</CardDescription>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full border border-slate-200"><Filter className="h-4 w-4" /></Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {stories.map((entry) => (
              <div key={entry.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="rounded-full bg-violet-100 text-violet-700">{entry.feeling}</Badge>
                  <Badge variant="secondary" className="rounded-full bg-sky-100 text-sky-700">{entry.author}</Badge>
                </div>
                <p className="font-semibold text-slate-900">{entry.title}</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">{entry.story}</p>
                <p className="mt-3 text-xs text-slate-400">{entry.createdAt}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
