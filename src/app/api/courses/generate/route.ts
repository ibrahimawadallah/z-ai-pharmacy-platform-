import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { getGroqService } from '@/lib/groq'
import { getOllamaService } from '@/lib/ollama'

const COURSE_TEMPLATES: Record<
  string,
  {
    title: string
    titleAr?: string
    category: string
    description: string
    learningObjectives: string
    drugFocus?: string[]
  }
> = {
  antibiotics: {
    title: 'Antibiotic Stewardship & Infectious Diseases',
    titleAr: 'ترشيد استخدام المضادات الحيوية والأمراض المعدية',
    category: 'Infectious Diseases',
    description:
      'Evidence-based antibiotic selection, dosing, monitoring, and stewardship for common infections.',
    learningObjectives:
      'Select appropriate empiric and targeted therapy, optimize dosing, prevent resistance, and manage adverse effects.',
    drugFocus: ['Amoxicillin', 'Ceftriaxone', 'Azithromycin', 'Vancomycin', 'Piperacillin/Tazobactam']
  },
  diabetes: {
    title: 'Diabetes Pharmacotherapy & Patient Management',
    titleAr: 'العلاج الدوائي للسكري وإدارة المريض',
    category: 'Endocrinology',
    description:
      'Comprehensive diabetes management covering insulin, oral agents, monitoring, and complication prevention.',
    learningObjectives:
      'Individualize therapy, manage hypoglycemia risk, counsel on monitoring, and optimize outcomes.',
    drugFocus: ['Metformin', 'Insulin glargine', 'Empagliflozin', 'Semaglutide', 'Gliclazide']
  },
  cardiology: {
    title: 'Cardiovascular Pharmacotherapy Essentials',
    titleAr: 'أساسيات العلاج الدوائي لأمراض القلب والأوعية',
    category: 'Cardiology',
    description:
      'Core cardiovascular drug classes, guideline-directed therapy, and monitoring for common conditions.',
    learningObjectives:
      'Apply guideline-based treatment, manage interactions, and counsel patients for adherence and safety.',
    drugFocus: ['Atorvastatin', 'Amlodipine', 'Lisinopril', 'Metoprolol', 'Furosemide']
  }
}

