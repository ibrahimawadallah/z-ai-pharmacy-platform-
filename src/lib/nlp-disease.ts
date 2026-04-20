export function extractDiseaseEntities(text: string): string[] {
  const diseases: string[] = []
  const seen = new Set<string>()

  for (const pattern of DISEASE_NAME_PATTERNS) {
    const matches = text.match(pattern)
    if (matches) {
      for (const match of matches) {
        const disease = match.toLowerCase().trim()
        if (!seen.has(disease) && disease.length > 3) {
          seen.add(disease)
          diseases.push(match)
        }
      }
    }
  }

  return diseases
}
