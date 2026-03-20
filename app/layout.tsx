'use client'

import { Analytics } from '@vercel/analytics/next'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/lib/i18n'
import './globals.css'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <title>Hakim - Psychotherapy Application</title>
        <meta name="description" content="Psychotherapy patient management and tracking application" />
      </head>
      <body className="font-sans antialiased">
        <I18nextProvider i18n={i18n}>
          {children}
          <Analytics />
        </I18nextProvider>
      </body>
    </html>
  )
}
