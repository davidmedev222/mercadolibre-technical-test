import { dnaSchema, isMutant } from '@/app/utils'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = dnaSchema.parse(body)
    if (!isMutant(data.dna)) return NextResponse.json({ data: null, error: 'DNA is not a mutant.' }, { status: 403 })

    return NextResponse.json({ data: 'DNA is a mutant.', error: null })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors.map((error) => error.message).join(', '), data: null },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred.', data: null },
      { status: 500 }
    )
  }
}
