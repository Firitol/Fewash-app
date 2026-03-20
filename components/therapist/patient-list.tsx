'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Empty } from '@/components/ui/empty'
import { Users } from 'lucide-react'

interface PatientListProps {
  therapistId?: number
}

export default function PatientList({ therapistId }: PatientListProps) {
  const { t } = useTranslation()
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPatients = async () => {
      if (!therapistId) return
      try {
        const response = await fetch(`/api/therapist/patients?therapistId=${therapistId}`)
        if (response.ok) {
          const data = await response.json()
          setPatients(data)
        }
      } catch (error) {
        console.error('Error fetching patients:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [therapistId])

  if (loading) {
    return <div>{t('common.loading')}</div>
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-4">{t('therapist.myPatients')}</h2>
      </div>

      {patients.length === 0 ? (
        <Empty
          icon="Users"
          title="No Patients"
          description="You don't have any patients assigned yet."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {patients.map((patient) => (
            <Card key={patient.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>{patient.full_name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-gray-600">Email: {patient.email}</p>
                {patient.phone && <p className="text-sm text-gray-600">Phone: {patient.phone}</p>}
                <Button className="w-full mt-4" size="sm">
                  View Profile
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
