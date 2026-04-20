async function main() {
  const bunSqlite = (await import('bun:sqlite')) as any
  const Database = bunSqlite?.default ?? bunSqlite?.Database ?? bunSqlite

  const db = new Database('upload/drug-intelligence.db', { readonly: true })

  console.log('=== SQLite drug-intelligence.db Contents ===\n')

  const tables = db
    .query("SELECT name FROM sqlite_master WHERE type='table'")
    .all()
    .map((r: any) => r.name)
  console.log('Tables:', tables)

  console.log('\n=== Record Counts ===')
  const counts = db
    .query(`
      SELECT 'Drug' as table_name, COUNT(*) as count FROM Drug
      UNION ALL
      SELECT 'DrugInteraction', COUNT(*) FROM DrugInteraction
      UNION ALL
      SELECT 'DrugSideEffect', COUNT(*) FROM DrugSideEffect
      UNION ALL
      SELECT 'ICD10Mapping', COUNT(*) FROM ICD10Mapping
    `)
    .all()

  counts.forEach((row: any) => {
    console.log(`  ${row.table_name}: ${row.count.toLocaleString()}`)
  })

  console.log('\n=== Sample Interactions ===')
  const sampleInteractions = db
    .query(`
      SELECT di.*, d.packageName
      FROM DrugInteraction di
      JOIN Drug d ON di.drugId = d.id
      LIMIT 3
    `)
    .all()

  sampleInteractions.forEach((row: any) => {
    console.log(`Drug: ${row.packageName}`)
    console.log(`  Secondary: ${row.secondaryDrugName}`)
    console.log(`  Severity: ${row.severity}`)
    console.log(`  Description: ${row.description?.substring(0, 80)}...`)
    console.log('')
  })

  db.close()
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
