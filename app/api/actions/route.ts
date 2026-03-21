import { NextRequest, NextResponse } from 'next/server'
import { createAction, getTreatmentPlansByPatient, getGoalsByPlan, getActionsByGoal } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const goalId = searchParams.get('goalId')

    // If goalId is provided, return actions for that specific goal
    if (goalId) {
      const actions = await getActionsByGoal(parseInt(goalId))
      return NextResponse.json(actions)
    }

    if (!userId) {
      return NextResponse.json(
        { message: 'userId or goalId is required' },
        { status: 400 }
      )
    }

    // Get all treatment plans for the patient
    const plans = await getTreatmentPlansByPatient(parseInt(userId))

    // Get all actions from all goals in all plans
    let allActions: any[] = []
    for (const plan of plans) {
      const goals = await getGoalsByPlan(plan.id)
      for (const goal of goals) {
        const actions = await getActionsByGoal(goal.id)
        allActions = [...allActions, ...actions]
      }
    }

    return NextResponse.json(allActions)
  } catch (error) {
    console.error('Error fetching actions:', error)
    return NextResponse.json(
      { message: 'An error occurred while fetching actions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { goalId, title, description, dueDate } = await request.json()

    if (!goalId || !title) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    const action = await createAction(
      parseInt(goalId),
      title,
      description || undefined,
      dueDate || undefined
    )

    return NextResponse.json(action, { status: 201 })
  } catch (error) {
    console.error('Error creating action:', error)
    return NextResponse.json(
      { message: 'An error occurred while creating the action' },
      { status: 500 }
    )
  }
}