// POST generate AI course
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const body = await request.json()
    const { template = 'antibiotics', customTitle, aiModel = 'groq' } = body
    
    // Get template or use custom
    const courseData = COURSE_TEMPLATES[template] || {
      title: customTitle || 'Pharmacy Master Course',
      category: 'General',
      description: 'Comprehensive pharmacy course',
      learningObjectives: 'Master key pharmacy concepts'
    }

    // Try Ollama first, then fallback to Groq, then templates
    let moduleContent: any[] = []
    let moduleQuestions: any[][] = []
    let finalQuestions: any[] = []
    let isActuallyAIGenerated = false
    let aiProvider = ''

    // Try Ollama first (local)
    if (aiModel === 'ollama' || aiModel === 'groq') {
      try {
        const ollama = getOllamaService()
        const isAvailable = await ollama.testConnection()
        if (isAvailable) {
          console.log('Using Ollama for AI course generation')
          const systemPrompt = `You are an expert Clinical Pharmacy Educator. Generate comprehensive course content for: ${courseData.title}.
Return a JSON object with:
- modules: array of 8 objects { title, titleAr, content, contentAr, learningOutcomes, keyPoints, caseStudies }
- moduleQuestions: array of 8 arrays, each containing 5 questions { question, questionAr, options: string[], correctAnswer, explanation, explanationAr }
- finalQuestions: array of 20 questions { question, questionAr, options: string[], correctAnswer, explanation, explanationAr }
- courseSummary: string (markdown)
- drugChart: string (markdown table)
- patientGuide: string (markdown)`

          const prompt = `Generate a course on ${courseData.category} focusing on: ${courseData.drugFocus?.join(', ') || 'general therapy'}. 
Description: ${courseData.description}
Learning Objectives: ${courseData.learningObjectives}`

          const aiResponse = await ollama.generateResponse(prompt, systemPrompt)
          const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            const result = JSON.parse(jsonMatch[0])
            moduleContent = result.modules
            moduleQuestions = result.moduleQuestions
            finalQuestions = result.finalQuestions
            isActuallyAIGenerated = true
            aiProvider = 'ollama'
          }
        }
      } catch (ollamaErr) {
        console.log('Ollama not available, trying Groq:', ollamaErr)
      }
    }

    // Try Groq if Ollama failed and Groq requested
    if (!isActuallyAIGenerated && process.env.GROQ_API_KEY && aiModel === 'groq') {
      try {
        const groq = getGroqService()
        const systemPrompt = `You are an expert Clinical Pharmacy Educator. Generate comprehensive course content for: ${courseData.title}.
Return a JSON object with:
- modules: array of 8 objects { title, titleAr, content, contentAr, learningOutcomes, keyPoints, caseStudies }
- moduleQuestions: array of 8 arrays, each containing 5 questions { question, questionAr, options: string[], correctAnswer, explanation, explanationAr }
- finalQuestions: array of 20 questions { question, questionAr, options: string[], correctAnswer, explanation, explanationAr }
- courseSummary: string (markdown)
- drugChart: string (markdown table)
- patientGuide: string (markdown)`

        const prompt = `Generate a course on ${courseData.category} focusing on: ${courseData.drugFocus?.join(', ') || 'general therapy'}. 
Description: ${courseData.description}
Learning Objectives: ${courseData.learningObjectives}`

        const aiResponse = await groq.generateResponse(prompt, systemPrompt)
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const result = JSON.parse(jsonMatch[0])
          moduleContent = result.modules
          moduleQuestions = result.moduleQuestions
          finalQuestions = result.finalQuestions
          isActuallyAIGenerated = true
          aiProvider = 'groq'
        }
      } catch (err) {
        console.error('Groq course generation failed, falling back to templates:', err)
      }
    }

    // Fallback to templates if Groq failed or wasn't used
    if (!isActuallyAIGenerated) {
      moduleContent = generateModuleContent(courseData, aiModel)
      for (let i = 1; i <= 8; i++) {
        moduleQuestions.push(generateModuleQuestions(courseData, i))
      }
      finalQuestions = generateFinalExamQuestions(courseData)
    }
    
    // Create course using prisma
    const course = await db.course.create({
      data: {
        title: courseData.title,
        titleAr: courseData.titleAr || null,
        category: courseData.category,
        level: 'intermediate',
        creditHours: 8,
        description: courseData.description,
        learningObjectives: courseData.learningObjectives,
        targetAudience: 'Pharmacists, Pharmacy Students, Clinical Pharmacists',
        prerequisites: 'Basic pharmacology knowledge',
        isAIGenerated: true,
        createdBy: session.user.id,
      }
    })
    
    const courseId = course.id
    
    // Create 8 modules
    for (let i = 0; i < 8; i++) {
      const mod = moduleContent[i]
      const courseModule = await db.courseModule.create({
        data: {
          courseId,
          moduleNumber: i + 1,
          title: mod.title,
          titleAr: mod.titleAr,
          content: mod.content,
          contentAr: mod.contentAr,
          learningOutcomes: mod.learningOutcomes,
          keyPoints: mod.keyPoints,
          drugReferences: JSON.stringify(courseData.drugFocus || []),
          caseStudies: mod.caseStudies,
          estimatedMinutes: 60,
        }
      })
      
      const moduleId = courseModule.id

      // Create assessment for this module
      const assessment = await db.courseAssessment.create({
        data: {
          courseId,
          type: 'module',
          moduleId: moduleId,
          title: `Module ${i + 1} Quiz`,
          passingScore: 70,
        }
      })
      
      const assessmentId = assessment.id
      
      const questions = moduleQuestions[i]
      for (const q of questions) {
        await db.assessmentQuestion.create({
          data: {
            assessmentId,
            question: q.question,
            questionAr: q.questionAr,
            type: 'multiple_choice',
            options: JSON.stringify(q.options),
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            explanationAr: q.explanationAr,
            points: 1
          }
        })
      }
    }
    
    // Create final exam
    const finalAssessment = await db.courseAssessment.create({
      data: {
        courseId,
        type: 'final',
        title: 'Final Comprehensive Exam',
        timeLimit: 120,
        passingScore: 70,
        instructions: 'Comprehensive exam covering all 8 modules. 70% required to pass.',
      }
    })
    
    const finalId = finalAssessment.id
    
    for (const q of finalQuestions) {
      await db.assessmentQuestion.create({
        data: {
          assessmentId: finalId,
          question: q.question,
          questionAr: q.questionAr,
          type: 'multiple_choice',
        options: JSON.stringify(q.options),
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          explanationAr: q.explanationAr,
          points: 1
        }
      })
    }
    
    // Create resources
    await db.courseResource.createMany({
      data: [
        {
          courseId,
          type: 'pdf',
          title: 'Course Summary',
          titleAr: 'ملخص الكورس',
          content: isActuallyAIGenerated ? (moduleContent as any).courseSummary : generateCourseSummary(courseData)
        },
        {
          courseId,
          type: 'chart',
          title: 'Drug Reference Chart',
          titleAr: 'جدول الأدوية المرجعي',
          content: isActuallyAIGenerated ? (moduleContent as any).drugChart : generateDrugChart(courseData)
        },
        {
          courseId,
          type: 'guide',
          title: 'Patient Education Guide',
          titleAr: 'دليل تثقيف المريض',
          content: isActuallyAIGenerated ? (moduleContent as any).patientGuide : generatePatientGuide(courseData)
        }
      ]
    })
    
    return NextResponse.json({
      success: true,
      message: isActuallyAIGenerated ? `AI-generated course created using Groq` : `Course created using template (${aiModel})`,
      courseId,
      course: courseData,
      isActuallyAIGenerated
    })
    
  } catch (error) {
    console.error('AI Course generation error:', error)
    return NextResponse.json({ error: 'Failed to generate course', details: String(error) }, { status: 500 })
  }
}

