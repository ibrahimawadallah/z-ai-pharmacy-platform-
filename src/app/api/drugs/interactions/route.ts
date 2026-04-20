import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

function normalizeDrugName(value: string | null | undefined): string | null {
  if (!value) return null
  const normalized = value
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[_/,;:+-]/g, ' ')
    .replace(/[^\p{L}\p{N}\s.]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return normalized.length ? normalized : null
}

// GET /api/drugs/interactions?drugIds=<id1,id2,...> or ?drugs=<id1,id2,...>
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const drugsParam = searchParams.get('drugIds') || searchParams.get('drugs') || ''
  const ids = drugsParam
    .split(',')
    .map(v => v.trim())
    .filter(Boolean)
    .slice(0, 10)

  if (ids.length < 2) {
    return NextResponse.json({ success: true, interactions: [] })
  }

  try {
    // Get drugs using prisma
    const drugs = await db.drug.findMany({
      where: { id: { in: ids } },
      select: { id: true, packageName: true, genericName: true }
    })

    const idToNames = new Map<string, { display: string; keys: string[] }>()
    for (const drug of drugs) {
      const keys = [
        normalizeDrugName(drug.packageName),
        normalizeDrugName(drug.genericName)
      ].filter((v): v is string => Boolean(v))
      idToNames.set(drug.id, { display: drug.packageName, keys })
    }

    // Get interactions using prisma
    const interactions = await db.drugInteraction.findMany({
      where: { drugId: { in: ids } }
    })

    const results: { drug1: string; drug2: string; severity: string; description: string }[] = []
    const seen = new Set<string>()

    for (const interaction of interactions) {
      if (!interaction.drugId) continue
      if (!ids.includes(interaction.drugId)) continue

      let secondaryId: string | null = null
      if (interaction.secondaryDrugId && ids.includes(interaction.secondaryDrugId)) {
        secondaryId = interaction.secondaryDrugId
      } else if (interaction.secondaryDrugName) {
        const key = normalizeDrugName(interaction.secondaryDrugName)
        if (key) {
          for (const [id, meta] of idToNames.entries()) {
            if (meta.keys.includes(key)) {
              secondaryId = id
              break
            }
          }
        }
      }

      if (!secondaryId) continue
      if (secondaryId === interaction.drugId) continue

      const drug1 = idToNames.get(interaction.drugId)?.display || interaction.drugId
      const drug2 = idToNames.get(secondaryId)?.display || interaction.secondaryDrugName || secondaryId
      const severity = (interaction.severity || 'moderate').toLowerCase()
      const description =
        interaction.description ||
        interaction.management ||
        interaction.interactionType ||
        'Interaction detected'

      const pairKey = [interaction.drugId, secondaryId].sort().join('|')
      const dedupeKey = `${pairKey}|${severity}|${description}`
      if (seen.has(dedupeKey)) continue
      seen.add(dedupeKey)

      results.push({ drug1, drug2, severity, description })
    }

    return NextResponse.json({
      success: true,
      source: 'Internal Drug Interaction Database',
      interactions: results
    })
  } catch (error) {
    console.error('Interaction lookup error:', error)
    return NextResponse.json({ success: false, error: 'Failed to check interactions' }, { status: 500 })
  }
}
