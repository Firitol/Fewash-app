import { NextRequest, NextResponse } from 'next/server'
import { hashPassword } from '@/lib/auth'
import { createUser, createPatientProfile, createTherapistProfile, getUserByEmail } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, role, phone } = await request.json()

    // Validation
    if (!email || !password || !fullName || !role) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    if (!['patient', 'therapist'].includes(role)) {
      return NextResponse.json(
        { message: 'Invalid role' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const user = await createUser(email, passwordHash, fullName, role as 'patient' | 'therapist', phone)

    // Create profile based on role
    if (role === 'patient') {
      await createPatientProfile(user.id, phone)
    } else {
      await createTherapistProfile(user.id, phone)
    }

    return NextResponse.json(
      {
        message: 'Registration successful',
        userId: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'An error occurred during registration' },
      { status: 500 }
    )
  }
}