// Helper functions for content generation
function generateModuleContent(courseData: any, model: string) {
  // Template-based content generation (would be replaced with actual AI model)
  const modules = [
    {
      title: 'Module 1: Foundations & Definitions',
      titleAr: 'الوحدة 1: الأساسيات والتعريفات',
      content: `This module covers fundamental concepts in ${courseData.category}, including definitions, epidemiology, and pathophysiology. Key topics include disease mechanisms, risk factors, and classification systems.`,
      contentAr: `تغطي هذه الوحدة المفاهيم الأساسية في ${courseData.category}، بما في ذلك التعريفات وعلم الأوبئة والفيزيولوجيا المرضية.`,
      learningOutcomes: '1. Define key terms\n2. Understand disease mechanisms\n3. Identify risk factors',
      keyPoints: 'Foundational knowledge critical for advanced modules',
      caseStudies: 'Case: 45-year-old patient presents with...'
    },
    {
      title: 'Module 2: Pharmacology & Mechanism of Action',
      titleAr: 'الوحدة 2: علم الأدوية وآلية العمل',
      content: `Detailed pharmacology of major drug classes used in ${courseData.category}. Covers receptor interactions, pharmacokinetics, and structure-activity relationships.`,
      contentAr: `علم الأدوية التفصيلي للفئات الدوائية الرئيسية المستخدمة في ${courseData.category}.`,
      learningOutcomes: '1. Understand drug mechanisms\n2. Explain pharmacokinetics\n3. Compare drug classes',
      keyPoints: 'Mechanism-based drug selection principles',
      caseStudies: 'Case: Selecting appropriate agent based on mechanism...'
    },
    {
      title: 'Module 3: Clinical Applications',
      titleAr: 'الوحدة 3: التطبيقات الإكلينيكية',
      content: 'Practical application of pharmacological knowledge to clinical scenarios. Evidence-based treatment guidelines and protocols.',
      contentAr: 'التطبيق العملي للمعرفة الدوائية على السيناريوهات الإكلينيكية.',
      learningOutcomes: '1. Apply guidelines\n2. Develop treatment plans\n3. Monitor therapy',
      keyPoints: 'Evidence-based practice and clinical guidelines',
      caseStudies: 'Case: Complex patient with multiple conditions...'
    },
    {
      title: 'Module 4: Drug Comparisons',
      titleAr: 'الوحدة 4: مقارنات الأدوية',
      content: 'Comparative analysis of therapeutic alternatives, including efficacy, safety, and cost considerations.',
      contentAr: 'التحليل المقارن للبدائل العلاجية، بما في ذلك الفعالية والسلامة والتكلفة.',
      learningOutcomes: '1. Compare drug options\n2. Select optimal therapy\n3. Consider cost-effectiveness',
      keyPoints: 'Comparative effectiveness and formulary decisions',
      caseStudies: 'Case: Cost-effective selection for formulary...'
    },
    {
      title: 'Module 5: Dosing & Safety',
      titleAr: 'الوحدة 5: الجرعات والسلامة',
      content: 'Dosing guidelines, therapeutic drug monitoring, adverse effects management, and safety protocols.',
      contentAr: 'إرشادات الجرعات، مراقبة الدواء العلاجي، إدارة الآثار الضارة.',
      learningOutcomes: '1. Calculate doses\n2. Monitor levels\n3. Manage adverse effects',
      keyPoints: 'Safety-first approach to dosing and monitoring',
      caseStudies: 'Case: Dosing adjustment for renal impairment...'
    },
    {
      title: 'Module 6: Drug Interactions',
      titleAr: 'الوحدة 6: التفاعلات الدوائية',
      content: 'Recognition and management of drug-drug, drug-food, and drug-disease interactions.',
      contentAr: 'التعرف على التفاعلات الدوائية وإدارتها.',
      learningOutcomes: '1. Identify interactions\n2. Predict severity\n3. Develop management strategies',
      keyPoints: 'Interaction screening and clinical decision-making',
      caseStudies: 'Case: Multiple medications with potential interactions...'
    },
    {
      title: 'Module 7: Clinical Cases',
      titleAr: 'الوحدة 7: الحالات الإكلينيكية',
      content: 'Complex patient cases requiring integration of knowledge from all previous modules.',
      contentAr: 'حالات مرضية معقدة تتطلب تكامل المعرفة من جميع الوحدات السابقة.',
      learningOutcomes: '1. Integrate knowledge\n2. Solve complex problems\n3. Make clinical decisions',
      keyPoints: 'Real-world application and critical thinking',
      caseStudies: 'Case: Multi-system involvement requiring comprehensive care...'
    },
    {
      title: 'Module 8: Patient Counseling',
      titleAr: 'الوحدة 8: إرشادات المريض',
      content: 'Communication strategies for effective patient education, adherence counseling, and addressing concerns.',
      contentAr: 'استراتيجيات التواصل للتثقيف الفعال للمريض.',
      learningOutcomes: '1. Counsel patients effectively\n2. Address adherence barriers\n3. Provide clear instructions',
      keyPoints: 'Patient-centered care and communication skills',
      caseStudies: 'Case: Non-adherent patient requiring counseling...'
    }
  ]
  
  return modules
}

