import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

// GET endpoint to fetch ICD-10 mappings for validation
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is authenticated and has admin role
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') || 'pending'
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: any = {}
    
    if (status === 'pending') {
      where.requiresReview = true
      where.isValidated = false
    } else if (status === 'validated') {
      where.isValidated = true
    }

    const mappings = await db.iCD10Mapping.findMany({
      where,
      include: {
        drug: {
          select: {
            packageName: true,
            genericName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    // Calculate statistics
    const total = await db.iCD10Mapping.count()
    const pending = await db.iCD10Mapping.count({
      where: { requiresReview: true, isValidated: false }
    })
    const validated = await db.iCD10Mapping.count({
      where: { isValidated: true }
    })
    const tier1 = await db.iCD10Mapping.count({
      where: { 
        OR: [
          { source: 'FDA_SPL' },
          { source: 'DAILYMED_SPL' }
        ]
      }
    })
    const tier2 = await db.iCD10Mapping.count({
      where: { 
        OR: [
          { source: 'WHO_ATC' },
          { source: 'RXNORM' }
        ]
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        mappings,
        stats: {
          total,
          pending,
          validated,
          tier1,
          tier2,
          tier3: total - tier1 - tier2
        }
      }
    })
  } catch (error) {
    console.error('Error fetching validation mappings:', error)
    return NextResponse.json({ error: 'Failed to fetch mappings' }, { status: 500 })
  }
}

// POST endpoint to validate/reject ICD-10 mappings
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is authenticated and has admin role
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { mappingId, approved } = body

    if (!mappingId || typeof approved !== 'boolean') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    // Update the mapping
    const updatedMapping = await db.iCD10Mapping.update({
      where: { id: mappingId },
      data: {
        isValidated: approved,
        validatedBy: session.user.email,
        validationDate: new Date(),
        requiresReview: false,
        lastVerified: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedMapping
    })
  } catch (error) {
    console.error('Error validating mapping:', error)
    return NextResponse.json({ error: 'Failed to validate mapping' }, { status: 500 })
  }
}
