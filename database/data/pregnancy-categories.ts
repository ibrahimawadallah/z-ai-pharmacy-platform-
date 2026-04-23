// Pregnancy category data for common medications
export const pregnancyCategories: Record<
  string,
  { category: string; description: string; recommendation: string }
> = {
  metformin: {
    category: 'B',
    description:
      'Animal studies have not shown risk to the fetus, but there are no adequate studies in pregnant women.',
    recommendation:
      'Generally considered safe during pregnancy, especially for gestational diabetes.',
  },
  lisinopril: {
    category: 'D',
    description:
      'There is positive evidence of human fetal risk, but the benefits may outweigh the risks in certain situations.',
    recommendation:
      'Should be avoided during pregnancy, especially in the second and third trimesters.',
  },
  aspirin: {
    category: 'C/D',
    description: 'Category C in first and second trimesters, Category D in third trimester.',
    recommendation:
      'Low-dose aspirin may be used in certain high-risk pregnancies under medical supervision. Avoid in third trimester.',
  },
  atorvastatin: {
    category: 'X',
    description:
      'Studies in animals or humans have demonstrated fetal abnormalities or there is evidence of fetal risk.',
    recommendation: 'Contraindicated during pregnancy.',
  },
  levothyroxine: {
    category: 'A',
    description: 'Adequate studies in pregnant women have not shown risk to the fetus.',
    recommendation: 'Safe to use during pregnancy. Dosage may need adjustment.',
  },
  amlodipine: {
    category: 'C',
    description:
      'Animal studies have shown adverse effects on the fetus, but there are no adequate studies in humans.',
    recommendation: 'Use only if potential benefit justifies the potential risk to the fetus.',
  },
  omeprazole: {
    category: 'C',
    description:
      'Animal studies have shown adverse effects on the fetus, but there are no adequate studies in humans.',
    recommendation: 'Use only if potential benefit justifies the potential risk to the fetus.',
  },
  albuterol: {
    category: 'C',
    description:
      'Animal studies have shown adverse effects on the fetus, but there are no adequate studies in humans.',
    recommendation:
      'Generally considered acceptable for use during pregnancy when needed for asthma control.',
  },
  insulin: {
    category: 'B',
    description:
      'Animal studies have not shown risk to the fetus, but there are no adequate studies in pregnant women.',
    recommendation:
      'Safe to use during pregnancy. Often the preferred treatment for diabetes in pregnancy.',
  },
  ozempic: {
    category: 'C',
    description:
      'Animal studies have shown adverse effects on the fetus, but there are no adequate studies in humans.',
    recommendation:
      'Not recommended during pregnancy. Alternative treatments should be considered.',
  },
};

// FDA Pregnancy Category Descriptions
export const categoryDescriptions: Record<string, string> = {
  A: 'Adequate and well-controlled studies have failed to demonstrate a risk to the fetus in the first trimester of pregnancy (and there is no evidence of risk in later trimesters).',
  B: 'Animal reproduction studies have failed to demonstrate a risk to the fetus and there are no adequate and well-controlled studies in pregnant women.',
  C: 'Animal reproduction studies have shown an adverse effect on the fetus and there are no adequate and well-controlled studies in humans, but potential benefits may warrant use of the drug in pregnant women despite potential risks.',
  D: 'There is positive evidence of human fetal risk based on adverse reaction data from investigational or marketing experience or studies in humans, but potential benefits may warrant use of the drug in pregnant women despite potential risks.',
  X: 'Studies in animals or humans have demonstrated fetal abnormalities and/or there is positive evidence of human fetal risk based on adverse reaction data from investigational or marketing experience, and the risks involved in use of the drug in pregnant women clearly outweigh potential benefits.',
};
