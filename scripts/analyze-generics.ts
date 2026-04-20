import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function analyzeGenericNames() {
  console.log('Analyzing all generic names in the database...\n')
  
  const drugs = await prisma.drug.findMany({
    select: { genericName: true }
  })
  
  const genericNames = new Map<string, number>()
  
  for (const drug of drugs) {
    if (drug.genericName) {
      // Split by comma for combination drugs
      const names = drug.genericName.split(',').map(n => n.trim())
      for (const name of names) {
        // Clean up the name
        const cleaned = name
          .replace(/\(.*?\)/g, '') // Remove parentheses
          .replace(/[^a-zA-Z\s-]/g, '') // Remove special chars
          .trim()
          .toLowerCase()
        
        if (cleaned.length > 2) {
          const key = cleaned.split(' ')[0] // Get first word (main drug name)
          genericNames.set(key, (genericNames.get(key) || 0) + 1)
        }
      }
    }
  }
  
  // Sort by frequency
  const sorted = Array.from(genericNames.entries()).sort((a, b) => b[1] - a[1])
  
  console.log(`Found ${genericNames.size} unique generic components\n`)
  console.log('Top 200 most common generics:')
  console.log('━'.repeat(60))
  
  for (let i = 0; i < Math.min(200, sorted.length); i++) {
    console.log(`${(i+1).toString().padStart(3)}. ${sorted[i][0].padEnd(25)} (${sorted[i][1]} drugs)`)
  }
  
  // Save to file for analysis
  const output = sorted.map(([name, count]) => `${name}: ${count}`).join('\n')
  require('fs').writeFileSync('generic-names-analysis.txt', output)
  console.log('\nFull list saved to: generic-names-analysis.txt')
}

analyzeGenericNames().catch(console.error).finally(() => prisma.$disconnect())
