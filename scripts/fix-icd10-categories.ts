import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function getCategory(code: string): string {
  if (!code || code.length < 1) return 'Other'
  
  const categoryMap: Record<string, string> = {
    'A': 'Infectious Disease',
    'B': 'Infectious Disease',
    'C': 'Oncology',
    'D': 'Hematology',
    'E': 'Endocrine',
    'F': 'Mental Health',
    'G': 'Neurology',
    'H': 'Ophthalmology',
    'I': 'Cardiovascular',
    'J': 'Respiratory',
    'K': 'Gastrointestinal',
    'L': 'Dermatology',
    'M': 'Musculoskeletal',
    'N': 'Genitourinary',
    'O': 'Obstetrics',
    'P': 'Perinatal',
    'Q': 'Congenital',
    'R': 'Symptoms',
    'S': 'Injury',
    'T': 'Injury',
    'U': 'Special Purpose',
    'V': 'External Causes',
    'W': 'External Causes',
    'X': 'External Causes',
    'Y': 'External Causes',
    'Z': 'Health Status'
  }
  
  const categoryChar = code.charAt(0).toUpperCase()
  return categoryMap[categoryChar] || 'Other'
}

async function main() {
  console.log('Starting ICD-10 categorization update...')
  
  const total = await prisma.iCD10Mapping.count({
    where: {
      OR: [
        { category: null },
        { category: '' },
        { category: 'Uncategorized' }
      ]
    }
  })
  
  console.log(`Found ${total} uncategorized mappings.`)
  
  if (total === 0) {
    console.log('No mappings to update.')
    return
  }

  // Update in batches to avoid memory/timeout issues
  const batchSize = 1000
  let processed = 0
  
  while (processed < total) {
    const mappings = await prisma.iCD10Mapping.findMany({
      where: {
        OR: [
          { category: null },
          { category: '' },
          { category: 'Uncategorized' }
        ]
      },
      take: batchSize,
      select: { id: true, icd10Code: true }
    })
    
    if (mappings.length === 0) break

    const updates = mappings.map(m => 
      prisma.iCD10Mapping.update({
        where: { id: m.id },
        data: { category: getCategory(m.icd10Code) }
      })
    )
    
    await prisma.$transaction(updates)
    processed += mappings.length
    console.log(`Updated ${processed}/${total} mappings...`)
  }
  
  console.log('ICD-10 categorization complete!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
