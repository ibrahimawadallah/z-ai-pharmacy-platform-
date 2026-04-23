import { db } from '@/lib/db'

async function seedClinical() {
  console.log('Seeding pregnancy & G6PD data...\n')
  
  const clinicalData = [
    { name: 'Amoxicillin', pregnancy: 'B', pregnancySE: 'Not teratogenic but use with caution', g6pd: 'Safe', g6pdWarning: 'Generally safe' },
    { name: 'Metformin', pregnancy: 'B', pregnancySE: 'Use with caution, may cause lactic acidosis', g6pd: 'Safe', g6pdWarning: 'Generally safe' },
    { name: 'Ibuprofen', pregnancy: 'C', pregnancySE: 'Avoid in 3rd trimester', g6pd: 'Use with caution', g6pdWarning: 'May cause hemolysis' },
    { name: 'Paracetamol', pregnancy: 'B', pregnancySE: 'Generally safe', g6pd: 'Safe', g6pdWarning: 'Generally safe' },
    { name: 'Aspirin', pregnancy: 'C', pregnancySE: 'Avoid in 3rd trimester', g6pd: 'Use with caution', g6pdWarning: 'May cause hemolysis' },
    { name: 'Omeprazole', pregnancy: 'C', pregnancySE: 'Use only if benefits outweigh risks', g6pd: 'Safe', g6pdWarning: 'Generally safe' },
    { name: 'Lisinopril', pregnancy: 'D', pregnancySE: 'Contraindicated - fetal toxicity', g6pd: 'Safe', g6pdWarning: 'Generally safe' },
    { name: 'Amlodipine', pregnancy: 'C', pregnancySE: 'Use with caution', g6pd: 'Safe', g6pdWarning: 'Generally safe' },
    { name: 'Atorvastatin', pregnancy: 'X', pregnancySE: 'Contraindicated - teratogenic', g6pd: 'Safe', g6pdWarning: 'Generally safe' },
    { name: 'Simvastatin', pregnancy: 'X', pregnancySE: 'Contraindicated - teratogenic', g6pd: 'Safe', g6pdWarning: 'Generally safe' },
    { name: 'Warfarin', pregnancy: 'X', pregnancySE: 'Contraindicated - fetal warfarin syndrome', g6pd: 'Use with caution', g6pdWarning: 'May cause hemorrhage' },
    { name: 'Fluoxetine', pregnancy: 'C', pregnancySE: 'Use with caution', g6pd: 'Safe', g6pdWarning: 'Generally safe' },
    { name: 'Sertraline', pregnancy: 'C', pregnancySE: 'Use with caution', g6pd: 'Safe', g6pdWarning: 'Generally safe' },
    { name: 'Prednisone', pregnancy: 'C', pregnancySE: 'Use with caution', g6pd: 'Safe', g6pdWarning: 'Generally safe' },
    { name: 'Amiodarone', pregnancy: 'D', pregnancySE: 'Contraindicated - fetal toxicity', g6pd: 'Safe', g6pdWarning: 'Generally safe' },
    { name: 'Methotrexate', pregnancy: 'X', pregnancySE: 'Contraindicated - abortifacient', g6pd: 'Safe', g6pdWarning: 'Generally safe' },
    { name: 'Cyclophosphamide', pregnancy: 'D', pregnancySE: 'Contraindicated', g6pd: 'Safe', g6pdWarning: 'Generally safe' },
    { name: 'Sulfonamides', pregnancy: 'C', pregnancySE: 'Avoid near term', g6pd: 'Contraindicated', g6pdWarning: 'G6PD deficiency - severe hemolysis' },
    { name: 'Dapsone', pregnancy: 'C', pregnancySE: 'Use with caution', g6pd: 'Contraindicated', g6pdWarning: 'G6PD deficiency - severe hemolysis' },
    { name: 'Nitrofurantoin', pregnancy: 'B', pregnancySE: 'Avoid in 3rd trimester', g6pd: 'Contraindicated', g6pdWarning: 'G6PD deficiency - hemolysis' },
    { name: 'Primaquine', pregnancy: 'C', pregnancySE: 'Use with caution', g6pd: 'Contraindicated', g6pdWarning: 'G6PD deficiency - severe hemolysis' },
    { name: 'Quinidine', pregnancy: 'C', pregnancySE: 'Use with caution', g6pd: 'Contraindicated', g6pdWarning: 'G6PD deficiency - severe hemolysis' },
    { name: 'Hydroxychloroquine', pregnancy: 'C', pregnancySE: 'Use with caution', g6pd: 'Use with caution', g6pdWarning: 'Monitor for hemolysis' },
    { name: 'Chloroquine', pregnancy: 'C', pregnancySE: 'Use with caution', g6pd: 'Contraindicated', g6pdWarning: 'G6PD deficiency - severe hemolysis' },
    { name: 'Metronidazole', pregnancy: 'B', pregnancySE: 'Generally safe', g6pd: 'Safe', g6pdWarning: 'Generally safe' },
    { name: 'Azithromycin', pregnancy: 'B', pregnancySE: 'Generally safe', g6pd: 'Safe', g6pdWarning: 'Generally safe' },
    { name: 'Ciprofloxacin', pregnancy: 'C', pregnancySE: 'Use with caution', g6pd: 'Use with caution', g6pdWarning: 'Monitor for hemolysis' },
    { name: 'Doxycycline', pregnancy: 'D', pregnancySE: 'Contraindicated - fetal abnormalities', g6pd: 'Safe', g6pdWarning: 'Generally safe' },
    { name: 'Carbamazepine', pregnancy: 'D', pregnancySE: 'Use with caution', g6pd: 'Safe', g6pdWarning: 'Generally safe' },
    { name: 'Valproic acid', pregnancy: 'D', pregnancySE: 'Contraindicated - neural tube defects', g6pd: 'Safe', g6pdWarning: 'Generally safe' },
    { name: 'Phenytoin', pregnancy: 'D', pregnancySE: 'Use with caution - fetal hydantoin', g6pd: 'Safe', g6pdWarning: 'Generally safe' },
    { name: 'Levothyroxine', pregnancy: 'A', pregnancySE: 'Safe', g6pd: 'Safe', g6pdWarning: 'Generally safe' },
    { name: 'Insulin', pregnancy: 'B', pregnancySE: 'Safe', g6pd: 'Safe', g6pdWarning: 'Generally safe' },
    { name: 'Morphine', pregnancy: 'C', pregnancySE: 'Use with caution - neonatal dependence', g6pd: 'Safe', g6pdWarning: 'Generally safe' },
    { name: 'Codeine', pregnancy: 'C', pregnancySE: 'Use with caution', g6pd: 'Safe', g6pdWarning: 'Generally safe' },
    { name: 'Tramadol', pregnancy: 'C', pregnancySE: 'Use with caution', g6pd: 'Safe', g6pdWarning: 'Generally safe' },
    { name: 'Gabapentin', pregnancy: 'C', pregnancySE: 'Use with caution', g6pd: 'Safe', g6pdWarning: 'Generally safe' },
    { name: 'Pregabalin', pregnancy: 'C', pregnancySE: 'Use with caution', g6pd: 'Safe', g6pdWarning: 'Generally safe' },
    { name: 'Metoprolol', pregnancy: 'C', pregnancySE: 'Use with caution', g6pd: 'Safe', g6pdWarning: 'Generally safe' },
    { name: 'Bisoprolol', pregnancy: 'C', pregnancySE: 'Use with caution', g6pd: 'Safe', g6pdWarning: 'Generally safe' },
    { name: 'Losartan', pregnancy: 'D', pregnancySE: 'Contraindicated - fetal toxicity', g6pd: 'Safe', g6pdWarning: 'Generally safe' },
  ]
  
  let count = 0
  
  for (const d of clinicalData) {
    const drug = await db.drug.findFirst({
      where: { genericName: { contains: d.name, mode: 'insensitive' } }
    })
    
    if (drug) {
      await db.drug.update({
        where: { id: drug.id },
        data: {
          pregnancyCategory: d.pregnancy,
          pregnancyPrecautions: d.pregnancySE,
          g6pdSafety: d.g6pd,
          g6pdWarning: d.g6pdWarning
        }
      })
      count++
      console.log(d.name + ': P' + d.pregnancy + ', G6PD:' + d.g6pd)
    }
  }
  
  console.log('\nUpdated', count, 'drugs')
}

seedClinical().then(() => db.$disconnect()).catch(console.error)