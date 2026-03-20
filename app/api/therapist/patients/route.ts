import { NextRequest, NextResponse } from 'next/server'
import { getTherapistPatients } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const therapistId = searchParams.get('therapistId')

    if (!therapistId) {
      return NextResponse.json(
        { message: 'therapistId is required' },
        { status: 400 }
      )
    }

    const patients = await getTherapistPatients(parseInt(therapistId))
    return NextResponse.json(patients)
  } catch (error) {
    console.error('Error fetching therapist patients:', error)
    return NextResponse.json(
      { message: 'An error occurred while fetching patients' },
      { status: 500 }
    )
  }
}
