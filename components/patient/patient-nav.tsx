'use client'

import Link from 'next/link'
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
    <nav className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 shadow-sm backdrop-blur">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-blue-600 sm:text-2xl">Hakim</h1>
          <span className="text-xs text-slate-600 sm:text-sm">
            {t('patient.dashboard')}
          </span>
        </div>

        <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          >
            <Bell className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            onClick={onLanguageToggle}
            className="rounded-full border-slate-200 bg-white px-3 text-slate-700 hover:bg-slate-50"
          >
            <Globe2 className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">{i18n.language === 'am' ? 'አማርኛ' : 'ኦሮሞ'}</span>
            <span className="sm:hidden">Lang</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-full border-slate-200 bg-white px-3 text-slate-700 hover:bg-slate-50">
                <User className="h-4 w-4 sm:mr-2" />
                <span className="hidden max-w-32 truncate sm:inline">{user?.fullName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push('/patient/dashboard')}>
                <Bell className="mr-2 h-4 w-4" />
                <span>{t('patient.dashboard')}</span>
              </DropdownMenuItem>
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
