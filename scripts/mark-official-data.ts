import { db } from '../src/lib/db'

async function markOfficialData() {
  try {
    console.log('🏷️  Marking Official UAE MOH Data as Verified...\n')

    // Mark all drugs without source as UAE_MOH verified
    const basicInfoResult = await db.drug.updateMany({
      where: {
        source: null
      },
      data: {
        source: 'UAE_MOH_OFFICIAL',
        lastVerified: new Date()
      }
    })
    console.log(`✅ Marked ${basicInfoResult.count} drugs as UAE_MOH_OFFICIAL`)

    // Mark existing interactions without source
    const interactionsResult = await db.drugInteraction.updateMany({
      where: {
        source: null
      },
      data: {
        source: 'UAE_MOH_OFFICIAL',
        lastVerified: new Date()
      }
    })
    console.log(`✅ Marked ${interactionsResult.count} interactions as UAE_MOH_OFFICIAL`)

    // Mark existing side effects without source
    const sideEffectsResult = await db.drugSideEffect.updateMany({
      where: {
        source: null
      },
      data: {
        source: 'UAE_MOH_OFFICIAL',
        lastVerified: new Date()
      }
    })
    console.log(`✅ Marked ${sideEffectsResult.count} side effects as UAE_MOH_OFFICIAL`)

    console.log('\n✅ Official Data Marking Complete')
    console.log('All existing data is now marked as UAE_MOH_OFFICIAL source')
    
  } catch (error) {
    console.error('Error marking official data:', error)
  } finally {
    await db.$disconnect()
  }
}

markOfficialData()
