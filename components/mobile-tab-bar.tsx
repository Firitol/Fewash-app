'use client'

import { Home, Target, User, Zap, Users, CalendarDays, FileText, PlusCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MobileTabItem {
  value: string
  label: string
  icon?: string
}

interface MobileTabBarProps {
  items: MobileTabItem[]
  value: string
  onValueChange: (value: string) => void
  variant?: 'patient' | 'therapist'
}

const iconMap = {
  home: Home,
  goals: Target,
  me: User,
  action: Zap,
  patients: Users,
  create: PlusCircle,
  notes: FileText,
  sessions: CalendarDays,
}

export default function MobileTabBar({ items, value, onValueChange, variant = 'patient' }: MobileTabBarProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[calc(env(safe-area-inset-bottom)+0.25rem)] pt-1">
      <div className="mx-auto max-w-lg rounded-[28px] border border-slate-200/50 bg-white/95 px-2 py-2 shadow-[0_-8px_32px_rgba(15,23,42,0.12),0_4px_16px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <div className="grid grid-cols-4 gap-1">
          {items.map((item) => {
            const Icon = iconMap[item.value as keyof typeof iconMap] ?? Home
            const active = item.value === value

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => onValueChange(item.value)}
                className={cn(
                  'relative flex flex-col items-center justify-center rounded-2xl px-3 py-2.5 transition-all duration-300 ease-out',
                  active
                    ? 'scale-[1.02]'
                    : 'text-slate-400 hover:text-slate-600 active:scale-95'
                )}
              >
                {active && (
                  <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-lg shadow-slate-900/25" />
                )}
                <span className={cn(
                  'relative z-10 mb-1 flex h-7 w-7 items-center justify-center rounded-xl transition-all duration-300',
                  active && 'text-white'
                )}>
                  <Icon className={cn(
                    'h-5 w-5 transition-all duration-300',
                    active && 'scale-110'
                  )} strokeWidth={active ? 2.5 : 2} />
                </span>
                <span className={cn(
                  'relative z-10 text-[11px] font-semibold tracking-wide transition-colors duration-300',
                  active ? 'text-white' : 'text-slate-500'
                )}>
                  {item.label}
                </span>
                {active && (
                  <span className="absolute -top-0.5 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-white/30" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