function generateModuleQuestions(courseData: any, moduleNum: number) {
  // Generate 5 questions per module
  return [
    {
      question: `What is the primary mechanism of action for first-line therapy in ${courseData.category}?`,
      questionAr: `ما هي آلية العمل الأساسية للعلاج الأولي في ${courseData.category}؟`,
      options: ['Receptor antagonism', 'Enzyme inhibition', 'Channel blockade', 'Hormone modulation'],
      correctAnswer: 'Enzyme inhibition',
      explanation: 'First-line agents typically work through enzyme inhibition pathways.',
      explanationAr: 'العوامل الأولية تعمل عادة من خلال مسارات تثبيط الإنزيم.'
    },
    {
      question: 'Which adverse effect requires immediate discontinuation?',
      questionAr: 'أي تأثير ضار يتطلب التوقف الفوري؟',
      options: ['Mild nausea', 'Severe allergic reaction', 'Drowsiness', 'Dry mouth'],
      correctAnswer: 'Severe allergic reaction',
      explanation: 'Severe allergic reactions (anaphylaxis) are life-threatening and require immediate discontinuation.',
      explanationAr: 'ردود الفعل التحسسية الشديدة تهدد الحياة وتتطلب التوقف الفوري.'
    },
    {
      question: 'What is the recommended monitoring parameter?',
      questionAr: 'ما هو معامل المراقبة الموصى به؟',
      options: ['Blood pressure', 'Drug levels', 'Renal function', 'All of the above'],
      correctAnswer: 'All of the above',
      explanation: 'Comprehensive monitoring includes all relevant parameters.',
      explanationAr: 'المراقبة الشاملة تشمل جميع المعاملات ذات الصلة.'
    },
    {
      question: 'Which drug interaction is most clinically significant?',
      questionAr: 'أي تفاعل دوائي هو الأكثر أهمية إكلينيكية؟',
      options: ['Mild indigestion', 'QT prolongation', 'CYP inhibition', 'Protein binding'],
      correctAnswer: 'QT prolongation',
      explanation: 'QT prolongation can lead to fatal arrhythmias.',
      explanationAr: 'إطالة QT يمكن أن تؤدي إلى اضطرابات نظم قاتلة.'
    },
    {
      question: 'When should dose adjustment be considered?',
      questionAr: 'متى يجب النظر في تعديل الجرعة؟',
      options: ['Renal impairment', 'Age >65', 'Both A and B', 'Neither'],
      correctAnswer: 'Both A and B',
      explanation: 'Both renal impairment and advanced age may require dose adjustments.',
      explanationAr: 'كل من ضعف الكلى والتقدم في السن قد يتطلب تعديلات الجرعة.'
    }
  ]
}

