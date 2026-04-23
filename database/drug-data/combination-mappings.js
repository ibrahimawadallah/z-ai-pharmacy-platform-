// High-quality ICD-10 mappings for complex multi-ingredient drugs
// Addressing clinical consistency gaps identified in audit

export const combinationDrugMappings = {
  // --- Cardiovascular Combinations ---

  // Amlodipine + Atorvastatin (Caduet) -> Hypertension + Hyperlipidemia
  'amlodipine besilate,atorvastatin calcium': [
    { code: 'I10', description: 'Essential (primary) hypertension' },
    { code: 'E78.00', description: 'Pure hypercholesterolemia, unspecified' },
    { code: 'E78.2', description: 'Mixed hyperlipidemia' },
    { code: 'I25.10', description: 'Atherosclerotic heart disease of native coronary artery' },
  ],
  'amlodipine besilate atorvastatin calcium': [
    { code: 'I10', description: 'Essential (primary) hypertension' },
    { code: 'E78.00', description: 'Pure hypercholesterolemia, unspecified' },
    { code: 'E78.2', description: 'Mixed hyperlipidemia' },
  ],
  // Variations found in audit
  'amlodipine besilate,atorvastatin': [
    { code: 'I10', description: 'Essential (primary) hypertension' },
    { code: 'E78.0', description: 'Pure hypercholesterolemia' },
  ],

  // --- H. Pylori Eradication Therapies ---

  // Rifabutin + Omeprazole + Amoxicillin (Talicia)
  'rifabutin omeprazole magnesium amoxicillin trihydrate': [
    {
      code: 'B96.81',
      description: 'Helicobacter pylori [H. pylori] as the cause of diseases classified elsewhere',
    },
    { code: 'K29.70', description: 'Gastritis, unspecified, without bleeding' },
    {
      code: 'K25.9',
      description:
        'Gastric ulcer, unspecified as acute or chronic, without hemorrhage or perforation',
    },
  ],
  'rifabutin,omeprazole,amoxicillin': [
    {
      code: 'B96.81',
      description: 'Helicobacter pylori [H. pylori] as the cause of diseases classified elsewhere',
    },
    { code: 'K29.70', description: 'Gastritis, unspecified, without bleeding' },
  ],

  // --- Cold & Flu / Respiratory Combinations ---

  // Chlorpheniramine + Paracetamol + Pseudoephedrine
  'chlorpheniramine maleate,paracetamol (acetaminophen),pseudoephedrine hydrochloride': [
    { code: 'J00', description: 'Acute nasopharyngitis [common cold]' },
    { code: 'J30.1', description: 'Allergic rhinitis due to pollen' },
    { code: 'R50.9', description: 'Fever, unspecified' },
    { code: 'R51', description: 'Headache' },
  ],
  'chlorpheniramine maleate,paracetamol (acetaminophen),pseudoephedrine': [
    { code: 'J00', description: 'Acute nasopharyngitis [common cold]' },
    { code: 'J30.1', description: 'Allergic rhinitis due to pollen' },
    { code: 'R50.9', description: 'Fever, unspecified' },
  ],
  // With Caffeine
  'caffeine,chlorpheniramine maleate,paracetamol (acetaminophen),pseudoephedrine': [
    { code: 'J00', description: 'Acute nasopharyngitis [common cold]' },
    { code: 'R51', description: 'Headache' }, // Caffeine often for headache
    { code: 'R50.9', description: 'Fever, unspecified' },
  ],

  // --- Pain & Inflammation (NSAID + PPI) ---

  // Esomeprazole + Naproxen (Vimovo) -> Pain + Gastric Protection
  'esomeprazole ,naproxen': [
    { code: 'M15.9', description: 'Osteoarthritis, unspecified' },
    { code: 'M06.9', description: 'Rheumatoid arthritis, unspecified' },
    { code: 'M25.50', description: 'Pain in unspecified joint' },
    { code: 'K21.9', description: 'Gastro-esophageal reflux disease without esophagitis' }, // PPI component
    {
      code: 'Z79.1',
      description: 'Long term (current) use of non-steroidal anti-inflammatories (NSAID)',
    },
  ],
  'diclofenac  ph. eur.,omeprazole ph. eur.': [
    { code: 'M15.9', description: 'Osteoarthritis, unspecified' },
    { code: 'M25.50', description: 'Pain in unspecified joint' },
    { code: 'K21.9', description: 'Gastro-esophageal reflux disease without esophagitis' },
  ],

  // --- Diabetes Combinations ---

  // Metformin + Sitagliptin (Janumet)
  'metformin hydrochloride,sitagliptin phosphate': [
    { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' },
    { code: 'E11.65', description: 'Type 2 diabetes mellitus with hyperglycemia' },
  ],

  // --- Atorvastatin Variations (Cleaning up the "equivalent to" mess) ---
  'atorvastatin calcium trihydrate 10 845 mg equivalent to atorvastatin base 10 mg': [
    { code: 'E78.0', description: 'Pure hypercholesterolemia' },
    { code: 'E78.2', description: 'Mixed hyperlipidemia' },
    { code: 'E78.5', description: 'Hyperlipidemia, unspecified' },
  ],
  'atorvastatin calcium trihydrate 21 69 mg equivalent to atorvastatin base 20 mg': [
    { code: 'E78.0', description: 'Pure hypercholesterolemia' },
    { code: 'E78.5', description: 'Hyperlipidemia, unspecified' },
  ],
  'atorvastatin calcium trihydrate 43 38 mg equivalent to atorvastatin base 40 mg': [
    { code: 'E78.0', description: 'Pure hypercholesterolemia' },
    { code: 'E78.5', description: 'Hyperlipidemia, unspecified' },
  ],
  // Variations from Audit Round 2
  'atorvastatin calcium trihydrate ph eur 43 38 mg equivalent to atorvastatin 40 mg ezetimibe in house':
    [
      { code: 'E78.0', description: 'Pure hypercholesterolemia' },
      { code: 'E78.2', description: 'Mixed hyperlipidemia' },
    ],
  'atorvastatin calcium trihydrate ph eur 86 76 mg equivalent to atorvastatin 80 mg ezetimibe in house':
    [
      { code: 'E78.0', description: 'Pure hypercholesterolemia' },
      { code: 'E78.2', description: 'Mixed hyperlipidemia' },
    ],
  'atorvastatin calcium trihydrate ph eur 10 845 mg equivalent to atorvastatin 10 mg ezetimibe in house':
    [
      { code: 'E78.0', description: 'Pure hypercholesterolemia' },
      { code: 'E78.2', description: 'Mixed hyperlipidemia' },
    ],
  'atorvastatin calcium trihydrate ph eur 21 69 mg equivalent to atorvastatin 20 mg ezetimibe in house':
    [
      { code: 'E78.0', description: 'Pure hypercholesterolemia' },
      { code: 'E78.2', description: 'Mixed hyperlipidemia' },
    ],
  'atorvastatin calcium ezetimibe': [
    { code: 'E78.0', description: 'Pure hypercholesterolemia' },
    { code: 'E78.2', description: 'Mixed hyperlipidemia' },
  ],
  'atorvastatin calcium crystalline trihydrate 10 9 mg equal to atorvastatin free acid 10 mg ezetimibe micronized':
    [
      { code: 'E78.0', description: 'Pure hypercholesterolemia' },
      { code: 'E78.2', description: 'Mixed hyperlipidemia' },
    ],
  'atorvastatin calcium crystalline trihydrate 21 7 mg equal to atorvastatin free acid 20mg ezetimibe micronized':
    [
      { code: 'E78.0', description: 'Pure hypercholesterolemia' },
      { code: 'E78.2', description: 'Mixed hyperlipidemia' },
    ],
  'atorvastatin calcium crystalline trihydrate 43 4 mg equal to atorvastatin free acid 40mg ezetimibe micronized':
    [
      { code: 'E78.0', description: 'Pure hypercholesterolemia' },
      { code: 'E78.2', description: 'Mixed hyperlipidemia' },
    ],
  'atorvastatin calcium crystalline trihydrate 86 8 mg equal to atorvastatin free acid 80mg ezetimibe micronized':
    [
      { code: 'E78.0', description: 'Pure hypercholesterolemia' },
      { code: 'E78.2', description: 'Mixed hyperlipidemia' },
    ],
  'atorvastatin   ph. eur. .  equivalent to atorvastatin  ,ezetimibe in house': [
    { code: 'E78.0', description: 'Pure hypercholesterolemia' },
    { code: 'E78.2', description: 'Mixed hyperlipidemia' },
  ],
  'atorvastatin ,ezetimibe': [
    { code: 'E78.0', description: 'Pure hypercholesterolemia' },
    { code: 'E78.2', description: 'Mixed hyperlipidemia' },
  ],
  'rifabutin,omeprazole ,amoxicillin': [
    {
      code: 'B96.81',
      description: 'Helicobacter pylori [H. pylori] as the cause of diseases classified elsewhere',
    },
    { code: 'K29.70', description: 'Gastritis, unspecified, without bleeding' },
  ],
  'chlorpheniramine maleate,paracetamol (acetaminophen),phenylephrine': [
    { code: 'J00', description: 'Acute nasopharyngitis [common cold]' },
    { code: 'R50.9', description: 'Fever, unspecified' },
    { code: 'J30.9', description: 'Allergic rhinitis, unspecified' },
  ],
  'atorvastatin   .  equivalent to atorvastatin base': [
    { code: 'E78.0', description: 'Pure hypercholesterolemia' },
    { code: 'E78.5', description: 'Hyperlipidemia, unspecified' },
  ],
  'atorvastatin  (crystalline ) .  equal to atorvastatin free acid  ,ezetimibe (micronized)': [
    { code: 'E78.0', description: 'Pure hypercholesterolemia' },
    { code: 'E78.2', description: 'Mixed hyperlipidemia' },
  ],
  'atorvastatin  (crystalline ) .  equal to atorvastatin free acid mg,ezetimibe,micronized': [
    { code: 'E78.0', description: 'Pure hypercholesterolemia' },
    { code: 'E78.2', description: 'Mixed hyperlipidemia' },
  ],
  'atorvastatin calcium': [
    { code: 'E78.0', description: 'Pure hypercholesterolemia' },
    { code: 'E78.2', description: 'Mixed hyperlipidemia' },
    { code: 'E78.5', description: 'Hyperlipidemia, unspecified' },
  ],
};
