import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'

// GET assessment with questions
export async function GET(
  request: Request,
  { params }: { params: Promise<{ courseId: string; assessmentId: string }> }
) {
  const { courseId, assessmentId } = await params
  
  try {
    const assessment = await db.courseAssessment.findFirst({
      where: {
        id: assessmentId,
        courseId: courseId
      }
    })
    
    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
    }
    
    const questions = await db.assessmentQuestion.findMany({
      where: { assessmentId: assessmentId },
      select: {
        id: true,
        question: true,
        questionAr: true,
        type: true,
        options: true,
        points: true
      },
      orderBy: { id: 'asc' }
    })
    
    return NextResponse.json({
      success: true,
      assessment,
      questions
    })
    
  } catch (error) {
    console.error('Assessment fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch assessment' }, { status: 500 })
  }
}

// POST submit assessment answers
export async function POST(
  request: Request,
  { params }: { params: Promise<{ courseId: string; assessmentId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { courseId, assessmentId } = await params
  
  try {
    const body = await request.json()
    const { answers } = body // Array of { questionId, answer }
    
    // Get all questions with correct answers using prisma
    const questions = await db.assessmentQuestion.findMany({
      where: { assessmentId: assessmentId },
      select: {
        id: true,
        correctAnswer: true,
        points: true,
        explanation: true,
        explanationAr: true
      }
    })
    
    // Calculate score
    let totalScore = 0
    let maxScore = 0
    const results: any[] = []
    
    for (const question of questions) {
      const userAnswer = answers.find((a: any) => a.questionId === question.id)?.answer
      const isCorrect = userAnswer === question.correctAnswer
      const points = isCorrect ? question.points : 0
      
      totalScore += points
      maxScore += question.points
      
      results.push({
        questionId: question.id,
        correct: isCorrect,
        userAnswer,
        correctAnswer: question.correctAnswer,
        points,
        explanation: question.explanation,
        explanationAr: question.explanationAr
      })
    }
    
    const percentage = Math.round((totalScore / maxScore) * 100)
    const passed = percentage >= 70
    
    // Update progress with quiz score using prisma
    await db.courseProgress.upsert({
      where: {
        userId_courseId_lessonId: {
          userId: session.user.id,
          courseId: courseId,
          lessonId: assessmentId
        }
      },
      update: {
        quizScore: percentage,
        quizAttempts: { increment: 1 },
        completed: passed,
        completedAt: passed ? new Date() : undefined,
        updatedAt: new Date()
      },
      create: {
        userId: session.user.id,
        courseId: courseId,
        lessonId: assessmentId,
        completed: passed,
        quizScore: percentage,
        quizAttempts: 1,
        completedAt: passed ? new Date() : null,
      }
    })
    
    // Check if this is final exam and generate certificate if passed
    let certificate: any = null
    if (passed) {
      const assessment = await db.courseAssessment.findUnique({
        where: { id: assessmentId },
        select: { type: true }
      })
      
      if (assessment?.type === 'final') {
        // Check if all modules completed
        const completedCount = await db.courseProgress.count({
          where: {
            userId: session.user.id,
            courseId: courseId,
            completed: true
          }
        })
        
        const totalModules = await db.courseModule.count({
          where: { courseId: courseId }
        })
        
        if (completedCount >= totalModules) {
          // Generate certificate
          const certNumber = `DE-${Date.now()}-${session.user.id.slice(0, 8)}`
          certificate = await db.certificate.create({
            data: {
              userId: session.user.id,
              courseId: courseId,
              certificateNumber: certNumber,
              score: percentage,
              issueDate: new Date(),
            }
          })
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      score: totalScore,
      maxScore,
      percentage,
      passed,
      results,
      certificate: certificate || null
    })
    
  } catch (error) {
    console.error('Assessment submission error:', error)
    return NextResponse.json({ error: 'Failed to submit assessment' }, { status: 500 })
  }
}
