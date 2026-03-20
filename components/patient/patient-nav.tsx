'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Bell, Globe2, LogOut, Settings, User } from 'lucide-react'

interface PatientNavProps {
  user: any
  onLanguageToggle: () => void
}

export default function PatientNav({ user, onLanguageToggle }: PatientNavProps) {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      setIsLoggingOut(false)
    }
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 text-white">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="text-left transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/40 rounded-xl"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-white/55">Fewash wellness</p>
          <h1 className="text-xl font-semibold">Relief-Zone</h1>
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full border border-white/10 bg-white/10 text-white transition-all hover:bg-white/15 hover:scale-[1.02]"
            onClick={() => router.push('/patient/dashboard')}
          >
            <Bell className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            onClick={onLanguageToggle}
            className="rounded-full border border-white/10 bg-white/10 px-3 text-white transition-all hover:bg-white/15 hover:scale-[1.02]"
          >
            <Globe2 className="mr-2 h-4 w-4" />
            {i18n.language === 'am' ? 'አማርኛ' : 'ኦሮሞ'}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-full border border-white/10 bg-white/10 px-3 text-white transition-all hover:bg-white/15 hover:scale-[1.02]">
                <User className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">{user?.fullName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push('/patient/profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>{t('patient.profile')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/patient/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>{t('common.settings')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t('patient.logout')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
