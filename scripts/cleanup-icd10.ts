import { db } from '@/lib/db'

const VALID_ICD10_PREFIXES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z']

const VALID_CODES = new Set([
  'J01','J02.9','J18.9','J20.9','J44.9','J45.9','N39.0','N30.00','L03.90','L30.9','L20.9','L50.9',
  'E78.5','E11.9','E03.9','I10','I25.10','I50.9','I74.9','I80.1',
  'K29.7','K25.9','K30','M54.5','M79.1','M25.5',
  'F32.9','F33.9','F41.1','F20.9','F31.9',
  'R50.9','R05','R51','R10.9','R11.2',
  'J30.1','B35.9','B37.9'
])

async function cleanInvalidMappings() {
  console.log('Cleaning invalid ICD-10 mappings...\n')
  
  try {
    const invalid = await db.iCD10Mapping.findMany({
      where: {
        OR: [
          { icd10Code: { contains: '.' } },
          { icd10Code: { startsWith: 'D' } },
          { icd10Code: { startsWith: 'Z5' } },
          { icd10Code: { in: ['R51.9','R52','R05.9','R05.1','Z00','Z51.89','D50','D50.9','D50.0'] }}
        ]
      },
      select: { id: true }
    })
    
    console.log(`Found ${invalid.length} invalid codes to delete`)
    
    if (invalid.length > 0) {
      const ids = invalid.map(i => i.id)
      for (let i = 0; i < ids.length; i += 1000) {
        await db.iCD10Mapping.deleteMany({
          where: { id: { in: ids.slice(i, i + 1000) }}
        })
        process.stdout.write(`.`)
      }
      
      console.log('\nDeleted duplicate codes')
    }
    
    const withICD10 = await db.drug.count({ where: { icd10Codes: { some: {} } } })
    const total = await db.drug.count()
    const mappings = await db.iCD10Mapping.count()
    
    console.log(`\n📊 After cleanup:`)
    console.log(`   Drugs with ICD-10: ${withICD10}/${total}`)
    console.log(`   Coverage: ${((withICD10/total)*100).toFixed(1)}%`)
    console.log(`   Total mappings: ${mappings}`)
    
  } finally {
    await db.$disconnect()
  }
}

cleanInvalidMappings()