import { NextRequest, NextResponse } from 'next/server'
import { createTherapistNote, getTherapistNotesByPatient } from '@/lib/db'

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

    // For now, return empty array as we need to query differently
    // In a real app, we'd fetch notes created by this therapist
    return NextResponse.json([])
  } catch (error) {
    console.error('Error fetching therapist notes:', error)
    return NextResponse.json(
      { message: 'An error occurred while fetching notes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { patientId, therapistId, note, sessionDate } = await request.json()

    if (!patientId || !therapistId || !note) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    const createdNote = await createTherapistNote(
      parseInt(patientId),
      parseInt(therapistId),
      note,
      sessionDate || undefined
    )

    return NextResponse.json(createdNote, { status: 201 })
  } catch (error) {
    console.error('Error creating therapist note:', error)
    return NextResponse.json(
      { message: 'An error occurred while creating the note' },
      { status: 500 }
    )
  }
}
