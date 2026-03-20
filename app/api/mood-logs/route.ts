import { NextRequest, NextResponse } from 'next/server'
import { createMoodLog, getMoodLogsByPatient } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { message: 'userId is required' },
        { status: 400 }
      )
    }

    const logs = await getMoodLogsByPatient(parseInt(userId))
    return NextResponse.json(logs)
  } catch (error) {
    console.error('Error fetching mood logs:', error)
    return NextResponse.json(
      { message: 'An error occurred while fetching mood logs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, moodScore, notes } = await request.json()

    if (!userId || moodScore === undefined) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (moodScore < 1 || moodScore > 10) {
      return NextResponse.json(
        { message: 'Mood score must be between 1 and 10' },
        { status: 400 }
      )
    }

    const log = await createMoodLog(
      parseInt(userId),
      moodScore,
      undefined,
      notes || undefined
    )

    return NextResponse.json(log, { status: 201 })
  } catch (error) {
    console.error('Error creating mood log:', error)
    return NextResponse.json(
      { message: 'An error occurred while creating the mood log' },
      { status: 500 }
    )
  }
}
