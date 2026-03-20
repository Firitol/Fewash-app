'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Brain, Flame, NotebookPen, Sparkles, Wind } from 'lucide-react'

const DEFAULT_LADDER = [
  'Send one low-pressure message to someone you trust.',
  'Spend 10 minutes outside and notice your surroundings.',
  'Practice a difficult conversation in writing.',
]

const COPING_CARDS = [
  'This feeling is intense, but it will pass.',
  'I can take one small step instead of solving everything at once.',
  'My thoughts are important signals, but they are not always facts.',
  'Progress counts even when it is quiet or invisible to others.',
]

export default function MindshiftToolkit() {
  const [situation, setSituation] = useState('')
  const [thought, setThought] = useState('')
  const [balancedThought, setBalancedThought] = useState('')
  const [fearStep, setFearStep] = useState('')
  const [fearLadder, setFearLadder] = useState<string[]>(DEFAULT_LADDER)

  useEffect(() => {
    const saved = window.localStorage.getItem('mindshift-fear-ladder')
    if (saved) {
      setFearLadder(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem('mindshift-fear-ladder', JSON.stringify(fearLadder))
  }, [fearLadder])

  const journalReady = useMemo(() => {
    return situation.trim().length > 0 && thought.trim().length > 0 && balancedThought.trim().length > 0
  }, [balancedThought, situation, thought])

  const addFearStep = () => {
    if (!fearStep.trim()) return
    setFearLadder((current) => [...current, fearStep.trim()])
    setFearStep('')
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1.15fr,0.85fr]">
      <div className="space-y-5">
        <Card className="border-white/70 bg-white/90 shadow-lg shadow-slate-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <NotebookPen className="h-5 w-5 text-violet-600" />
              Thought journal
            </CardTitle>
            <CardDescription>
              Capture a difficult moment, identify the thought behind it, and replace it with a kinder perspective.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">What happened?</label>
              <Textarea value={situation} onChange={(e) => setSituation(e.target.value)} placeholder="Describe the situation that felt stressful or heavy." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">What thought showed up?</label>
              <Textarea value={thought} onChange={(e) => setThought(e.target.value)} placeholder="Example: I am going to fail or disappoint everyone." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">What is a more balanced thought?</label>
              <Textarea value={balancedThought} onChange={(e) => setBalancedThought(e.target.value)} placeholder="Example: I am under pressure, but I have handled hard things before." />
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                <span>Reflection completeness</span>
                <span>{journalReady ? '100%' : '67%'}</span>
              </div>
              <Progress value={journalReady ? 100 : 67} className="h-2.5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/70 bg-white/90 shadow-lg shadow-slate-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Flame className="h-5 w-5 text-amber-500" />
              Fear ladder planner
            </CardTitle>
            <CardDescription>
              Build a gradual exposure pathway that lets you face anxiety in manageable, confidence-building steps.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input value={fearStep} onChange={(e) => setFearStep(e.target.value)} placeholder="Add a new step for your ladder" />
              <Button onClick={addFearStep}>Add</Button>
            </div>
            <div className="space-y-3">
              {fearLadder.map((item, index) => (
                <div key={`${item}-${index}`} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <Badge className="mt-0.5 rounded-full bg-slate-900 px-2 py-1 text-white hover:bg-slate-900">{index + 1}</Badge>
                  <p className="text-sm leading-6 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-5">
        <Card className="border-white/70 bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-xl shadow-cyan-200/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Wind className="h-5 w-5" />
              Quick reset
            </CardTitle>
            <CardDescription className="text-cyan-50">
              Use this when you need immediate grounding before tackling the rest of your day.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-2xl bg-white/15 p-4">Breathe in for 4, hold for 4, out for 6. Repeat 4 times.</div>
            <div className="rounded-2xl bg-white/15 p-4">Name 5 things you can see, 4 you can feel, 3 you can hear.</div>
            <div className="rounded-2xl bg-white/15 p-4">Choose one supportive action from your dashboard and finish only that.</div>
          </CardContent>
        </Card>

        <Card className="border-white/70 bg-white/90 shadow-lg shadow-slate-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Brain className="h-5 w-5 text-emerald-600" />
              Coping cards
            </CardTitle>
            <CardDescription>
              Evidence-friendly reminders you can come back to when your thoughts feel loud.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {COPING_CARDS.map((card) => (
              <div key={card} className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
                {card}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/70 bg-slate-950 text-white shadow-xl shadow-slate-300/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-5 w-5 text-fuchsia-300" />
              Self-coaching prompt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-7 text-slate-300">
              If your best friend described this exact situation to you, what would you say back to help them feel safer, stronger, and less alone?
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
