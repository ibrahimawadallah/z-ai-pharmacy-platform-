import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  void request
  return NextResponse.json(
    { error: 'Deprecated endpoint' },
    { status: 410 }
  )
}
