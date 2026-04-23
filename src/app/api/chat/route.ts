import { groq } from '@ai-sdk/groq';
import { streamText, tool, convertToModelMessages, stepCountIs, type UIMessage } from 'ai';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { getAuthSession } from '@/lib/auth';
import { classifyIntent, extractDrugEntities, validateClinicalQuery } from '@/lib/nlp';

export const maxDuration = 60;

const prisma = new PrismaClient();

// ==================== NLP TOOLS ====================

// Tool 1: Drug Database Lookup
const drugLookupTool = tool({
  description: 'Look up drug information from the UAE MOH database including dosage, interactions, side effects, pregnancy category, and warnings',
  inputSchema: z.object({
    drugName: z.string().describe('Name of the drug to look up (generic or brand name)')
  }),
  execute: async ({ drugName }) => {
    try {
      // Search drug database
      const drug = await prisma.drug.findFirst({
        where: {
          OR: [
            { genericName: { contains: drugName, mode: 'insensitive' } },
            { packageName: { contains: drugName, mode: 'insensitive' } },
            { drugCode: { contains: drugName, mode: 'insensitive' } }
          ]
        },
        include: {
          interactions: { take: 10, select: { secondaryDrugName: true, severity: true, description: true } },
          sideEffects: { take: 10, select: { sideEffect: true, severity: true, frequency: true } },
          icd10Codes: { take: 5, select: { icd10Code: true, description: true } }
        }
      });

      if (!drug) {
        return { found: false, drugName, message: `Drug "${drugName}" not found in UAE database` };
      }

      return {
        found: true,
        drug: {
          name: drug.packageName,
          generic: drug.genericName,
          strength: drug.strength,
          dosageForm: drug.dosageForm,
          status: drug.status,
          price: drug.packagePricePublic,
          manufacturer: drug.manufacturerName,
          pregnancyCategory: drug.pregnancyCategory,
          g6pdSafety: drug.g6pdSafety,
          offLabelUses: drug.offLabelUses,
          warnings: drug.warnings,
          breastfeedingSafety: drug.breastfeedingSafety,
          interactions: drug.interactions,
          sideEffects: drug.sideEffects,
          icd10Codes: drug.icd10Codes
        }
      };
    } catch (error: any) {
      return { found: false, drugName, error: error.message };
    }
  }
});

// Tool 2: Drug Interaction Checker
const interactionCheckerTool = tool({
  description: 'Check for interactions between two drugs',
  inputSchema: z.object({
    drug1: z.string().describe('First drug name'),
    drug2: z.string().describe('Second drug name')
  }),
  execute: async ({ drug1, drug2 }) => {
    try {
      // Find first drug
      const drug1Record = await prisma.drug.findFirst({
        where: {
          OR: [
            { genericName: { contains: drug1, mode: 'insensitive' } },
            { packageName: { contains: drug1, mode: 'insensitive' } }
          ]
        },
        include: {
          interactions: {
            where: {
              OR: [
                { secondaryDrugName: { contains: drug2, mode: 'insensitive' } }
              ]
            }
          }
        }
      });

      if (drug1Record && drug1Record.interactions.length > 0) {
        return {
          hasInteraction: true,
          drug1,
          drug2,
          interactions: drug1Record.interactions
        };
      }

      // Check reverse
      const drug2Record = await prisma.drug.findFirst({
        where: {
          OR: [
            { genericName: { contains: drug2, mode: 'insensitive' } },
            { packageName: { contains: drug2, mode: 'insensitive' } }
          ]
        },
        include: {
          interactions: {
            where: {
              OR: [
                { secondaryDrugName: { contains: drug1, mode: 'insensitive' } }
              ]
            }
          }
        }
      });

      if (drug2Record && drug2Record.interactions.length > 0) {
        return {
          hasInteraction: true,
          drug1,
          drug2,
          interactions: drug2Record.interactions
        };
      }

      return {
        hasInteraction: false,
        drug1,
        drug2,
        message: `No known interactions found between ${drug1} and ${drug2} in database`
      };
    } catch (error: any) {
      return { hasInteraction: false, drug1, drug2, error: error.message };
    }
  }
});

// Tool 3: Side Effects Lookup
const sideEffectsTool = tool({
  description: 'Get side effects for a specific drug',
  inputSchema: z.object({
    drugName: z.string().describe('Drug name to get side effects for')
  }),
  execute: async ({ drugName }) => {
    try {
      const drug = await prisma.drug.findFirst({
        where: {
          OR: [
            { genericName: { contains: drugName, mode: 'insensitive' } },
            { packageName: { contains: drugName, mode: 'insensitive' } }
          ]
        },
        include: {
          sideEffects: {
            select: { sideEffect: true, severity: true, frequency: true, mechanism: true }
          }
        }
      });

      if (!drug) {
        return { found: false, drugName, message: `Drug "${drugName}" not found` };
      }

      return {
        found: true,
        drugName: drug.packageName,
        genericName: drug.genericName,
        sideEffects: drug.sideEffects,
        totalSideEffects: drug.sideEffects.length
      };
    } catch (error: any) {
      return { found: false, drugName, error: error.message };
    }
  }
});