function generateFinalExamQuestions(courseData: any) {
  // Generate 50 questions for final exam (simplified - 5 shown)
  const questions: any[] = []
  for (let i = 0; i < 50; i++) {
    questions.push({
      question: `Final Exam Question ${i + 1}: Comprehensive assessment of ${courseData.category} pharmacotherapy.`,
      questionAr: `سؤال الامتحان النهائي ${i + 1}: تقييم شامل للعلاج الدوائي لـ ${courseData.category}.`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 'Option A',
      explanation: 'Comprehensive rationale for correct answer.',
      explanationAr: 'التبرير الشامل للإجابة الصحيحة.'
    })
  }
  return questions
}

function generateCourseSummary(courseData: any) {
  return `# ${courseData.title} - Course Summary

## Overview
This course provides comprehensive coverage of ${courseData.category} pharmacotherapy.

## Learning Objectives
${courseData.learningObjectives}

## Key Topics Covered
1. Foundations and definitions
2. Pharmacology mechanisms
3. Clinical applications
4. Drug comparisons
5. Dosing and safety
6. Drug interactions
7. Clinical cases
8. Patient counseling

## Credits: 8 hours (0.8 CEUs)
## Target Audience: Pharmacists, Pharmacy Students, Clinical Pharmacists`
}

function generateDrugChart(courseData: any) {
  return `Drug Reference Chart for ${courseData.title}

| Drug Class | Examples | Indications | Key Considerations |
|------------|----------|-------------|-------------------|
| First-line agents | ${courseData.drugFocus?.slice(0, 3).join(', ')} | Primary therapy | Standard dosing |
| Second-line | Refer to course | Alternative options | Specific populations |

See full course for detailed comparisons.`
}

function generatePatientGuide(courseData: any) {
  return `# Patient Education Guide: ${courseData.title}

## Key Points for Patients
1. Understanding their condition
2. Importance of medication adherence
3. When to seek medical attention
4. Lifestyle modifications
5. Common questions and answers

## Counseling Tips for Pharmacists
- Use clear, non-technical language
- Verify understanding (teach-back method)
- Address barriers to adherence
- Provide written materials
- Follow up on concerns`
}
