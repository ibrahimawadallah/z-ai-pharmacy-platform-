import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'

// GET module content
export async function GET(
  request: Request,
  { params }: { params: Promise<{ courseId: string; moduleId: string }> }
) {
  const { courseId, moduleId } = await params
  
  try {
    const courseModule = await db.courseModule.findFirst({
      where: {
        id: moduleId,
        courseId: courseId
      }
    })
    
    if (!courseModule) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 })
    }
    
    // Get user's progress for this module using prisma
    const session = await getServerSession(authOptions)
    let progress: any = null
    
    if (session?.user?.id) {
      progress = await db.courseProgress.findFirst({
        where: {
          userId: session.user.id,
          courseId: courseId,
          lessonId: moduleId
        }
      })
    }
    
    return NextResponse.json({
      success: true,
      module: courseModule,
      progress
    })
    
  } catch (error) {
    console.error('Module fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch module' }, { status: 500 })
  }
}

// PATCH update module content (admin/instructor only)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ courseId: string; moduleId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { courseId, moduleId } = await params
  
  try {
    const body = await request.json()
    const {
      content,
      contentAr,
      learningOutcomes,
      keyPoints,
      drugReferences,
      caseStudies,
      estimatedMinutes
    } = body
    
    await db.courseModule.update({
      where: { 
        id: moduleId,
        courseId: courseId
      },
      data: {
        content: content ?? undefined,
        contentAr: contentAr ?? undefined,
        learningOutcomes: learningOutcomes ?? undefined,
        keyPoints: keyPoints ?? undefined,
        drugReferences: drugReferences ?? undefined,
        caseStudies: caseStudies ?? undefined,
        estimatedMinutes: estimatedMinutes ?? undefined,
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Module updated successfully'
    })
    
  } catch (error) {
    console.error('Module update error:', error)
    return NextResponse.json({ error: 'Failed to update module' }, { status: 500 })
  }
}

// POST mark module as complete
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; moduleId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { courseId, moduleId } = await params
  
  try {
    await db.courseProgress.upsert({
      where: {
        userId_courseId_lessonId: {
          userId: session.user.id,
          courseId: courseId,
          lessonId: moduleId
        }
      },
      update: {
        completed: true,
        completedAt: new Date()
      },
      create: {
        userId: session.user.id,
        courseId: courseId,
        lessonId: moduleId,
        completed: true,
        completedAt: new Date()
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Module marked as complete'
    })
    
  } catch (error) {
    console.error('Progress update error:', error)
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 })
  }
}
