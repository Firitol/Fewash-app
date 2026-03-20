import { NextRequest, NextResponse } from 'next/server'
import { getChillZoneResources } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const language = searchParams.get('language') || 'amharic'
    const type = searchParams.get('type')

    if (!['amharic', 'afan_oromo'].includes(language)) {
      return NextResponse.json(
        { message: 'Invalid language' },
        { status: 400 }
      )
    }

    const resources = await getChillZoneResources(
      language as 'amharic' | 'afan_oromo',
      type || undefined
    )

    return NextResponse.json(resources)
  } catch (error) {
    console.error('Error fetching chill zone resources:', error)
    return NextResponse.json(
      { message: 'An error occurred while fetching resources' },
      { status: 500 }
    )
  }
}
