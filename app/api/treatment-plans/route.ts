import { NextRequest, NextResponse } from 'next/server'
import { createTreatmentPlan, getTreatmentPlansByPatient } from '@/lib/db'

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

    const plans = await getTreatmentPlansByPatient(parseInt(userId))
    return NextResponse.json(plans)
  } catch (error) {
    console.error('Error fetching plans:', error)
    return NextResponse.json(
      { message: 'An error occurred while fetching plans' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { patientId, therapistId, title, description, startDate, endDate } =
      await request.json()

    if (!patientId || !therapistId || !title || !startDate) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    const plan = await createTreatmentPlan(
      parseInt(patientId),
      parseInt(therapistId),
      title,
      description || '',
      startDate,
      endDate || undefined
    )

    return NextResponse.json(plan, { status: 201 })
  } catch (error) {
    console.error('Error creating plan:', error)
    return NextResponse.json(
      { message: 'An error occurred while creating the plan' },
      { status: 500 }
    )
  }
}
