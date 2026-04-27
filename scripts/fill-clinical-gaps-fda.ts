import { db } from '../src/lib/db'
import { searchDailyMed, getDrugInfo, extractPregnancyCategory, parseAdverseReactions } from '../src/lib/api/fda-dailymed'

async function fillClinicalGapsWithFDA() {
  try {
    console.log('🔄 Filling Clinical Data Gaps with FDA DailyMed...\n')

    // Get drugs missing pregnancy data
    const drugsMissingPregnancy = await db.drug.findMany({
      where: {
        pregnancyCategory: null
      },
      select: {
        id: true,
        genericName: true,
        packageName: true
      },
      take: 100 // Process in batches
    })

    console.log(`Found ${drugsMissingPregnancy.length} drugs missing pregnancy data`)

    let updated = 0
    let failed = 0

    for (const drug of drugsMissingPregnancy) {
      try {
        if (!drug.genericName) {
          console.log(`  ⏭️  Skipping ${drug.packageName} (no generic name)`)
          failed++
          continue
        }

        console.log(`Processing: ${drug.genericName}`)
        
        // Search for drug in DailyMed
        const setIds = await searchDailyMed(drug.genericName)
        
        if (setIds.length === 0) {
          console.log(`  ❌ No DailyMed data found for ${drug.genericName}`)
          failed++
          continue
        }

        // Get drug info from first result
        const drugInfo = await getDrugInfo(setIds[0])
        
        if (!drugInfo) {
          console.log(`  ❌ Failed to get drug info for ${drug.genericName}`)
          failed++
          continue
        }

        // Extract pregnancy category
        const pregnancyCategory = extractPregnancyCategory(drugInfo.pregnancy || '')
        
        // Extract warnings
        const warnings = drugInfo.boxed_warning || drugInfo.warnings_and_precautions || drugInfo.contraindications || null

        // Update drug with FDA data
        await db.drug.update({
          where: { id: drug.id },
          data: {
            pregnancyCategory: pregnancyCategory,
            pregnancyPrecautions: drugInfo.pregnancy || null,
            warnings: warnings ? warnings.substring(0, 2000) : null, // Limit to 2000 chars
            source: 'FDA_DailyMed',
            lastVerified: new Date()
          }
        })

        // Add side effects if available
        if (drugInfo.adverse_reactions) {
          const sideEffects = parseAdverseReactions(drugInfo.adverse_reactions)
          
          for (const sideEffect of sideEffects) {
            try {
              await db.drugSideEffect.create({
                data: {
                  drugId: drug.id,
                  sideEffect: sideEffect,
                  frequency: 'Unknown',
                  severity: 'Unknown',
                  source: 'FDA_DailyMed'
                }
              })
            } catch (error) {
              // Skip duplicate side effects
              continue
            }
          }
        }

        console.log(`  ✅ Updated ${drug.packageName} with FDA data`)
        updated++
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))
        
      } catch (error) {
        console.error(`  ❌ Error processing ${drug.genericName}:`, error)
        failed++
      }

      if (updated % 10 === 0) {
        console.log(`\nProgress: ${updated} updated, ${failed} failed\n`)
      }
    }

    console.log(`\n✅ FDA Data Import Complete`)
    console.log(`Updated: ${updated} drugs`)
    console.log(`Failed: ${failed} drugs`)
    
  } catch (error) {
    console.error('Error filling clinical gaps:', error)
  } finally {
    await db.$disconnect()
  }
}

fillClinicalGapsWithFDA()
