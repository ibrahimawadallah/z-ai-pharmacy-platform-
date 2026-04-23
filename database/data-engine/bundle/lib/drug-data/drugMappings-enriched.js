/**
 * Enriched Drug to ICD-10 Mappings
 * Comprehensive mappings for medications including antivirals, antihistamines,
 * anticonvulsants, cardiovascular, respiratory, GI, and mental health medications
 */

export const enrichedDrugMappings = {
  // ========== ANTIVIRAL MEDICATIONS ==========
  acyclovir: [
    { code: 'B00.9', description: 'Herpes simplex infection, unspecified' },
    { code: 'B00.1', description: 'Herpesviral vesicular dermatitis' },
    { code: 'B00.2', description: 'Herpesviral gingivostomatitis and pharyngotonsillitis' },
    { code: 'B00.89', description: 'Other herpesviral infection' },
    { code: 'B01.9', description: 'Varicella without complication' },
    { code: 'B02.9', description: 'Zoster without complication' },
    { code: 'B02.29', description: 'Postherpetic neuralgia' },
    { code: 'B00.0', description: 'Herpesviral encephalitis' },
  ],
  valacyclovir: [
    { code: 'B00.9', description: 'Herpes simplex infection, unspecified' },
    { code: 'B00.1', description: 'Herpesviral vesicular dermatitis' },
    { code: 'B01.9', description: 'Varicella without complication' },
    { code: 'B02.9', description: 'Zoster without complication' },
    { code: 'B02.29', description: 'Postherpetic neuralgia' },
  ],
  oseltamivir: [
    { code: 'J11.1', description: 'Influenza with other respiratory manifestations' },
    {
      code: 'J10.1',
      description:
        'Influenza with other respiratory manifestations, seasonal influenza virus identified',
    },
    {
      code: 'J09.X2',
      description:
        'Influenza due to identified novel influenza A virus with other respiratory manifestations',
    },
    {
      code: 'Z20.828',
      description: 'Contact with and (suspected) exposure to other viral communicable diseases',
    },
  ],
  ganciclovir: [
    { code: 'B25.9', description: 'Cytomegaloviral disease, unspecified' },
    { code: 'B25.0', description: 'Cytomegaloviral pneumonitis' },
    { code: 'B25.1', description: 'Cytomegaloviral hepatitis' },
    { code: 'B25.2', description: 'Cytomegaloviral pancreatitis' },
    { code: 'B25.8', description: 'Other cytomegaloviral diseases' },
  ],
  ribavirin: [
    {
      code: 'B97.4',
      description: 'Respiratory syncytial virus as the cause of diseases classified elsewhere',
    },
    { code: 'J21.0', description: 'Acute bronchiolitis due to respiratory syncytial virus' },
    { code: 'B17.10', description: 'Acute hepatitis C without hepatic coma' },
    { code: 'B18.2', description: 'Chronic viral hepatitis C' },
  ],

  // ========== ANTIHISTAMINES ==========
  cetirizine: [
    { code: 'J30.9', description: 'Allergic rhinitis, unspecified' },
    { code: 'J30.1', description: 'Allergic rhinitis due to pollen' },
    { code: 'J30.2', description: 'Other seasonal allergic rhinitis' },
    { code: 'J30.3', description: 'Other allergic rhinitis' },
    { code: 'L50.9', description: 'Urticaria, unspecified' },
    { code: 'L50.0', description: 'Allergic urticaria' },
    { code: 'T78.40XA', description: 'Allergy, unspecified, initial encounter' },
  ],
  fexofenadine: [
    { code: 'J30.9', description: 'Allergic rhinitis, unspecified' },
    { code: 'J30.1', description: 'Allergic rhinitis due to pollen' },
    { code: 'J30.2', description: 'Other seasonal allergic rhinitis' },
    { code: 'L50.9', description: 'Urticaria, unspecified' },
    { code: 'L50.0', description: 'Allergic urticaria' },
  ],
  hydroxyzine: [
    { code: 'L50.9', description: 'Urticaria, unspecified' },
    { code: 'L50.0', description: 'Allergic urticaria' },
    { code: 'F41.9', description: 'Anxiety disorder, unspecified' },
    { code: 'F41.1', description: 'Generalized anxiety disorder' },
    { code: 'L29.9', description: 'Pruritus, unspecified' },
    { code: 'L29.0', description: 'Pruritus ani' },
    { code: 'L29.1', description: 'Pruritus scroti' },
  ],
  chlorpheniramine: [
    { code: 'J30.9', description: 'Allergic rhinitis, unspecified' },
    { code: 'L50.9', description: 'Urticaria, unspecified' },
    { code: 'T78.40XA', description: 'Allergy, unspecified, initial encounter' },
  ],
  promethazine: [
    { code: 'R11.2', description: 'Nausea with vomiting, unspecified' },
    { code: 'R11.0', description: 'Nausea' },
    { code: 'R11.1', description: 'Vomiting' },
    { code: 'T75.3XXA', description: 'Motion sickness, initial encounter' },
    { code: 'L50.9', description: 'Urticaria, unspecified' },
    { code: 'G47.00', description: 'Insomnia, unspecified' },
  ],
  cyproheptadine: [
    { code: 'L50.9', description: 'Urticaria, unspecified' },
    { code: 'J30.9', description: 'Allergic rhinitis, unspecified' },
    { code: 'R63.0', description: 'Anorexia' },
  ],
  desloratadine: [
    { code: 'J30.9', description: 'Allergic rhinitis, unspecified' },
    { code: 'J30.1', description: 'Allergic rhinitis due to pollen' },
    { code: 'L50.9', description: 'Urticaria, unspecified' },
  ],
  levocetirizine: [
    { code: 'J30.9', description: 'Allergic rhinitis, unspecified' },
    { code: 'J30.1', description: 'Allergic rhinitis due to pollen' },
    { code: 'L50.9', description: 'Urticaria, unspecified' },
    { code: 'L50.0', description: 'Allergic urticaria' },
  ],
  azelastine: [
    { code: 'J30.9', description: 'Allergic rhinitis, unspecified' },
    { code: 'J30.1', description: 'Allergic rhinitis due to pollen' },
    { code: 'J30.2', description: 'Other seasonal allergic rhinitis' },
  ],
  olopatadine: [
    { code: 'J30.9', description: 'Allergic rhinitis, unspecified' },
    { code: 'J30.1', description: 'Allergic rhinitis due to pollen' },
  ],
  loratadine: [
    { code: 'J30.9', description: 'Allergic rhinitis, unspecified' },
    { code: 'J30.1', description: 'Allergic rhinitis due to pollen' },
    { code: 'L50.9', description: 'Urticaria, unspecified' },
  ],
  diphenhydramine: [
    { code: 'L50.9', description: 'Urticaria, unspecified' },
    { code: 'J30.9', description: 'Allergic rhinitis, unspecified' },
    { code: 'G47.00', description: 'Insomnia, unspecified' },
    { code: 'T78.40XA', description: 'Allergy, unspecified, initial encounter' },
  ],

  // ========== ANTICONVULSANTS ==========
  phenytoin: [
    {
      code: 'G40.909',
      description: 'Epilepsy, unspecified, not intractable, without status epilepticus',
    },
    {
      code: 'G40.901',
      description: 'Epilepsy, unspecified, not intractable, with status epilepticus',
    },
    {
      code: 'G40.109',
      description:
        'Localization-related (focal) (partial) symptomatic epilepsy and epileptic syndromes with simple partial seizures, not intractable, without status epilepticus',
    },
    {
      code: 'G40.209',
      description:
        'Localization-related (focal) (partial) symptomatic epilepsy and epileptic syndromes with complex partial seizures, not intractable, without status epilepticus',
    },
    {
      code: 'G40.909',
      description: 'Epilepsy, unspecified, not intractable, without status epilepticus',
    },
  ],
  'valproic acid': [
    {
      code: 'G40.909',
      description: 'Epilepsy, unspecified, not intractable, without status epilepticus',
    },
    {
      code: 'G40.901',
      description: 'Epilepsy, unspecified, not intractable, with status epilepticus',
    },
    {
      code: 'G40.109',
      description:
        'Localization-related (focal) (partial) symptomatic epilepsy and epileptic syndromes with simple partial seizures, not intractable, without status epilepticus',
    },
    { code: 'F31.9', description: 'Bipolar disorder, unspecified' },
  ],
  valproic: [
    {
      code: 'G40.909',
      description: 'Epilepsy, unspecified, not intractable, without status epilepticus',
    },
    {
      code: 'G40.901',
      description: 'Epilepsy, unspecified, not intractable, with status epilepticus',
    },
    { code: 'F31.9', description: 'Bipolar disorder, unspecified' },
  ],
  carbamazepine: [
    {
      code: 'G40.909',
      description: 'Epilepsy, unspecified, not intractable, without status epilepticus',
    },
    {
      code: 'G40.109',
      description:
        'Localization-related (focal) (partial) symptomatic epilepsy and epileptic syndromes with simple partial seizures, not intractable, without status epilepticus',
    },
    { code: 'G50.1', description: 'Atypical facial pain' },
    { code: 'G50.0', description: 'Trigeminal neuralgia' },
    { code: 'F31.9', description: 'Bipolar disorder, unspecified' },
  ],
  phenobarbital: [
    {
      code: 'G40.909',
      description: 'Epilepsy, unspecified, not intractable, without status epilepticus',
    },
    {
      code: 'G40.901',
      description: 'Epilepsy, unspecified, not intractable, with status epilepticus',
    },
    {
      code: 'G40.109',
      description:
        'Localization-related (focal) (partial) symptomatic epilepsy and epileptic syndromes with simple partial seizures, not intractable, without status epilepticus',
    },
  ],
  levetiracetam: [
    {
      code: 'G40.909',
      description: 'Epilepsy, unspecified, not intractable, without status epilepticus',
    },
    {
      code: 'G40.109',
      description:
        'Localization-related (focal) (partial) symptomatic epilepsy and epileptic syndromes with simple partial seizures, not intractable, without status epilepticus',
    },
    {
      code: 'G40.209',
      description:
        'Localization-related (focal) (partial) symptomatic epilepsy and epileptic syndromes with complex partial seizures, not intractable, without status epilepticus',
    },
  ],
  lamotrigine: [
    {
      code: 'G40.909',
      description: 'Epilepsy, unspecified, not intractable, without status epilepticus',
    },
    {
      code: 'G40.109',
      description:
        'Localization-related (focal) (partial) symptomatic epilepsy and epileptic syndromes with simple partial seizures, not intractable, without status epilepticus',
    },
    { code: 'F31.9', description: 'Bipolar disorder, unspecified' },
  ],

  // ========== CARDIOVASCULAR MEDICATIONS ==========
  furosemide: [
    { code: 'I50.9', description: 'Heart failure, unspecified' },
    { code: 'I50.1', description: 'Left ventricular failure' },
    { code: 'I50.2', description: 'Systolic heart failure' },
    { code: 'I50.3', description: 'Diastolic heart failure' },
    { code: 'E87.6', description: 'Hypokalemia' },
    { code: 'R60.9', description: 'Edema, unspecified' },
    { code: 'I50.20', description: 'Unspecified systolic heart failure' },
  ],
  spironolactone: [
    { code: 'I50.9', description: 'Heart failure, unspecified' },
    { code: 'I10', description: 'Essential (primary) hypertension' },
    { code: 'E87.6', description: 'Hypokalemia' },
    { code: 'E28.2', description: 'Polycystic ovarian syndrome' },
    { code: 'R60.9', description: 'Edema, unspecified' },
  ],
  captopril: [
    { code: 'I10', description: 'Essential (primary) hypertension' },
    { code: 'I50.9', description: 'Heart failure, unspecified' },
    {
      code: 'I25.10',
      description:
        'Atherosclerotic heart disease of native coronary artery without angina pectoris',
    },
    { code: 'I50.1', description: 'Left ventricular failure' },
  ],
  enalapril: [
    { code: 'I10', description: 'Essential (primary) hypertension' },
    { code: 'I50.9', description: 'Heart failure, unspecified' },
    {
      code: 'I25.10',
      description:
        'Atherosclerotic heart disease of native coronary artery without angina pectoris',
    },
    { code: 'I50.1', description: 'Left ventricular failure' },
  ],
  propranolol: [
    { code: 'I10', description: 'Essential (primary) hypertension' },
    { code: 'I48.91', description: 'Unspecified atrial fibrillation' },
    {
      code: 'G43.909',
      description: 'Migraine, unspecified, not intractable, without status migrainosus',
    },
    { code: 'I20.9', description: 'Angina pectoris, unspecified' },
    { code: 'F41.9', description: 'Anxiety disorder, unspecified' },
  ],
  digoxin: [
    { code: 'I50.9', description: 'Heart failure, unspecified' },
    { code: 'I50.1', description: 'Left ventricular failure' },
    { code: 'I48.91', description: 'Unspecified atrial fibrillation' },
    { code: 'I48.0', description: 'Paroxysmal atrial fibrillation' },
  ],

  // ========== RESPIRATORY MEDICATIONS ==========
  theophylline: [
    { code: 'J45.909', description: 'Unspecified asthma, uncomplicated' },
    { code: 'J45.901', description: 'Unspecified asthma with (acute) exacerbation' },
    { code: 'J44.9', description: 'Chronic obstructive pulmonary disease, unspecified' },
    {
      code: 'J44.1',
      description: 'Chronic obstructive pulmonary disease with (acute) exacerbation',
    },
  ],
  budesonide: [
    { code: 'J45.909', description: 'Unspecified asthma, uncomplicated' },
    { code: 'J45.901', description: 'Unspecified asthma with (acute) exacerbation' },
    { code: 'J05.0', description: 'Acute obstructive laryngitis [croup]' },
    { code: 'J44.9', description: 'Chronic obstructive pulmonary disease, unspecified' },
  ],
  fluticasone: [
    { code: 'J45.909', description: 'Unspecified asthma, uncomplicated' },
    { code: 'J45.901', description: 'Unspecified asthma with (acute) exacerbation' },
    { code: 'J30.9', description: 'Allergic rhinitis, unspecified' },
    { code: 'J30.1', description: 'Allergic rhinitis due to pollen' },
  ],
  ipratropium: [
    { code: 'J45.909', description: 'Unspecified asthma, uncomplicated' },
    { code: 'J45.901', description: 'Unspecified asthma with (acute) exacerbation' },
    { code: 'J44.9', description: 'Chronic obstructive pulmonary disease, unspecified' },
    {
      code: 'J44.1',
      description: 'Chronic obstructive pulmonary disease with (acute) exacerbation',
    },
  ],
  'ipratropium-albuterol': [
    { code: 'J45.909', description: 'Unspecified asthma, uncomplicated' },
    { code: 'J45.901', description: 'Unspecified asthma with (acute) exacerbation' },
    {
      code: 'J44.1',
      description: 'Chronic obstructive pulmonary disease with (acute) exacerbation',
    },
  ],
  'budesonide-formoterol': [
    { code: 'J45.909', description: 'Unspecified asthma, uncomplicated' },
    { code: 'J45.901', description: 'Unspecified asthma with (acute) exacerbation' },
  ],
  salbutamol: [
    { code: 'J45.909', description: 'Unspecified asthma, uncomplicated' },
    { code: 'J45.901', description: 'Unspecified asthma with (acute) exacerbation' },
    {
      code: 'J44.1',
      description: 'Chronic obstructive pulmonary disease with (acute) exacerbation',
    },
  ],
  albuterol: [
    { code: 'J45.909', description: 'Unspecified asthma, uncomplicated' },
    { code: 'J45.901', description: 'Unspecified asthma with (acute) exacerbation' },
    {
      code: 'J44.1',
      description: 'Chronic obstructive pulmonary disease with (acute) exacerbation',
    },
  ],
  montelukast: [
    { code: 'J45.909', description: 'Unspecified asthma, uncomplicated' },
    { code: 'J30.9', description: 'Allergic rhinitis, unspecified' },
    { code: 'J30.1', description: 'Allergic rhinitis due to pollen' },
  ],
  prednisolone: [
    { code: 'J45.901', description: 'Unspecified asthma with (acute) exacerbation' },
    {
      code: 'J44.1',
      description: 'Chronic obstructive pulmonary disease with (acute) exacerbation',
    },
    { code: 'M79.3', description: 'Panniculitis, unspecified' },
    { code: 'L50.9', description: 'Urticaria, unspecified' },
  ],

  // ========== GI MEDICATIONS ==========
  ranitidine: [
    { code: 'K21.9', description: 'Gastro-esophageal reflux disease without esophagitis' },
    { code: 'K21.0', description: 'Gastro-esophageal reflux disease with esophagitis' },
    {
      code: 'K25.9',
      description:
        'Gastric ulcer, unspecified as acute or chronic, without hemorrhage or perforation',
    },
    {
      code: 'K27.9',
      description:
        'Peptic ulcer, site unspecified, unspecified as acute or chronic, without hemorrhage or perforation',
    },
  ],
  famotidine: [
    { code: 'K21.9', description: 'Gastro-esophageal reflux disease without esophagitis' },
    { code: 'K21.0', description: 'Gastro-esophageal reflux disease with esophagitis' },
    {
      code: 'K25.9',
      description:
        'Gastric ulcer, unspecified as acute or chronic, without hemorrhage or perforation',
    },
  ],
  domperidone: [
    { code: 'R11.2', description: 'Nausea with vomiting, unspecified' },
    { code: 'R11.0', description: 'Nausea' },
    { code: 'K31.84', description: 'Gastroparesis' },
  ],
  ondansetron: [
    { code: 'R11.2', description: 'Nausea with vomiting, unspecified' },
    { code: 'R11.0', description: 'Nausea' },
    { code: 'R11.1', description: 'Vomiting' },
    { code: 'Z51.11', description: 'Encounter for antineoplastic chemotherapy' },
  ],
  omeprazole: [
    { code: 'K21.9', description: 'Gastro-esophageal reflux disease without esophagitis' },
    { code: 'K21.0', description: 'Gastro-esophageal reflux disease with esophagitis' },
    {
      code: 'K25.9',
      description:
        'Gastric ulcer, unspecified as acute or chronic, without hemorrhage or perforation',
    },
    { code: 'K29.70', description: 'Gastritis, unspecified, without bleeding' },
  ],

  // ========== MENTAL HEALTH MEDICATIONS ==========
  amitriptyline: [
    { code: 'F32.9', description: 'Major depressive disorder, single episode, unspecified' },
    { code: 'F33.9', description: 'Major depressive disorder, recurrent, unspecified' },
    { code: 'G89.29', description: 'Other chronic pain' },
    {
      code: 'G43.909',
      description: 'Migraine, unspecified, not intractable, without status migrainosus',
    },
  ],
  fluoxetine: [
    { code: 'F32.9', description: 'Major depressive disorder, single episode, unspecified' },
    { code: 'F33.9', description: 'Major depressive disorder, recurrent, unspecified' },
    { code: 'F42.9', description: 'Obsessive-compulsive disorder, unspecified' },
    { code: 'F41.9', description: 'Anxiety disorder, unspecified' },
  ],
  methylphenidate: [
    { code: 'F90.9', description: 'Attention-deficit hyperactivity disorder, unspecified type' },
    {
      code: 'F90.0',
      description: 'Attention-deficit hyperactivity disorder, predominantly inattentive type',
    },
    {
      code: 'F90.1',
      description: 'Attention-deficit hyperactivity disorder, predominantly hyperactive type',
    },
    { code: 'F90.2', description: 'Attention-deficit hyperactivity disorder, combined type' },
  ],
  dextroamphetamine: [
    { code: 'F90.9', description: 'Attention-deficit hyperactivity disorder, unspecified type' },
    {
      code: 'F90.0',
      description: 'Attention-deficit hyperactivity disorder, predominantly inattentive type',
    },
    {
      code: 'F90.1',
      description: 'Attention-deficit hyperactivity disorder, predominantly hyperactive type',
    },
    { code: 'F90.2', description: 'Attention-deficit hyperactivity disorder, combined type' },
  ],

  // ========== ADDITIONAL ANTIBIOTICS ==========
  cefixime: [
    { code: 'J02.9', description: 'Acute pharyngitis, unspecified' },
    { code: 'N39.0', description: 'Urinary tract infection, site not specified' },
    { code: 'J01.90', description: 'Acute sinusitis, unspecified' },
    { code: 'J18.9', description: 'Pneumonia, unspecified organism' },
    { code: 'A54.9', description: 'Gonococcal infection, unspecified' },
  ],
  cefdinir: [
    { code: 'J02.9', description: 'Acute pharyngitis, unspecified' },
    { code: 'J18.9', description: 'Pneumonia, unspecified organism' },
    { code: 'J01.90', description: 'Acute sinusitis, unspecified' },
    { code: 'L03.90', description: 'Cellulitis, unspecified' },
  ],
  // Omnicef brand name (cefdinir antibiotic)
  omnicef: [
    { code: 'J02.9', description: 'Acute pharyngitis, unspecified' },
    { code: 'J18.9', description: 'Pneumonia, unspecified organism' },
    { code: 'J01.90', description: 'Acute sinusitis, unspecified' },
    { code: 'L03.90', description: 'Cellulitis, unspecified' },
  ],
  clarithromycin: [
    { code: 'J02.9', description: 'Acute pharyngitis, unspecified' },
    { code: 'J18.9', description: 'Pneumonia, unspecified organism' },
    { code: 'J01.90', description: 'Acute sinusitis, unspecified' },
    { code: 'J20.9', description: 'Acute bronchitis, unspecified' },
    { code: 'J03.90', description: 'Acute tonsillitis, unspecified' },
    { code: 'H66.90', description: 'Otitis media, unspecified, unspecified ear' },
    { code: 'K29.70', description: 'Gastritis, unspecified, without bleeding' },
  ],
  vancomycin: [
    { code: 'A41.9', description: 'Sepsis, unspecified organism' },
    { code: 'J18.9', description: 'Pneumonia, unspecified organism' },
    { code: 'L03.90', description: 'Cellulitis, unspecified' },
    { code: 'M00.9', description: 'Pyogenic arthritis, unspecified' },
    { code: 'A49.9', description: 'Bacterial infection, unspecified' },
  ],
  gentamicin: [
    { code: 'A41.9', description: 'Sepsis, unspecified organism' },
    { code: 'N39.0', description: 'Urinary tract infection, site not specified' },
    { code: 'L03.90', description: 'Cellulitis, unspecified' },
    { code: 'J18.9', description: 'Pneumonia, unspecified organism' },
  ],
  metronidazole: [
    { code: 'A07.1', description: 'Giardiasis [lambliasis]' },
    { code: 'K29.70', description: 'Gastritis, unspecified, without bleeding' },
    { code: 'A49.9', description: 'Bacterial infection, unspecified' },
    { code: 'K63.89', description: 'Other specified diseases of intestine' },
  ],
  clindamycin: [
    { code: 'L03.90', description: 'Cellulitis, unspecified' },
    { code: 'K04.7', description: 'Periapical abscess without sinus' },
    { code: 'J18.9', description: 'Pneumonia, unspecified organism' },
    { code: 'M86.9', description: 'Osteomyelitis, unspecified' },
  ],

  // ========== UAE BRAND NAME MAPPINGS ==========
  // Urology - BPH
  omnic: [
    {
      code: 'N40.0',
      description: 'Benign prostatic hyperplasia without lower urinary tract symptoms',
    },
    {
      code: 'N40.1',
      description: 'Benign prostatic hyperplasia with lower urinary tract symptoms',
    },
    { code: 'N32.81', description: 'Overactive bladder' },
  ],
  'omnic ocas': [
    {
      code: 'N40.0',
      description: 'Benign prostatic hyperplasia without lower urinary tract symptoms',
    },
    {
      code: 'N40.1',
      description: 'Benign prostatic hyperplasia with lower urinary tract symptoms',
    },
  ],
  flomax: [
    {
      code: 'N40.0',
      description: 'Benign prostatic hyperplasia without lower urinary tract symptoms',
    },
    {
      code: 'N40.1',
      description: 'Benign prostatic hyperplasia with lower urinary tract symptoms',
    },
  ],

  // Throat - Antiseptics/Lozenges/Sprays
  orofar: [
    { code: 'J02.9', description: 'Acute pharyngitis, unspecified' },
    { code: 'J03.90', description: 'Acute tonsillitis, unspecified' },
    { code: 'J31.2', description: 'Chronic pharyngitis' },
    { code: 'K12.0', description: 'Recurrent oral aphthae' },
  ],
  'orofar spray': [
    { code: 'J02.9', description: 'Acute pharyngitis, unspecified' },
    { code: 'J03.90', description: 'Acute tonsillitis, unspecified' },
  ],
  tanaflex: [
    { code: 'J02.9', description: 'Acute pharyngitis, unspecified' },
    { code: 'J03.90', description: 'Acute tonsillitis, unspecified' },
    { code: 'J31.2', description: 'Chronic pharyngitis' },
    { code: 'K12.1', description: 'Other forms of stomatitis' },
  ],
  'tanaflex spray': [
    { code: 'J02.9', description: 'Acute pharyngitis, unspecified' },
    { code: 'J03.90', description: 'Acute tonsillitis, unspecified' },
  ],
  betadine: [
    { code: 'J02.9', description: 'Acute pharyngitis, unspecified' },
    { code: 'J03.90', description: 'Acute tonsillitis, unspecified' },
    { code: 'K12.1', description: 'Other forms of stomatitis' },
    { code: 'L08.9', description: 'Local infection of skin and subcutaneous tissue, unspecified' },
  ],
  'betadine gargle': [
    { code: 'J02.9', description: 'Acute pharyngitis, unspecified' },
    { code: 'J03.90', description: 'Acute tonsillitis, unspecified' },
    { code: 'K12.1', description: 'Other forms of stomatitis' },
  ],
  'betadine oral': [
    { code: 'J02.9', description: 'Acute pharyngitis, unspecified' },
    { code: 'J03.90', description: 'Acute tonsillitis, unspecified' },
  ],
  'betadine spray': [
    { code: 'J02.9', description: 'Acute pharyngitis, unspecified' },
    { code: 'J03.90', description: 'Acute tonsillitis, unspecified' },
  ],
  'povidone iodine': [
    { code: 'J02.9', description: 'Acute pharyngitis, unspecified' },
    { code: 'L08.9', description: 'Local infection of skin and subcutaneous tissue, unspecified' },
  ],
  benzydamine: [
    { code: 'J02.9', description: 'Acute pharyngitis, unspecified' },
    { code: 'J03.90', description: 'Acute tonsillitis, unspecified' },
    { code: 'K12.1', description: 'Other forms of stomatitis' },
  ],
  strepsils: [
    { code: 'J02.9', description: 'Acute pharyngitis, unspecified' },
    { code: 'J03.90', description: 'Acute tonsillitis, unspecified' },
    { code: 'J31.2', description: 'Chronic pharyngitis' },
  ],
  difflam: [
    { code: 'J02.9', description: 'Acute pharyngitis, unspecified' },
    { code: 'J03.90', description: 'Acute tonsillitis, unspecified' },
    { code: 'K12.1', description: 'Other forms of stomatitis' },
  ],
  'difflam spray': [
    { code: 'J02.9', description: 'Acute pharyngitis, unspecified' },
    { code: 'J03.90', description: 'Acute tonsillitis, unspecified' },
  ],
  tantum: [
    { code: 'J02.9', description: 'Acute pharyngitis, unspecified' },
    { code: 'J03.90', description: 'Acute tonsillitis, unspecified' },
    { code: 'K12.1', description: 'Other forms of stomatitis' },
  ],
  'tantum verde': [
    { code: 'J02.9', description: 'Acute pharyngitis, unspecified' },
    { code: 'J03.90', description: 'Acute tonsillitis, unspecified' },
    { code: 'K12.1', description: 'Other forms of stomatitis' },
  ],
  hexoral: [
    { code: 'J02.9', description: 'Acute pharyngitis, unspecified' },
    { code: 'J03.90', description: 'Acute tonsillitis, unspecified' },
    { code: 'K12.1', description: 'Other forms of stomatitis' },
  ],
  'sore throat': [
    { code: 'J02.9', description: 'Acute pharyngitis, unspecified' },
    { code: 'J03.90', description: 'Acute tonsillitis, unspecified' },
  ],
  pharyngitis: [
    { code: 'J02.9', description: 'Acute pharyngitis, unspecified' },
    { code: 'J31.2', description: 'Chronic pharyngitis' },
  ],
  tonsillitis: [
    { code: 'J03.90', description: 'Acute tonsillitis, unspecified' },
    { code: 'J35.01', description: 'Chronic tonsillitis' },
  ],
  laryngitis: [
    { code: 'J04.0', description: 'Acute laryngitis' },
    { code: 'J37.0', description: 'Chronic laryngitis' },
  ],

  // Pain - NSAIDs Brand Names
  brufen: [
    { code: 'M79.3', description: 'Panniculitis, unspecified' },
    { code: 'M25.50', description: 'Pain in unspecified joint' },
    { code: 'R52', description: 'Pain, unspecified' },
    { code: 'M54.5', description: 'Low back pain' },
  ],
  voltaren: [
    { code: 'M25.50', description: 'Pain in unspecified joint' },
    { code: 'M54.5', description: 'Low back pain' },
    { code: 'M79.1', description: 'Myalgia' },
    { code: 'R52', description: 'Pain, unspecified' },
  ],
  cataflam: [
    { code: 'M25.50', description: 'Pain in unspecified joint' },
    { code: 'M54.5', description: 'Low back pain' },
    { code: 'K08.89', description: 'Other specified disorders of teeth and supporting structures' },
  ],
  panadol: [
    { code: 'R50.9', description: 'Fever, unspecified' },
    { code: 'R51', description: 'Headache' },
    { code: 'R52', description: 'Pain, unspecified' },
    { code: 'M79.1', description: 'Myalgia' },
  ],
  tylenol: [
    { code: 'R50.9', description: 'Fever, unspecified' },
    { code: 'R51', description: 'Headache' },
    { code: 'R52', description: 'Pain, unspecified' },
  ],
  advil: [
    { code: 'R50.9', description: 'Fever, unspecified' },
    { code: 'R51', description: 'Headache' },
    { code: 'M25.50', description: 'Pain in unspecified joint' },
  ],

  // Respiratory - Asthma Brand Names
  ventolin: [
    { code: 'J45.909', description: 'Unspecified asthma, uncomplicated' },
    { code: 'J45.20', description: 'Mild intermittent asthma, uncomplicated' },
    { code: 'J44.1', description: 'Chronic obstructive pulmonary disease with acute exacerbation' },
    { code: 'R06.2', description: 'Wheezing' },
  ],
  seretide: [
    { code: 'J45.909', description: 'Unspecified asthma, uncomplicated' },
    { code: 'J45.30', description: 'Mild persistent asthma, uncomplicated' },
    { code: 'J44.9', description: 'Chronic obstructive pulmonary disease, unspecified' },
  ],
  symbicort: [
    { code: 'J45.909', description: 'Unspecified asthma, uncomplicated' },
    { code: 'J45.40', description: 'Moderate persistent asthma, uncomplicated' },
    { code: 'J44.9', description: 'Chronic obstructive pulmonary disease, unspecified' },
  ],
  pulmicort: [
    { code: 'J45.909', description: 'Unspecified asthma, uncomplicated' },
    { code: 'J45.30', description: 'Mild persistent asthma, uncomplicated' },
  ],
  atrovent: [
    { code: 'J44.9', description: 'Chronic obstructive pulmonary disease, unspecified' },
    { code: 'J45.909', description: 'Unspecified asthma, uncomplicated' },
  ],
  spiriva: [
    { code: 'J44.9', description: 'Chronic obstructive pulmonary disease, unspecified' },
    { code: 'J44.1', description: 'Chronic obstructive pulmonary disease with acute exacerbation' },
  ],

  // GI - Antacids/PPI Brand Names
  nexium: [
    { code: 'K21.0', description: 'Gastro-esophageal reflux disease with esophagitis' },
    {
      code: 'K25.9',
      description:
        'Gastric ulcer, unspecified as acute or chronic, without hemorrhage or perforation',
    },
    { code: 'K29.70', description: 'Gastritis, unspecified, without bleeding' },
  ],
  losec: [
    { code: 'K21.0', description: 'Gastro-esophageal reflux disease with esophagitis' },
    { code: 'K25.9', description: 'Gastric ulcer, unspecified' },
    { code: 'K29.70', description: 'Gastritis, unspecified, without bleeding' },
  ],
  pantoloc: [
    { code: 'K21.0', description: 'Gastro-esophageal reflux disease with esophagitis' },
    { code: 'K25.9', description: 'Gastric ulcer, unspecified' },
  ],
  zantac: [
    { code: 'K21.0', description: 'Gastro-esophageal reflux disease with esophagitis' },
    { code: 'K29.70', description: 'Gastritis, unspecified, without bleeding' },
  ],
  motilium: [
    { code: 'R11.0', description: 'Nausea' },
    { code: 'R11.2', description: 'Nausea with vomiting, unspecified' },
    { code: 'K30', description: 'Functional dyspepsia' },
  ],
  imodium: [
    { code: 'K59.1', description: 'Functional diarrhea' },
    { code: 'A09', description: 'Infectious gastroenteritis and colitis, unspecified' },
  ],
  duphalac: [
    { code: 'K59.00', description: 'Constipation, unspecified' },
    { code: 'K59.09', description: 'Other constipation' },
  ],

  // Cardiovascular Brand Names
  lipitor: [
    { code: 'E78.00', description: 'Pure hypercholesterolemia, unspecified' },
    { code: 'E78.5', description: 'Hyperlipidemia, unspecified' },
  ],
  crestor: [
    { code: 'E78.00', description: 'Pure hypercholesterolemia, unspecified' },
    { code: 'E78.5', description: 'Hyperlipidemia, unspecified' },
  ],
  zocor: [
    { code: 'E78.00', description: 'Pure hypercholesterolemia, unspecified' },
    { code: 'E78.5', description: 'Hyperlipidemia, unspecified' },
  ],
  norvasc: [
    { code: 'I10', description: 'Essential (primary) hypertension' },
    { code: 'I20.9', description: 'Angina pectoris, unspecified' },
  ],
  concor: [
    { code: 'I10', description: 'Essential (primary) hypertension' },
    { code: 'I50.9', description: 'Heart failure, unspecified' },
    { code: 'I25.10', description: 'Atherosclerotic heart disease of native coronary artery' },
  ],
  plavix: [
    { code: 'I25.10', description: 'Atherosclerotic heart disease of native coronary artery' },
    { code: 'I63.9', description: 'Cerebral infarction, unspecified' },
    { code: 'Z95.1', description: 'Presence of aortocoronary bypass graft' },
  ],
  aspirin: [
    { code: 'I25.10', description: 'Atherosclerotic heart disease of native coronary artery' },
    { code: 'I20.9', description: 'Angina pectoris, unspecified' },
    { code: 'R51', description: 'Headache' },
  ],

  // Diabetes Brand Names
  glucophage: [
    { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' },
    { code: 'E11.65', description: 'Type 2 diabetes mellitus with hyperglycemia' },
  ],
  januvia: [
    { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' },
    { code: 'E11.65', description: 'Type 2 diabetes mellitus with hyperglycemia' },
  ],
  amaryl: [
    { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' },
    { code: 'E11.65', description: 'Type 2 diabetes mellitus with hyperglycemia' },
  ],
  lantus: [
    { code: 'E10.9', description: 'Type 1 diabetes mellitus without complications' },
    { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' },
  ],
  novorapid: [
    { code: 'E10.9', description: 'Type 1 diabetes mellitus without complications' },
    { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' },
  ],

  // Antibiotics Brand Names
  augmentin: [
    { code: 'J02.9', description: 'Acute pharyngitis, unspecified' },
    { code: 'J18.9', description: 'Pneumonia, unspecified organism' },
    { code: 'N39.0', description: 'Urinary tract infection, site not specified' },
    { code: 'L03.90', description: 'Cellulitis, unspecified' },
  ],
  zithromax: [
    { code: 'J02.9', description: 'Acute pharyngitis, unspecified' },
    { code: 'J18.9', description: 'Pneumonia, unspecified organism' },
    { code: 'J20.9', description: 'Acute bronchitis, unspecified' },
  ],
  ciprobay: [
    { code: 'N39.0', description: 'Urinary tract infection, site not specified' },
    { code: 'A09', description: 'Infectious gastroenteritis and colitis, unspecified' },
    { code: 'J18.9', description: 'Pneumonia, unspecified organism' },
  ],
  klacid: [
    { code: 'J02.9', description: 'Acute pharyngitis, unspecified' },
    { code: 'J18.9', description: 'Pneumonia, unspecified organism' },
    { code: 'K29.70', description: 'Gastritis, unspecified, without bleeding' },
  ],
  flagyl: [
    { code: 'A07.1', description: 'Giardiasis [lambliasis]' },
    { code: 'K29.70', description: 'Gastritis, unspecified, without bleeding' },
    { code: 'N76.0', description: 'Acute vaginitis' },
  ],

  // Allergy Brand Names
  zyrtec: [
    { code: 'J30.9', description: 'Allergic rhinitis, unspecified' },
    { code: 'L50.9', description: 'Urticaria, unspecified' },
    { code: 'L50.0', description: 'Allergic urticaria' },
  ],
  claritine: [
    { code: 'J30.9', description: 'Allergic rhinitis, unspecified' },
    { code: 'L50.9', description: 'Urticaria, unspecified' },
  ],
  telfast: [
    { code: 'J30.9', description: 'Allergic rhinitis, unspecified' },
    { code: 'L50.9', description: 'Urticaria, unspecified' },
  ],
  aerius: [
    { code: 'J30.9', description: 'Allergic rhinitis, unspecified' },
    { code: 'L50.9', description: 'Urticaria, unspecified' },
  ],
  flixonase: [
    { code: 'J30.9', description: 'Allergic rhinitis, unspecified' },
    { code: 'J30.1', description: 'Allergic rhinitis due to pollen' },
  ],
  nasonex: [
    { code: 'J30.9', description: 'Allergic rhinitis, unspecified' },
    { code: 'J32.9', description: 'Chronic sinusitis, unspecified' },
  ],

  // Mental Health Brand Names
  lexapro: [
    { code: 'F32.9', description: 'Major depressive disorder, single episode, unspecified' },
    { code: 'F41.1', description: 'Generalized anxiety disorder' },
  ],
  zoloft: [
    { code: 'F32.9', description: 'Major depressive disorder, single episode, unspecified' },
    { code: 'F41.1', description: 'Generalized anxiety disorder' },
    { code: 'F40.10', description: 'Social phobia, unspecified' },
  ],
  prozac: [
    { code: 'F32.9', description: 'Major depressive disorder, single episode, unspecified' },
    { code: 'F50.00', description: 'Anorexia nervosa, unspecified' },
  ],
  xanax: [
    { code: 'F41.0', description: 'Panic disorder [episodic paroxysmal anxiety]' },
    { code: 'F41.1', description: 'Generalized anxiety disorder' },
  ],
  stilnox: [
    { code: 'G47.00', description: 'Insomnia, unspecified' },
    { code: 'F51.01', description: 'Primary insomnia' },
  ],
  lyrica: [
    { code: 'G89.29', description: 'Other chronic pain' },
    { code: 'G62.9', description: 'Polyneuropathy, unspecified' },
    { code: 'F41.1', description: 'Generalized anxiety disorder' },
  ],
  neurontin: [
    { code: 'G40.909', description: 'Epilepsy, unspecified, not intractable' },
    { code: 'G89.29', description: 'Other chronic pain' },
    { code: 'G62.9', description: 'Polyneuropathy, unspecified' },
  ],

  // Skin Brand Names
  dermovate: [
    { code: 'L30.9', description: 'Dermatitis, unspecified' },
    { code: 'L40.9', description: 'Psoriasis, unspecified' },
    { code: 'L20.9', description: 'Atopic dermatitis, unspecified' },
  ],
  elocon: [
    { code: 'L30.9', description: 'Dermatitis, unspecified' },
    { code: 'L20.9', description: 'Atopic dermatitis, unspecified' },
  ],
  fucicort: [
    { code: 'L30.9', description: 'Dermatitis, unspecified' },
    { code: 'L08.9', description: 'Local infection of skin and subcutaneous tissue, unspecified' },
  ],
  fucidin: [
    { code: 'L08.9', description: 'Local infection of skin and subcutaneous tissue, unspecified' },
    { code: 'L01.00', description: 'Impetigo, unspecified' },
  ],
  canesten: [
    { code: 'B37.3', description: 'Candidiasis of vulva and vagina' },
    { code: 'B35.3', description: 'Tinea pedis' },
    { code: 'B35.6', description: 'Tinea cruris' },
  ],
  lamisil: [
    { code: 'B35.1', description: 'Tinea unguium' },
    { code: 'B35.3', description: 'Tinea pedis' },
    { code: 'B35.4', description: 'Tinea corporis' },
  ],

  // ED Brand Names
  viagra: [
    { code: 'N52.9', description: 'Male erectile dysfunction, unspecified' },
    { code: 'I27.0', description: 'Primary pulmonary hypertension' },
  ],
  cialis: [
    { code: 'N52.9', description: 'Male erectile dysfunction, unspecified' },
    {
      code: 'N40.0',
      description: 'Benign prostatic hyperplasia without lower urinary tract symptoms',
    },
  ],
  levitra: [{ code: 'N52.9', description: 'Male erectile dysfunction, unspecified' }],

  // Thyroid Brand Names
  euthyrox: [
    { code: 'E03.9', description: 'Hypothyroidism, unspecified' },
    { code: 'E01.8', description: 'Other iodine-deficiency related thyroid disorders' },
  ],
  eltroxin: [{ code: 'E03.9', description: 'Hypothyroidism, unspecified' }],
};
