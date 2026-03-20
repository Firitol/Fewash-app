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
import { LogOut, Settings, User } from 'lucide-react'

interface TherapistNavProps {
  user: any
  onLanguageToggle: () => void
}

export default function TherapistNav({ user, onLanguageToggle }: TherapistNavProps) {
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
    <nav className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Relief-Zone</h1>
          <span className="text-sm ml-2 opacity-90">
            {t('therapist.dashboard')}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={onLanguageToggle}
            className="text-gray-800"
          >
            {i18n.language === 'am' ? 'አማርኛ' : 'ኦሮሞ'}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="flex items-center gap-2 text-gray-800">
                <User className="h-5 w-5" />
                <span className="hidden sm:inline">Dr. {user?.fullName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push('/therapist/profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>{t('therapist.profile')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/therapist/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>{t('common.settings')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t('therapist.logout')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
