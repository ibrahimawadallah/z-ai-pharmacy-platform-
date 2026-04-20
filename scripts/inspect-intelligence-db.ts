import Database from 'better-sqlite3'
import * as path from 'path'

const intelligencePath = path.join(process.cwd(), 'upload', 'drug-intelligence.db')
const db = new Database(intelligencePath, { readonly: true })

console.log('=== DRUGS TABLE ===')
const drugColumns = db.pragma('table_info(drugs)')
console.log(drugColumns)

console.log('\n=== DRUG_INTERACTIONS TABLE ===')
const interactionColumns = db.pragma('table_info(drug_interactions)')
console.log(interactionColumns)

console.log('\n=== DRUG_SIDE_EFFECTS TABLE ===')
const sideEffectColumns = db.pragma('table_info(drug_side_effects)')
console.log(sideEffectColumns)

console.log('\n=== SAMPLE DRUG ===')
const sampleDrug = db.prepare('SELECT * FROM drugs LIMIT 1').get()
console.log(sampleDrug)

console.log('\n=== SAMPLE INTERACTION ===')
const sampleInteraction = db.prepare('SELECT * FROM drug_interactions LIMIT 1').get()
console.log(sampleInteraction)

console.log('\n=== SAMPLE SIDE EFFECT ===')
const sampleSideEffect = db.prepare('SELECT * FROM drug_side_effects LIMIT 1').get()
console.log(sampleSideEffect)

console.log('\n=== COUNTS ===')
const drugCount = db.prepare('SELECT COUNT(*) as count FROM drugs').get()
console.log('Drugs:', drugCount)

const interactionCount = db.prepare('SELECT COUNT(*) as count FROM drug_interactions').get()
console.log('Interactions:', interactionCount)

const sideEffectCount = db.prepare('SELECT COUNT(*) as count FROM drug_side_effects').get()
console.log('Side Effects:', sideEffectCount)

db.close()
