import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { db } from '@/lib/db'
import { authOptions } from '@/lib/auth-options'

// GET /api/user/progress
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId') || null

    const completedModules = await db.courseProgress.count({
      where: {
        userId: session.user.id,
        ...(courseId ? { courseId } : {}),
        completed: true
      }
    })

    const totalModules = await db.courseModule.count({
      where: courseId ? { courseId } : undefined
    })

    const lastProgress = await db.courseProgress.findFirst({
      where: {
        userId: session.user.id,
        ...(courseId ? { courseId } : {})
      },
      select: { courseId: true },
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: {
        completedModules,
        totalModules,
        lastCourseId: lastProgress?.courseId || courseId
      }
    })
  } catch (error) {
    console.error('Get progress error:', error)
    return NextResponse.json({ success: false, error: 'Failed to get progress' }, { status: 500 })
  }
}

// POST /api/user/progress
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const courseId = body?.courseId || body?.lastCourseId || null

    const completedModules = await db.courseProgress.count({
      where: {
        userId: session.user.id,
        ...(courseId ? { courseId } : {}),
        completed: true
      }
    })

    const totalModules = await db.courseModule.count({
      where: courseId ? { courseId } : undefined
    })

    return NextResponse.json({
      success: true,
      data: {
        completedModules,
        totalModules,
        lastCourseId: courseId
      }
    })
  } catch (error) {
    console.error('Update progress error:', error)
    return NextResponse.json({ success: false, error: 'Failed to update progress' }, { status: 500 })
  }
}