// Tool 4: Pregnancy Safety Check
const pregnancyCheckTool = tool({
  description: 'Check pregnancy safety category and warnings for a drug',
  inputSchema: z.object({
    drugName: z.string().describe('Drug name to check pregnancy safety for')
  }),
  execute: async ({ drugName }) => {
    try {
      const drug = await prisma.drug.findFirst({
        where: {
          OR: [
            { genericName: { contains: drugName, mode: 'insensitive' } },
            { packageName: { contains: drugName, mode: 'insensitive' } }
          ]
        },
        select: {
          packageName: true,
          genericName: true,
          pregnancyCategory: true,
          breastfeedingSafety: true,
          warnings: true
        }
      });

      if (!drug) {
        return { found: false, drugName, message: `Drug "${drugName}" not found` };
      }

      return {
        found: true,
        drugName: drug.packageName,
        genericName: drug.genericName,
        pregnancyCategory: drug.pregnancyCategory || 'Not available',
        breastfeedingSafety: drug.breastfeedingSafety || 'Not available',
        warnings: drug.warnings || 'No specific warnings'
      };
    } catch (error: any) {
      return { found: false, drugName, error: error.message };
    }
  }
});

// Tool 5: Disease Information Lookup
const diseaseLookupTool = tool({
  description: 'Look up disease information including symptoms, diagnostic criteria, investigations, complications, and treatment guidelines',
  inputSchema: z.object({
    diseaseName: z.string().describe('Disease name or ICD-10 code to look up')
  }),
  execute: async ({ diseaseName }) => {
    try {
      const disease = await prisma.disease.findFirst({
        where: {
          OR: [
            { name: { contains: diseaseName, mode: 'insensitive' } },
            { icd10Code: { contains: diseaseName, mode: 'insensitive' } }
          ]
        },
        include: {
          treatments: {
            include: {
              drug: {
                select: {
                  packageName: true,
                  genericName: true,
                  strength: true,
                  dosageForm: true,
                  pregnancyCategory: true,
                  g6pdSafety: true
                }
              }
            }
          }
        }
      });

      if (!disease) {
        return { found: false, diseaseName, message: `Disease "${diseaseName}" not found` };
      }

      return {
        found: true,
        disease: {
          name: disease.name,
          icd10Code: disease.icd10Code,
          category: disease.category,
          description: disease.description,
          symptoms: JSON.parse(disease.symptoms || '[]'),
          riskFactors: JSON.parse(disease.riskFactors || '[]'),
          diagnosticCriteria: disease.diagnosticCriteria,
          investigations: JSON.parse(disease.investigations || '[]'),
          complications: JSON.parse(disease.complications || '[]'),
          treatmentGuidelines: JSON.parse(disease.treatmentGuidelines || '{}'),
          treatments: disease.treatments.map(t => ({
            drug: t.drug,
            lineOfTherapy: t.lineOfTherapy,
            indication: t.indication,
            dose: t.dose,
            notes: t.notes
          }))
        }
      };
    } catch (error: any) {
      return { found: false, diseaseName, error: error.message };
    }
  }
});

// Tool 6: Treatment Recommendations for Disease
const treatmentRecommendationTool = tool({
  description: 'Get treatment recommendations for a specific disease with drug details',
  inputSchema: z.object({
    diseaseName: z.string().describe('Disease name to get treatment recommendations for'),
    lineOfTherapy: z.string().optional().describe('Filter by line of therapy: first_line, second_line, alternative, adjunct')
  }),
  execute: async ({ diseaseName, lineOfTherapy }) => {
    try {
      const disease = await prisma.disease.findFirst({
        where: {
          OR: [
            { name: { contains: diseaseName, mode: 'insensitive' } },
            { icd10Code: { contains: diseaseName, mode: 'insensitive' } }
          ]
        },
        include: {
          treatments: {
            where: lineOfTherapy ? { lineOfTherapy } : undefined,
            include: {
              drug: {
                select: {
                  packageName: true,
                  genericName: true,
                  strength: true,
                  dosageForm: true,
                  pregnancyCategory: true,
                  g6pdSafety: true,
                  warnings: true,
                  sideEffects: { take: 5, select: { sideEffect: true, severity: true } },
                  interactions: { take: 5, select: { secondaryDrugName: true, severity: true } }
                }
              }
            }
          }
        }
      });

      if (!disease) {
        return { found: false, diseaseName, message: `Disease "${diseaseName}" not found` };
      }

      return {
        found: true,
        disease: {
          name: disease.name,
          icd10Code: disease.icd10Code,
          treatmentGuidelines: JSON.parse(disease.treatmentGuidelines || '{}')
        },
        treatments: disease.treatments.map(t => ({
          drug: t.drug,
          lineOfTherapy: t.lineOfTherapy,
          indication: t.indication,
          dose: t.dose,
          duration: t.duration,
          notes: t.notes,
          evidenceLevel: t.evidenceLevel,
          recommendation: t.recommendation
        })),
        totalTreatments: disease.treatments.length
      };
    } catch (error: any) {
      return { found: false, diseaseName, error: error.message };
    }
  }
});

