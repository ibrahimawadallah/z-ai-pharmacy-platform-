import { NextRequest, NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { getAuthSession } from '@/lib/auth';

export const maxDuration = 30; // Extend duration for image processing

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();
    // Optional: enforce authentication
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Format the base64 string properly for the OpenAI API if needed
    // Usually frontend sends it as 'data:image/jpeg;base64,...'
    const base64Data = imageBase64.split(',')[1] || imageBase64;

    const result = await generateObject({
      model: openai('gpt-4o'),
      schema: z.object({
        drugs: z.array(z.object({
          name: z.string().describe("The commercial or generic name of the drug"),
          dosage: z.string().describe("The dosage strength (e.g. 500mg)"),
          frequency: z.string().describe("How often to take it (e.g. BID, Twice daily)"),
          route: z.string().describe("Route of administration (e.g. Oral, IV)"),
          duration: z.string().describe("How long to take it (e.g. 5 days)"),
          notes: z.string().optional().describe("Any special instructions or notes")
        })),
        patientName: z.string().optional().describe("Extracted patient name if visible"),
        date: z.string().optional().describe("Extracted prescription date if visible"),
        confidence: z.number().describe("Confidence score of the extraction from 1-100")
      }),
      messages: [
        {
          role: 'user',
          content: [
            { 
              type: 'text', 
              text: 'Analyze this prescription image. Extract all medications, their dosages, frequencies, and routes. Return the data strictly adhering to the schema. If handwriting is illegible, make your best clinical guess based on standard UAE prescribing patterns, but lower the confidence score.' 
            },
            { 
              type: 'image', 
              image: Buffer.from(base64Data, 'base64') 
            }
          ]
        }
      ]
    });

    return NextResponse.json(result.object);

  } catch (error) {
    console.error("[OCR_ERROR]", error);
    return NextResponse.json({ error: 'Failed to process prescription image' }, { status: 500 });
  }
}
