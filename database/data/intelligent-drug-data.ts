// Comprehensive drug database with dosing, formulations, and clinical info
export const INTELLIGENT_DRUG_DB: Record<string, any> = {
  ferosac: {
    name: 'Ferosac',
    generic: 'Iron (III) Hydroxide Polymaltose Complex',
    formulations: {
      injection: {
        strength: '100 mg/5ml',
        ampouleSize: '5ml',
        ampouleStrength: '100 mg',
        package: '5ml Ampoule x 5',
      },
    },
    dosing: {
      adult: '100-200 mg daily IM',
      pediatric: '2-5 mg/kg/day IM',
      maxDaily: '200 mg',
      calculation: (doseMg: number) => {
        const ampoules = Math.ceil(doseMg / 100);
        return {
          ampoules,
          totalVolume: `${ampoules * 5}ml`,
          totalDose: `${ampoules * 100}mg`,
          note: 'Each ampoule contains 100mg iron in 5ml',
        };
      },
    },
    indications: ['Iron deficiency anemia', 'Iron deficiency'],
    icd10: ['D50.9', 'D64.9'],
  },
  seltaflu: {
    name: 'Seltaflu',
    generic: 'Oseltamivir',
    formulations: {
      suspension: {
        strength: '6 mg/ml',
        volumes: ['60ml', '100ml'],
      },
      capsule: {
        strengths: ['30mg', '45mg', '75mg'],
      },
    },
    dosing: {
      pediatric: {
        weightBased: true,
        ranges: {
          '<15kg': { dose: '30mg', frequency: 'BID', duration: '5 days' },
          '15-23kg': { dose: '45mg', frequency: 'BID', duration: '5 days' },
          '24-40kg': { dose: '60mg', frequency: 'BID', duration: '5 days' },
          '>40kg': { dose: '75mg', frequency: 'BID', duration: '5 days' },
        },
        ageBased: (age: number) => {
          if (age >= 13)
            return { dose: '75mg', frequency: 'BID', duration: '5 days', note: 'Adult dosing' };
          const estWeight = age * 2.5 + 9;
          if (estWeight > 40) return { dose: '75mg', frequency: 'BID', duration: '5 days' };
          if (estWeight >= 24) return { dose: '60mg', frequency: 'BID', duration: '5 days' };
          if (estWeight >= 15) return { dose: '45mg', frequency: 'BID', duration: '5 days' };
          return { dose: '30mg', frequency: 'BID', duration: '5 days' };
        },
      },
      adult: {
        dose: '75mg',
        frequency: 'BID',
        duration: '5 days',
      },
    },
    indications: ['Influenza', 'Flu'],
    icd10: ['J11.1', 'J10.1'],
    notes: 'Start within 48 hours of symptom onset',
  },
  aspirin: {
    name: 'Aspirin',
    generic: 'Acetylsalicylic Acid',
    formulations: {
      tablet: {
        strengths: ['75mg', '81mg', '100mg', '300mg', '325mg'],
      },
      'enteric-coated': {
        strengths: ['75mg', '81mg', '100mg'],
      },
    },
    dosing: {
      adult: {
        pain: { dose: '300-600mg', frequency: 'q4-6h', max: '4g/day' },
        antiplatelet: { dose: '75-100mg', frequency: 'daily' },
        acs: { dose: '150-300mg', frequency: 'stat (chewed)' },
      },
      pediatric: "Contraindicated in children < 16 years (Reye's syndrome risk)",
    },
    indications: ['Pain', 'Fever', 'Inflammation', 'ACS', 'Secondary prevention of CVD'],
    icd10: ['R52', 'R50.9', 'I21.9', 'I25.10'],
    notes: 'Take with food to reduce GI irritation.',
  },
  paracetamol: {
    name: 'Paracetamol',
    generic: 'Acetaminophen',
    formulations: {
      tablet: {
        strengths: ['500mg', '1000mg'],
      },
      syrup: {
        strengths: ['120mg/5ml', '250mg/5ml'],
      },
      iv: {
        strengths: ['10mg/ml'],
        package: '100ml vial',
      },
      suppository: {
        strengths: ['125mg', '250mg', '500mg'],
      },
    },
    dosing: {
      adult: {
        dose: '500mg-1g',
        frequency: 'q4-6h',
        max: '4g/day',
      },
      pediatric: {
        weightBased: true,
        dose: '10-15mg/kg',
        frequency: 'q4-6h',
        max: '60mg/kg/day',
      },
    },
    indications: ['Pain', 'Fever'],
    icd10: ['R52', 'R50.9'],
    notes: 'Hepatotoxicity risk with overdose.',
  },
  ibuprofen: {
    name: 'Ibuprofen',
    generic: 'Ibuprofen',
    formulations: {
      tablet: {
        strengths: ['200mg', '400mg', '600mg', '800mg'],
      },
      syrup: {
        strengths: ['100mg/5ml'],
      },
      gel: {
        strengths: ['5%', '10%'],
      },
    },
    dosing: {
      adult: {
        pain: { dose: '200-400mg', frequency: 'q4-6h', max: '3200mg/day' },
        inflammation: { dose: '400-800mg', frequency: 'q6-8h', max: '3200mg/day' },
      },
      pediatric: {
        weightBased: true,
        dose: '5-10mg/kg',
        frequency: 'q6-8h',
        max: '40mg/kg/day',
      },
    },
    indications: ['Pain', 'Fever', 'Inflammation', 'Dysmenorrhea'],
    icd10: ['R52', 'R50.9', 'M79.1', 'N94.6'],
    notes: 'Take with food. Caution in renal impairment and GI ulcer history.',
  },
  amoxicillin: {
    name: 'Amoxicillin',
    generic: 'Amoxicillin',
    formulations: {
      capsule: {
        strengths: ['250mg', '500mg'],
      },
      suspension: {
        strengths: ['125mg/5ml', '250mg/5ml'],
      },
    },
    dosing: {
      adult: {
        dose: '500mg',
        frequency: 'q8h',
        duration: '5-7 days',
      },
      pediatric: {
        weightBased: true,
        dose: '20-40mg/kg/day',
        frequency: 'divided q8h',
      },
    },
    indications: ['Bacterial Infections', 'Otitis Media', 'Strep Throat', 'Pneumonia'],
    icd10: ['J03.0', 'H66.9', 'J18.9'],
    notes: 'Complete full course.',
  },
  augmentin: {
    name: 'Augmentin',
    generic: 'Amoxicillin + Clavulanate',
    formulations: {
      tablet: {
        strengths: ['375mg', '625mg', '1g'],
      },
      suspension: {
        strengths: ['156mg/5ml', '312mg/5ml', '457mg/5ml'],
      },
    },
    dosing: {
      adult: {
        dose: '625mg q8h or 1g q12h',
        frequency: 'q8h or q12h',
      },
      pediatric: {
        weightBased: true,
        dose: '20-40mg/kg/day (based on amoxicillin)',
        frequency: 'divided q8h',
      },
    },
    indications: ['Bacterial Infections', 'Sinusitis', 'Pneumonia', 'Skin Infections'],
    icd10: ['J01.9', 'J18.9', 'L08.9'],
    notes: 'Take with food to increase absorption and reduce GI upset.',
  },
  metformin: {
    name: 'Metformin',
    generic: 'Metformin Hydrochloride',
    formulations: {
      tablet: {
        strengths: ['500mg', '850mg', '1000mg'],
      },
      'extended-release': {
        strengths: ['500mg', '750mg', '1000mg'],
      },
    },
    dosing: {
      adult: {
        dose: '500-1000mg',
        frequency: 'BID with meals',
        max: '2000-2550mg/day',
      },
    },
    indications: ['Type 2 Diabetes', 'PCOS', 'Pre-diabetes'],
    icd10: ['E11.9', 'E28.2'],
    notes: 'Take with meals. Monitor renal function.',
  },
  atorvastatin: {
    name: 'Atorvastatin',
    generic: 'Atorvastatin',
    formulations: {
      tablet: {
        strengths: ['10mg', '20mg', '40mg', '80mg'],
      },
    },
    dosing: {
      adult: {
        dose: '10-80mg',
        frequency: 'once daily',
        time: 'any time of day',
      },
    },
    indications: ['Hyperlipidemia', 'High Cholesterol', 'CVD Prevention'],
    icd10: ['E78.0', 'E78.5'],
    notes: 'Avoid grapefruit juice.',
  },
  amlodipine: {
    name: 'Amlodipine',
    generic: 'Amlodipine Besylate',
    formulations: {
      tablet: {
        strengths: ['5mg', '10mg'],
      },
    },
    dosing: {
      adult: {
        dose: '5-10mg',
        frequency: 'once daily',
      },
    },
    indications: ['Hypertension', 'Angina'],
    icd10: ['I10', 'I20.9'],
    notes: 'May cause ankle swelling.',
  },
  omeprazole: {
    name: 'Omeprazole',
    generic: 'Omeprazole',
    formulations: {
      capsule: {
        strengths: ['10mg', '20mg', '40mg'],
      },
    },
    dosing: {
      adult: {
        dose: '20-40mg',
        frequency: 'once daily',
        time: '30-60 mins before breakfast',
      },
    },
    indications: ['GERD', 'Acid Reflux', 'Peptic Ulcer'],
    icd10: ['K21.9', 'K27.9'],
    notes: 'Take on empty stomach.',
  },
  salbutamol: {
    name: 'Salbutamol',
    generic: 'Salbutamol',
    formulations: {
      inhaler: {
        strength: '100mcg/dose',
        type: 'MDI',
      },
      nebulizer: {
        strengths: ['2.5mg/2.5ml', '5mg/2.5ml'],
      },
      syrup: {
        strength: '2mg/5ml',
      },
    },
    dosing: {
      adult: {
        inhaler: '1-2 puffs q4-6h prn',
        nebulizer: '2.5-5mg q4-6h prn',
      },
      pediatric: {
        inhaler: '1-2 puffs q4-6h prn',
        nebulizer: '2.5mg q4-6h prn',
      },
    },
    indications: ['Asthma', 'Bronchospasm', 'COPD'],
    icd10: ['J45.9', 'J44.9'],
    notes: 'Shake inhaler well before use.',
  },
  cetirizine: {
    name: 'Cetirizine',
    generic: 'Cetirizine Dihydrochloride',
    formulations: {
      tablet: {
        strengths: ['10mg'],
      },
      syrup: {
        strength: '5mg/5ml',
      },
    },
    dosing: {
      adult: {
        dose: '10mg',
        frequency: 'once daily',
      },
      pediatric: {
        '6-12 years': '10mg daily or 5mg BID',
        '2-5 years': '2.5-5mg once daily',
      },
    },
    indications: ['Allergy', 'Hay Fever', 'Urticaria'],
    icd10: ['J30.9', 'L50.9'],
    notes: 'May cause drowsiness.',
  },
  lisinopril: {
    name: 'Lisinopril',
    generic: 'Lisinopril',
    formulations: {
      tablet: {
        strengths: ['2.5mg', '5mg', '10mg', '20mg'],
      },
    },
    dosing: {
      adult: {
        dose: '10-40mg',
        frequency: 'once daily',
        max: '80mg/day',
      },
    },
    indications: ['Hypertension', 'Heart Failure', 'Post-MI'],
    icd10: ['I10', 'I50.9'],
    notes: 'Monitor potassium levels.',
  },
  simvastatin: {
    name: 'Simvastatin',
    generic: 'Simvastatin',
    formulations: {
      tablet: {
        strengths: ['10mg', '20mg', '40mg', '80mg'],
      },
    },
    dosing: {
      adult: {
        dose: '10-40mg',
        frequency: 'once daily at evening',
        max: '40mg/day (80mg restricted)',
      },
    },
    indications: ['Hyperlipidemia', 'High Cholesterol', 'CVD Prevention'],
    icd10: ['E78.5', 'E78.0'],
    notes: 'Take in the evening. Risk of myopathy.',
  },
  azithromycin: {
    name: 'Azithromycin',
    generic: 'Azithromycin',
    formulations: {
      tablet: {
        strengths: ['250mg', '500mg'],
      },
      suspension: {
        strengths: ['200mg/5ml', '100mg/5ml'],
      },
    },
    dosing: {
      adult: {
        dose: '500mg daily for 3 days',
        frequency: 'once daily',
      },
      pediatric: {
        dose: '10mg/kg daily for 3 days',
        frequency: 'once daily',
      },
    },
    indications: ['Respiratory Infections', 'Pneumonia', 'Strep Throat'],
    icd10: ['J18.9', 'J02.9'],
    notes: 'Take with or without food.',
  },
  ciprofloxacin: {
    name: 'Ciprofloxacin',
    generic: 'Ciprofloxacin',
    formulations: {
      tablet: {
        strengths: ['250mg', '500mg', '750mg'],
      },
      ophthalmic: {
        strength: '0.3%',
      },
    },
    dosing: {
      adult: {
        dose: '250-750mg',
        frequency: 'q12h',
        duration: '7-14 days',
      },
    },
    indications: ['UTI', 'Bacterial Infections', 'Skin Infections'],
    icd10: ['N39.0', 'L08.9'],
    notes: 'Avoid dairy products with dose. Tendon rupture risk.',
  },
  sertraline: {
    name: 'Sertraline',
    generic: 'Sertraline Hydrochloride',
    formulations: {
      tablet: {
        strengths: ['25mg', '50mg', '100mg'],
      },
    },
    dosing: {
      adult: {
        dose: '50-200mg',
        frequency: 'once daily',
        start: '50mg daily',
      },
    },
    indications: ['Depression', 'Anxiety', 'OCD', 'PTSD'],
    icd10: ['F32.9', 'F41.1'],
    notes: 'Do not stop abruptly.',
  },
  diclofenac: {
    name: 'Diclofenac',
    generic: 'Diclofenac Sodium/Potassium',
    formulations: {
      tablet: { strengths: ['25mg', '50mg', '75mg', '100mg'] },
      gel: { strengths: ['1%', '2.32%'] },
      injection: { strength: '75mg/3ml' },
    },
    dosing: {
      adult: {
        dose: '50-150mg daily',
        frequency: 'divided doses (BID/TID)',
        max: '150mg/day',
      },
    },
    indications: ['Pain', 'Inflammation', 'Arthritis'],
    icd10: ['R52', 'M19.9'],
    notes: 'Take with food. Risk of GI bleeding.',
  },
  losartan: {
    name: 'Losartan',
    generic: 'Losartan Potassium',
    formulations: {
      tablet: { strengths: ['25mg', '50mg', '100mg'] },
    },
    dosing: {
      adult: {
        dose: '25-100mg',
        frequency: 'once daily',
      },
    },
    indications: ['Hypertension', 'Nephropathy'],
    icd10: ['I10', 'N08'],
    notes: 'Monitor kidney function.',
  },
  pantoprazole: {
    name: 'Pantoprazole',
    generic: 'Pantoprazole',
    formulations: {
      tablet: { strengths: ['20mg', '40mg'] },
    },
    dosing: {
      adult: {
        dose: '20-40mg',
        frequency: 'once daily',
        time: '30 mins before breakfast',
      },
    },
    indications: ['GERD', 'Acid Reflux', 'Gastritis'],
    icd10: ['K21.9', 'K29.7'],
    notes: 'Swallow whole, do not crush.',
  },
  montelukast: {
    name: 'Montelukast',
    generic: 'Montelukast Sodium',
    formulations: {
      tablet: { strengths: ['10mg'] },
      'chewable tablet': { strengths: ['4mg', '5mg'] },
      granules: { strength: '4mg' },
    },
    dosing: {
      adult: { dose: '10mg', frequency: 'once daily (evening)' },
      pediatric: {
        '6-14 years': '5mg daily',
        '2-5 years': '4mg daily',
      },
    },
    indications: ['Asthma', 'Allergic Rhinitis'],
    icd10: ['J45.9', 'J30.9'],
    notes: 'Take in the evening.',
  },
  cefixime: {
    name: 'Cefixime',
    generic: 'Cefixime',
    formulations: {
      tablet: { strengths: ['200mg', '400mg'] },
      suspension: { strengths: ['100mg/5ml'] },
    },
    dosing: {
      adult: {
        dose: '400mg',
        frequency: 'daily or divided BID',
      },
      pediatric: {
        dose: '8mg/kg/day',
        frequency: 'daily or divided BID',
      },
    },
    indications: ['UTI', 'Otitis Media', 'Respiratory Infections'],
    icd10: ['N39.0', 'H66.9', 'J22'],
    notes: 'Can be taken with or without food.',
  },
};
