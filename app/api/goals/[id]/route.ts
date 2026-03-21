import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { status, title, description, priority, targetDate } = await request.json()

    // Build dynamic update query
    const updates: string[] = []
    const values: any[] = []
    let paramIndex = 1

    if (status !== undefined) {
      updates.push(`status = $${paramIndex++}`)
      values.push(status)
    }
    if (title !== undefined) {
      updates.push(`title = $${paramIndex++}`)
      values.push(title)
    }
    if (description !== undefined) {
      updates.push(`description = $${paramIndex++}`)
      values.push(description)
    }
    if (priority !== undefined) {
      updates.push(`priority = $${paramIndex++}`)
      values.push(priority)
    }
    if (targetDate !== undefined) {
      updates.push(`target_date = $${paramIndex++}`)
      values.push(targetDate)
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { message: 'No fields to update' },
        { status: 400 }
      )
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`)
    values.push(parseInt(id))

    const result = await sql`
      UPDATE goals 
      SET status = COALESCE(${status}, status),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${parseInt(id)}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json(
        { message: 'Goal not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error updating goal:', error)
    return NextResponse.json(
      { message: 'An error occurred while updating the goal' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const result = await sql`
      SELECT * FROM goals WHERE id = ${parseInt(id)}
    `

    if (result.length === 0) {
      return NextResponse.json(
        { message: 'Goal not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error fetching goal:', error)
    return NextResponse.json(
      { message: 'An error occurred while fetching the goal' },
      { status: 500 }
    )
  }
}