// ==================== NLP INTENT CLASSIFICATION SYSTEM PROMPT ====================

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
- Always use the tools to look up actual drug/disease information when mentioned
- Prioritize patient safety in all recommendations
- Keep responses concise, professional, and clinically relevant
- Use bullet points and structured formatting for clarity
- When discussing diseases, include: symptoms, diagnostic criteria, investigations, treatment guidelines
- When discussing treatments, include: first-line, second-line, alternatives, dosing, monitoring
- Always mention pregnancy category, G6PD safety, and major interactions when discussing drugs
- For disease queries, ALWAYS use the disease lookup tool
- For treatment queries, ALWAYS use the treatment recommendation tool
- For interaction queries, ALWAYS use the interaction checker tool

IMPORTANT SAFETY RULES:
- Flag high-risk drug combinations (warfarin + NSAIDs, MAOIs + SSRIs, etc.)
- Alert about pregnancy contraindications (Category X drugs)
- Warn about G6PD contraindications (HIGH RISK drugs)
- Mention renal/hepatic dose adjustments when relevant
- Note common serious side effects (hepatotoxicity, QT prolongation, Stevens-Johnson, etc.)
- Emphasize evidence-based treatment guidelines

You have access to a comprehensive medical database with drugs, diseases, and treatment guidelines.`;

// ==================== API ROUTE ====================

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    const { messages, patientContext }: { messages: UIMessage[]; patientContext?: { id: string } } = await req.json();

    // Get the latest user message for NLP analysis. v6 UIMessages carry `parts` (not `content`),
    // so flatten text parts into a single string.
    const lastUserMessage = messages.filter((m) => m.role === 'user').pop()
    const lastUserText = lastUserMessage
      ? lastUserMessage.parts
          .filter((p): p is { type: 'text'; text: string } => p.type === 'text' && typeof (p as { text?: unknown }).text === 'string')
          .map((p) => p.text)
          .join(' ')
      : ''
    let nlpAnalysis: { intent: ReturnType<typeof classifyIntent>; drugs: ReturnType<typeof extractDrugEntities>; validation: ReturnType<typeof validateClinicalQuery> } | null = null

    if (lastUserText) {
      // Perform NLP analysis on user query
      const intent = classifyIntent(lastUserText)
      const drugs = extractDrugEntities(lastUserText)
      const validation = validateClinicalQuery(lastUserText)

      nlpAnalysis = { intent, drugs, validation }

      console.log('[NLP] Intent:', intent.intent, '| Confidence:', intent.confidence, '| Drugs:', drugs.map(d => d.name))

      // Log validation warnings
      if (validation.warnings.length > 0) {
        console.log('[NLP] Warnings:', validation.warnings)
      }
    }

    // Build enhanced system prompt with patient context and NLP analysis
    let systemPrompt = NLP_SYSTEM_PROMPT;

    if (patientContext) {
      systemPrompt += `\n\nACTIVE PATIENT CONTEXT:
Patient ID: ${patientContext.id}
Please tailor all recommendations to this patient's profile. Consider age, gender, comorbidities, allergies, and current medications when providing clinical guidance.`;
    }

    // Add NLP context if available
    if (nlpAnalysis) {
      systemPrompt += `\n\nNLP ANALYSIS OF USER QUERY:
Detected Intent: ${nlpAnalysis.intent.intent} (confidence: ${nlpAnalysis.intent.confidence})
Detected Drugs: ${nlpAnalysis.drugs.map(d => d.name).join(', ') || 'None detected'}
Detected Conditions: ${nlpAnalysis.intent.conditions.join(', ') || 'None detected'}
Please use this context to provide a more targeted response.`;
    }

    // Stream response with tools enabled
    const result = streamText({
      model: groq(process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
      tools: {
        drugLookup: drugLookupTool,
        checkInteraction: interactionCheckerTool,
        getSideEffects: sideEffectsTool,
        checkPregnancy: pregnancyCheckTool,
        lookupDisease: diseaseLookupTool,
        getTreatmentRecommendations: treatmentRecommendationTool
      },
      // Allow multi-step tool usage: model -> tool call -> tool result -> model text
      stopWhen: stepCountIs(5),
      temperature: 0.2,
    });

    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error("[CHAT_ERROR]", error);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
