require('dotenv').config({ override: true })
const { PrismaClient } = require('@prisma/client')

async function checkData() {
  const p = new PrismaClient()
  
  try {
    const [drugs, interactions, sideEffects, icd10Mappings] = await Promise.all([
      p.drug.count(),
      p.drugInteraction.count(),
      p.drugSideEffect.count(),
      p.iCD10Mapping.count()
    ])
    
    const withPregnancy = await p.drug.count({
      where: { pregnancyCategory: { not: null } }
    })
    
    const withG6PD = await p.drug.count({
      where: { g6pdSafety: { not: null } }
    })
    
    console.log('=== CURRENT DATABASE STATUS ===')
    console.log('Drugs:', drugs)
    console.log('Drug Interactions:', interactions)
    console.log('Side Effects:', sideEffects)
    console.log('ICD-10 Mappings:', icd10Mappings)
    console.log('Drugs with Pregnancy Data:', withPregnancy)
    console.log('Drugs with G6PD Data:', withG6PD)
    
  } finally {
    await p.$disconnect()
  }
}

checkData().catch(console.error)