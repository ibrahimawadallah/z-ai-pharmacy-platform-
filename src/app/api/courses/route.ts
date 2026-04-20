import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'

// GET all courses or specific course
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const courseId = searchParams.get('id')
  const category = searchParams.get('category')
  const level = searchParams.get('level')
  
  try {
    if (courseId) {
      // Get specific course with all modules and assessments using prisma
      const course = await db.course.findUnique({
        where: { id: courseId },
        include: {
          modules: {
            orderBy: { moduleNumber: 'asc' }
          },
          assessments: true
        }
      })

      if (!course) {
        return NextResponse.json({ error: 'Course not found' }, { status: 404 })
      }
      
      return NextResponse.json({
        success: true,
        course,
        modules: course.modules,
        assessments: course.assessments
      })
    }
    
    // Get all courses with filters using prisma
    const where: any = { isPublished: true }
    if (category) where.category = category
    if (level) where.level = level

    const courses = await db.course.findMany({ where })
    
    return NextResponse.json({
      success: true,
      courses
    })
    
  } catch (error) {
    console.error('Course fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}

// POST create new course with 8-module structure
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const body = await request.json()
    const {
      title,
      titleAr,
      category,
      level = 'intermediate',
      creditHours = 6,
      description,
      learningObjectives,
      targetAudience,
      prerequisites,
      isAIGenerated = false
    } = body
    
    // Create course using prisma
    const course = await db.course.create({
      data: {
        title,
        titleAr,
        category,
        level,
        creditHours,
        description,
        learningObjectives,
        targetAudience,
        prerequisites,
        isAIGenerated,
        createdBy: session.user.id,
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Course structure created. Please add modules next.',
      courseId: course.id,
      course
    })
    
  } catch (error) {
    console.error('Course creation error:', error)
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 })
  }
}
