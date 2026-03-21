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
        <title>Relief zone - Psychotherapy Application</title>
        <meta name="description" content="Psychotherapy patient management and tracking application" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#4f46e5" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Hakim" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/icons/icon.svg" />
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
