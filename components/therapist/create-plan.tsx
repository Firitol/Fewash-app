'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'

interface CreatePlanProps {
  therapistId?: number
}

export default function CreatePlan({ therapistId }: CreatePlanProps) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    patientId: '',
    title: '',
    description: '',
    startDate: '',
    endDate: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/treatment-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          therapistId,
        }),
      })

      if (response.ok) {
        setMessage('Treatment plan created successfully!')
        setFormData({
          patientId: '',
          title: '',
          description: '',
          startDate: '',
          endDate: '',
        })
      } else {
        const data = await response.json()
        setMessage(data.message || 'Error creating plan')
      }
    } catch (error) {
      setMessage('An error occurred while creating the plan')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>{t('plan.createPlan')}</CardTitle>
        </CardHeader>
        <CardContent>
          {message && (
            <Alert className="mb-4" variant={message.includes('success') ? 'default' : 'destructive'}>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Patient ID</label>
              <Input
                type="number"
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">{t('plan.title')}</label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">{t('plan.description')}</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">{t('plan.startDate')}</label>
                <Input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">{t('plan.endDate')}</label>
                <Input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  {t('common.loading')}
                </>
              ) : (
                t('plan.createPlan')
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
