import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * GET /api/data-source
 *
 * Public (unauthenticated) endpoint returning provenance + freshness
 * metadata for the clinical data shown in the app. Used by the
 * DataSourceBadge and the /data-source page.
 *
 * Freshness is capped client-side via the Cache-Control header below
 * (1h CDN cache, 24h stale-while-revalidate). We force dynamic so
 * Next.js doesn't try to pre-render against a possibly-unreachable
 * database at build time.
 */
export const dynamic = 'force-dynamic'

interface DataSourcePayload {
  moh: {
    name: string
    url: string
    lastSynced: string | null
    drugCount: number
    activeDrugCount: number
    pregnancyCategoryCount: number
  }
  interactions: {
    source: string
    count: number
    drugPairCount: number
  }
  sideEffects: {
    source: string
    count: number
    drugCoverage: number
  }
  icd10: {
    source: string
    mappingCount: number
    diseaseCount: number
  }
  generatedAt: string
}

export async function GET() {
  try {
    const [
      lastChange,
      drugCount,
      activeCount,
      pregnancyCount,
      interactionCount,
      uniquePairs,
      seCount,
      seDrugCoverage,
      icd10Count,
      diseaseCount,
    ] = await Promise.all([
      db.drug.findFirst({
        where: { lastChangeDate: { not: null } },
        orderBy: { lastChangeDate: 'desc' },
        select: { lastChangeDate: true },
      }),
      db.drug.count(),
      db.drug.count({ where: { status: 'Active' } }),
      db.drug.count({ where: { pregnancyCategory: { not: null } } }),
      db.drugInteraction.count(),
      db.drugInteraction
        .findMany({ select: { drugId: true }, distinct: ['drugId'] })
        .then((rows) => rows.length),
      db.drugSideEffect.count(),
      db.drugSideEffect
        .findMany({ select: { drugId: true }, distinct: ['drugId'] })
        .then((rows) => rows.length),
      db.iCD10Mapping.count(),
      db.disease.count(),
    ])

    const payload: DataSourcePayload = {
      moh: {
        name: 'UAE Ministry of Health & Prevention (MOHAP) Drug Registry',
        url: 'https://mohap.gov.ae/en/services/registration-drug-and-pharmacist',
        lastSynced: lastChange?.lastChangeDate?.toISOString() ?? null,
        drugCount,
        activeDrugCount: activeCount,
        pregnancyCategoryCount: pregnancyCount,
      },
      interactions: {
        source: 'Curated from DrugBank + public pharmacology literature',
        count: interactionCount,
        drugPairCount: uniquePairs,
      },
      sideEffects: {
        source: 'SIDER 4.1 (EMBL-EBI) + manufacturer labelling',
        count: seCount,
        drugCoverage: seDrugCoverage,
      },
      icd10: {
        source: 'WHO ICD-10-CM mapping, enriched with UAE DHA / DOH code set',
        mappingCount: icd10Count,
        diseaseCount,
      },
      generatedAt: new Date().toISOString(),
    }

    return NextResponse.json(payload, {
      headers: {
        // Allow edge/CDN caching for an hour; client revalidates freely.
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('[data-source] failed:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data source metadata' },
      { status: 500 }
    )
  }
}
