import { NextRequest, NextResponse } from 'next/server'
import { updateActionStatus } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json()

    if (!status) {
      return NextResponse.json(
        { message: 'Status is required' },
        { status: 400 }
      )
    }

    const action = await updateActionStatus(parseInt(params.id), status)
    return NextResponse.json(action)
  } catch (error) {
    console.error('Error updating action:', error)
    return NextResponse.json(
      { message: 'An error occurred while updating the action' },
      { status: 500 }
    )
  }
}
