'use client'

import { CalendarDays, FileText, HeartPulse, Home, ListChecks, NotebookTabs, PlusCircle, Sparkles, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MobileTabItem {
  value: string
  label: string
}

interface MobileTabBarProps {
  items: MobileTabItem[]
  value: string
  onValueChange: (value: string) => void
}

const iconMap = {
  overview: Home,
  toolkit: Sparkles,
  plans: NotebookTabs,
  goals: ListChecks,
  actions: HeartPulse,
  mood: HeartPulse,
  chill: Sparkles,
  share: FileText,
  patients: Users,
  create: PlusCircle,
  notes: FileText,
  sessions: CalendarDays,
}

export default function MobileTabBar({ items, value, onValueChange }: MobileTabBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/70 bg-white/90 px-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 shadow-[0_-12px_30px_rgba(15,23,42,0.08)] backdrop-blur md:hidden">
      <div className="no-scrollbar mx-auto flex max-w-5xl gap-2 overflow-x-auto pb-1">
        {items.map((item) => {
          const Icon = iconMap[item.value as keyof typeof iconMap] ?? Home
          const active = item.value === value

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onValueChange(item.value)}
              className={cn(
                'flex min-h-16 min-w-20 shrink-0 flex-1 flex-col items-center justify-center rounded-2xl px-3 py-2 text-[11px] font-medium transition-colors',
                active
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <Icon className="mb-1 h-4 w-4" />
              <span className="line-clamp-2 text-center leading-tight">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
