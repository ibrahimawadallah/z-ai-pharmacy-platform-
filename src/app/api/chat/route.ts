import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { checkRateLimit, getClientIP, getRateLimitHeaders } from '@/lib/rate-limit';
import { classifyIntent, extractDrugEntities, validateClinicalQuery } from '@/lib/nlp';

export const maxDuration = 60;

const NLP_SYSTEM_PROMPT = `You are the DrugEye Clinical Assistant, an expert AI pharmacist with advanced NLP capabilities for the UAE healthcare system.

YOUR CORE CAPABILITIES:
1. **Intent Recognition**: Understand what the clinician is asking for (lookup, interaction check, side effects, dosing, diagnosis, treatment, etc.)
2. **Entity Extraction**: Identify drug names, disease names, dosages, patient conditions, and clinical parameters from natural language
3. **Clinical Reasoning**: Provide evidence-based recommendations with safety prioritization
4. **Database Integration**: Use available tools to look up real drug and disease information from comprehensive medical database
5. **Structured Responses**: Organize information clearly with disease/drug names, categories, severity levels, treatment lines

YOUR MEDICAL DATASET INCLUDES:
- 21,885 UAE drugs with complete information
- 24 major diseases across all specialties (Cardiology, Endocrinology, Respiratory, Neurology, etc.)
- 45+ disease-treatment mappings with first-line, second-line, and alternative therapies
- Complete ICD-10 coding system
- Drug interactions, side effects, pregnancy safety data
- G6PD safety information

RESPONSE GUIDELINES:
- Prioritize patient safety in all recommendations
- Keep responses concise, professional, and clinically relevant
- Use bullet points and structured formatting for clarity
- When discussing diseases, include: symptoms, diagnostic criteria, investigations, treatment guidelines
- When discussing treatments, include: first-line, second-line, alternatives, dosing, monitoring
- Always mention pregnancy category, G6PD safety, and major interactions when discussing drugs
- Flag high-risk drug combinations (warfarin + NSAIDs, MAOIs + SSRIs, etc.)
- Alert about pregnancy contraindications (Category X drugs)
- Warn about G6PD contraindications (HIGH RISK drugs)
- Emphasize evidence-based treatment guidelines

You have access to a comprehensive medical database with drugs, diseases, and treatment guidelines.`;

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    const userId = session?.user?.id;
    
    // Apply rate limiting (10 requests/minute for chat)
    const clientIP = getClientIP(req);
    const rateLimitResult = await checkRateLimit(userId || clientIP, '/api/chat');
    
    if (!rateLimitResult.success) {
      return new Response(
        JSON.stringify({
          error: 'Too Many Requests',
          message: `Rate limit exceeded. Try again in ${rateLimitResult.retryAfter} seconds.`,
          retryAfter: rateLimitResult.retryAfter
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            ...getRateLimitHeaders(rateLimitResult)
          }
        }
      );
    }
    
    const { messages, patientContext } = await req.json();

    // Get the latest user message for NLP analysis
    const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop()
    let nlpAnalysis: { intent: any; drugs: any; validation: any } | null = null

    if (lastUserMessage) {
      const intent = classifyIntent(lastUserMessage.content)
      const drugs = extractDrugEntities(lastUserMessage.content)
      const validation = validateClinicalQuery(lastUserMessage.content)

      nlpAnalysis = { intent, drugs, validation }

      console.log('[NLP] Intent:', intent.intent, '| Confidence:', intent.confidence, '| Drugs:', drugs.map((d: any) => d.name))
    }

    let systemPrompt = NLP_SYSTEM_PROMPT;

    if (patientContext) {
      systemPrompt += `\n\nACTIVE PATIENT CONTEXT:
Patient ID: ${patientContext.id}
Please tailor all recommendations to this patient's profile. Consider age, gender, comorbidities, allergies, and current medications when providing clinical guidance.`;
    }

    if (nlpAnalysis) {
      systemPrompt += `\n\nNLP ANALYSIS OF USER QUERY:
Detected Intent: ${nlpAnalysis.intent.intent} (confidence: ${nlpAnalysis.intent.confidence})
Detected Drugs: ${nlpAnalysis.drugs.map((d: any) => d.name).join(', ') || 'None detected'}
Detected Conditions: ${nlpAnalysis.intent.conditions.join(', ') || 'None detected'}
Please use this context to provide a more targeted response.`;
    }

    // Stream response without tools for now
    const result = await streamText({
      model: groq(process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'),
      system: systemPrompt,
      messages,
      temperature: 0.2
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error("[CHAT_ERROR]", error);
    
    try {
      const session = await requireAuth().catch(() => null)
      if (session?.user?.id) {
        await db.auditLog.create({
          data: {
            userId: session.user.id,
            action: "AI_CHAT_ERROR",
            resource: "chat",
            details: error.message,
          }
        })
      }
    } catch (auditError) {
      console.error('AuditLog write failed:', auditError)
    }
    
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}