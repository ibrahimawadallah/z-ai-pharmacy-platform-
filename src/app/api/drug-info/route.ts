import { NextRequest, NextResponse } from 'next/server'

// OpenFDA API endpoint
const OPENFDA_BASE_URL = 'https://api.fda.gov/drug'

interface FDADrugResult {
  openfda: {
    brand_name?: string[]
    generic_name?: string[]
    substance_name?: string[]
    manufacturer_name?: string[]
    product_type?: string[]
    route?: string[]
    pharm_class_epc?: string[]
    pharm_class_cs?: string[]
    pharm_class_moa?: string[]
  }
  purpose?: string[]
  indications_and_usage?: string[]
  contraindications?: string[]
  warnings?: string[]
  adverse_reactions?: string[]
  dosage_and_administration?: string[]
  mechanism_of_action?: string[]
  pharmacokinetics?: string[]
}

interface FDAResponse {
  results: FDADrugResult[]
  error?: {
    code: string
    message: string
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const drugName = searchParams.get('drug')
  const type = searchParams.get('type') || 'label' // label, ndc, enforcement

  if (!drugName) {
    return NextResponse.json(
      { error: 'Drug name is required' },
      { status: 400 }
    )
  }

  try {
    // Query OpenFDA API
    const endpoint = type === 'label' ? 'label' : 'ndc'
    const url = `${OPENFDA_BASE_URL}/${endpoint}.json?search=openfda.generic_name:"${encodeURIComponent(drugName)}"+openfda.brand_name:"${encodeURIComponent(drugName)}"&limit=5`

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      // If FDA API fails, return placeholder data with guidance
      return NextResponse.json({
        success: false,
        error: 'Drug not found in FDA database',
        suggestion: 'Please verify drug name or check FDA.gov directly',
        fallbackLinks: {
          fda: `https://www.accessdata.fda.gov/scripts/cder/daf/index.cfm?event=overview.process&ApplNo=&drugname=${encodeURIComponent(drugName)}`,
          nih: `https://druginfo.nlm.nih.gov/drugportal/name/${encodeURIComponent(drugName)}`,
          who: 'https://www.who.int/groups/expert-committee-on-selection-and-use-of-essential-medicines/essential-medicines-list'
        }
      })
    }

    const data: FDAResponse = await response.json()

    if (!data.results || data.results.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No results found',
        fallbackLinks: {
          fda: `https://www.accessdata.fda.gov/scripts/cder/daf/index.cfm?event=overview.process&ApplNo=&drugname=${encodeURIComponent(drugName)}`,
          nih: `https://druginfo.nlm.nih.gov/drugportal/name/${encodeURIComponent(drugName)}`
        }
      })
    }

    // Process and format the results
    const processedResults = data.results.map((result) => ({
      brandNames: result.openfda.brand_name || [],
      genericNames: result.openfda.generic_name || [],
      substanceName: result.openfda.substance_name?.[0] || '',
      manufacturer: result.openfda.manufacturer_name?.[0] || 'Unknown',
      productType: result.openfda.product_type?.[0] || 'Unknown',
      routes: result.openfda.route || [],
      pharmacologicClass: result.openfda.pharm_class_epc || [],
      mechanisms: result.openfda.pharm_class_moa || [],
      purpose: result.purpose || [],
      indications: result.indications_and_usage?.[0]?.substring(0, 500) || '',
      contraindications: result.contraindications?.[0]?.substring(0, 500) || '',
      warnings: result.warnings?.[0]?.substring(0, 500) || '',
      adverseReactions: result.adverse_reactions?.[0]?.substring(0, 500) || '',
      dosage: result.dosage_and_administration?.[0]?.substring(0, 500) || '',
      mechanismOfAction: result.mechanism_of_action?.[0]?.substring(0, 500) || '',
      pharmacokinetics: result.pharmacokinetics?.[0]?.substring(0, 500) || ''
    }))

    return NextResponse.json({
      success: true,
      source: 'OpenFDA',
      lastUpdated: new Date().toISOString(),
      disclaimer: 'This information is provided by the FDA and is for educational purposes only. Always consult official sources for clinical decisions.',
      officialLinks: {
        fda: `https://www.accessdata.fda.gov/scripts/cder/daf/index.cfm?event=overview.process&drugname=${encodeURIComponent(drugName)}`,
        nih: `https://druginfo.nlm.nih.gov/drugportal/name/${encodeURIComponent(drugName)}`
      },
      results: processedResults
    })

  } catch (error) {
    console.error('Drug API Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch drug information',
        fallbackLinks: {
          fda: 'https://www.accessdata.fda.gov/scripts/cder/daf/',
          nih: 'https://druginfo.nlm.nih.gov/'
        }
      },
      { status: 500 }
    )
  }
}

// Drug interaction checker endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { drugs } = body

    if (!drugs || !Array.isArray(drugs) || drugs.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 drugs are required for interaction check' },
        { status: 400 }
      )
    }

    // Note: Real interaction checking would require integration with 
    // professional databases like Lexicomp or Micromedex
    // This is a placeholder that returns guidance

    return NextResponse.json({
      success: true,
      disclaimer: 'Drug interaction checking requires professional databases. This is an educational tool.',
      drugsChecked: drugs,
      recommendation: 'Always verify drug interactions using professional resources:',
      professionalResources: [
        { name: 'Lexicomp', url: 'https://www.wolterskluwer.com/en/solutions/lexicomp' },
        { name: 'Micromedex', url: 'https://www.ibm.com/products/micromedex' },
        { name: 'Drugs.com Interaction Checker', url: 'https://www.drugs.com/drug_interactions.html' },
        { name: 'Medscape Interaction Checker', url: 'https://reference.medscape.com/drug-interactionchecker' }
      ],
      generalPrinciples: [
        'Check for CYP450 enzyme interactions',
        'Consider QT prolongation risk',
        'Evaluate bleeding risk with anticoagulants',
        'Monitor for serotonin syndrome with serotonergic drugs',
        'Review renal/hepatic dosing adjustments'
      ]
    })

  } catch (error) {
    console.error('Interaction check error:', error)
    return NextResponse.json(
      { error: 'Failed to check interactions' },
      { status: 500 }
    )
  }
}
