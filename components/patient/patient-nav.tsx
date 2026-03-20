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
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-blue-600">Hakim</h1>
          <span className="text-sm text-gray-600 ml-2">
            {t('patient.dashboard')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full border border-white/10 bg-white/10 text-white hover:bg-white/15"
          >
            <Bell className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            onClick={onLanguageToggle}
            className="rounded-full border border-white/10 bg-white/10 px-3 text-white hover:bg-white/15"
          >
            <Globe2 className="mr-2 h-4 w-4" />
            {i18n.language === 'am' ? 'አማርኛ' : 'ኦሮሞ'}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-full border border-white/10 bg-white/10 px-3 text-white hover:bg-white/15">
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
