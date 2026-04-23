import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { parse } from 'dotenv'

const __dirname = dirname(fileURLToPath(import.meta.url))

const envConfig = parse(readFileSync(resolve(__dirname, '.env')))
for (const [k, v] of Object.entries(envConfig)) {
  process.env[k] = v
}

console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50) + '...')

import { PrismaClient } from '@prisma/client'

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