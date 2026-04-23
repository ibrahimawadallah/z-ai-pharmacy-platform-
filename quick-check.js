require('dotenv').config()
const { PrismaClient } = require('@prisma/client')

async function check() {
  const p = new PrismaClient()
  try {
    const drugs = await p.drug.count()
    console.log('Drugs count:', drugs)
  } catch (e) {
    console.error('Error:', e.message)
  } finally {
    await p.$disconnect()
  }
}
check()
