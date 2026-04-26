import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function simpleSeed() {
  console.log('Starting simple seed...')

  try {
    const hashedPassword = await bcrypt.hash('demo123456', 12)

    // Create a sample user
    const user = await prisma.user.upsert({
      where: { email: 'demo@z-ai-pharmacy.com' },
      update: {},
      create: {
        email: 'demo@z-ai-pharmacy.com',
        password: hashedPassword,
        name: 'Demo User',
        role: 'user',
        isVerified: true
      }
    })

    console.log('Created demo user:', user.email)

    // Create sample drugs
    const sampleDrugs = [
      {
        drugCode: 'PARA001',
        packageName: 'Panadol Extra',
        genericName: 'Paracetamol',
        strength: '500mg',
        dosageForm: 'Tablet',
        packageSize: '24 tablets',
        status: 'Active',
        dispenseMode: 'OTC',
        packagePricePublic: 15.50,
        packagePricePharmacy: 12.00,
        unitPricePublic: 0.65,
        unitPricePharmacy: 0.50,
        agentName: 'GSK',
        manufacturerName: 'GlaxoSmithKline',
        includedInThiqaABM: 'Yes',
        includedInBasic: 'Yes',
        includedInABM1: 'No',
        includedInABM7: 'Yes'
      },
      {
        drugCode: 'IBUP001',
        packageName: 'Advil',
        genericName: 'Ibuprofen',
        strength: '400mg',
        dosageForm: 'Tablet',
        packageSize: '20 tablets',
        status: 'Active',
        dispenseMode: 'OTC',
        packagePricePublic: 18.75,
        packagePricePharmacy: 14.00,
        unitPricePublic: 0.94,
        unitPricePharmacy: 0.70,
        agentName: 'Pfizer',
        manufacturerName: 'Pfizer Inc',
        includedInThiqaABM: 'Yes',
        includedInBasic: 'Yes',
        includedInABM1: 'No',
        includedInABM7: 'Yes'
      },
      {
        drugCode: 'AMOX001',
        packageName: 'Amoxil',
        genericName: 'Amoxicillin',
        strength: '500mg',
        dosageForm: 'Capsule',
        packageSize: '20 capsules',
        status: 'Active',
        dispenseMode: 'Prescription',
        packagePricePublic: 45.00,
        packagePricePharmacy: 35.00,
        unitPricePublic: 2.25,
        unitPricePharmacy: 1.75,
        agentName: 'GSK',
        manufacturerName: 'GlaxoSmithKline',
        includedInThiqaABM: 'Yes',
        includedInBasic: 'No',
        includedInABM1: 'Yes',
        includedInABM7: 'No'
      }
    ]

    for (const drugData of sampleDrugs) {
      await prisma.drug.upsert({
        where: { drugCode: drugData.drugCode },
        update: drugData,
        create: drugData
      })
    }

    console.log(`Created ${sampleDrugs.length} sample drugs`)

    /*
    // Create sample interaction - disabled due to schema mismatch
    await prisma.drugInteraction.upsert({
      where: { id: 'sample-interaction' },
      update: {},
      create: {
        id: 'sample-interaction',
        drug1Id: 'PARA001',
        drug2Id: 'IBUP001',
        severity: 'Mild',
        description: 'Generally safe to use together. Both are common pain relievers.',
        recommendation: 'Can be taken together as directed.',
        clinicalEvidence: 'Well-documented safety profile when used as directed.',
        lastUpdated: new Date()
      }
    })

    console.log('Created sample drug interaction')
    */

    console.log('✅ Simple seed completed successfully!')
    console.log('📊 Summary:')
    console.log(`   - 1 demo user`)
    console.log(`   - ${sampleDrugs.length} sample drugs`)
    console.log('')
    console.log('')
    console.log('🌐 You can now visit: http://localhost:5173')
    console.log('👤 Demo login: demo@z-ai-pharmacy.com / demo123456')

  } catch (error) {
    console.error('❌ Seed failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

simpleSeed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
