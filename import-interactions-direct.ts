import { db } from './src/lib/db'
import fs from 'fs'

async function importInteractions() {
  console.log('Starting interaction import to Neon...\n')

  const data = JSON.parse(fs.readFileSync('upload/comprehensive-drug-interactions.json', 'utf-8'))
  const primaryDrugs = Object.keys(data)
  console.log(`Found ${primaryDrugs.length} primary drugs with interactions\n`)

  let totalInserted = 0
  let batchSize = 50
  let offset = 0
  const maxOffset = primaryDrugs.length

  while (offset < maxOffset) {
    const batch = primaryDrugs.slice(offset, offset + batchSize)
    console.log(`Processing batch ${offset + 1} to ${Math.min(offset + batchSize, maxOffset)}...`)

    for (const primaryDrugName of batch) {
      const interactions = data[primaryDrugName]

      // Find matching drug in Neon
      const drugs = await db.drug.findMany({
        where: {
          OR: [
            { genericName: { contains: primaryDrugName, mode: 'insensitive' } },
            { packageName: { contains: primaryDrugName, mode: 'insensitive' } }
          ]
        },
        select: { id: true, genericName: true },
        take: 3
      })

      if (drugs.length === 0) continue

      // Process each interaction for this drug
      for (const [secondaryName, interactionData] of Object.entries(interactions as Record<string, any>)) {
        // Find secondary drug
        const secondaryDrugs = await db.drug.findMany({
          where: {
            OR: [
              { genericName: { contains: secondaryName, mode: 'insensitive' } },
              { packageName: { contains: secondaryName, mode: 'insensitive' } }
            ]
          },
          select: { id: true },
          take: 1
        })

        const secondaryId = secondaryDrugs.length > 0 ? secondaryDrugs[0].id : null

        // Insert interaction for each primary drug match
        for (const drug of drugs) {
          try {
            await db.drugInteraction.create({
              data: {
                drugId: drug.id,
                secondaryDrugId: secondaryId,
                secondaryDrugName: secondaryName,
                severity: interactionData.severity || 'moderate',
                description: interactionData.description || null,
                interactionType: interactionData.mechanism || 'Pharmacological',
                management: interactionData.recommendation || null,
              }
            })
            totalInserted++
          } catch (e) {
            // Skip duplicates
          }
        }
      }
    }

    offset += batchSize
    console.log(`  Inserted so far: ${totalInserted}\n`)
  }

  console.log(`\n=== IMPORT COMPLETE ===`)
  console.log(`Total interactions inserted: ${totalInserted}`)

  // Verify
  const count = await db.drugInteraction.count()
  console.log(`Verified count in database: ${count}`)
}

importInteractions().catch(console.error)
