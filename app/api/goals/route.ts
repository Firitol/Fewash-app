import { NextRequest, NextResponse } from 'next/server'
import { createGoal, getTreatmentPlansByPatient, getGoalsByPlan } from '@/lib/db'

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

    // Get all treatment plans for the patient
    const plans = await getTreatmentPlansByPatient(parseInt(userId))

    // Get all goals from all plans
    let allGoals: any[] = []
    for (const plan of plans) {
      const goals = await getGoalsByPlan(plan.id)
      allGoals = [...allGoals, ...goals]
    }

    return NextResponse.json(allGoals)
  } catch (error) {
    console.error('Error fetching goals:', error)
    return NextResponse.json(
      { message: 'An error occurred while fetching goals' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { planId, title, description, targetDate, priority } =
      await request.json()

    if (!planId || !title) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    const goal = await createGoal(
      parseInt(planId),
      title,
      description || undefined,
      targetDate || undefined,
      priority || 'medium'
    )

    return NextResponse.json(goal, { status: 201 })
  } catch (error) {
    console.error('Error creating goal:', error)
    return NextResponse.json(
      { message: 'An error occurred while creating the goal' },
      { status: 500 }
    )
  }
}
