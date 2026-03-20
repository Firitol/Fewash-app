import { NextRequest, NextResponse } from 'next/server'
import { createSession, getSessionsByPatient } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const therapistId = searchParams.get('therapistId')
    const patientId = searchParams.get('patientId')

    if (patientId) {
      const sessions = await getSessionsByPatient(parseInt(patientId))
      return NextResponse.json(sessions)
    }

    // For therapist, return empty for now
    return NextResponse.json([])
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json(
      { message: 'An error occurred while fetching sessions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { patientId, therapistId, sessionDate, sessionType } =
      await request.json()

    if (!patientId || !therapistId || !sessionDate) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    const session = await createSession(
      parseInt(patientId),
      parseInt(therapistId),
      sessionDate,
      sessionType || 'in_person'
    )

    return NextResponse.json(session, { status: 201 })
  } catch (error) {
    console.error('Error creating session:', error)
    return NextResponse.json(
      { message: 'An error occurred while creating the session' },
      { status: 500 }
    )
  }
}
