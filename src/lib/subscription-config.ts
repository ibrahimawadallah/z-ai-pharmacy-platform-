export type SubscriptionPlan = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    storageLimit: number;
    analyticsAccess: boolean;
    prioritySupport: boolean;
    customIntegrations: boolean;
  };
};

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Essential tools for UAE pharmacy and medical use.',
    price: 0,
    currency: 'AED',
    interval: 'month',
    features: [
      'Daily MOH Drug List Sync',
      'Basic Interaction Checker',
      'Clinical Academy Access',
      'Personal Favorites (Up to 100)'
    ],
    limits: {
      storageLimit: 100,
      analyticsAccess: false,
      prioritySupport: false,
      customIntegrations: false
    }
  },
  {
    id: 'pro',
    name: 'Pharmacist Pro',
    description: 'Advanced intelligence for individual UAE healthcare practitioners.',
    price: 149,
    currency: 'AED',
    interval: 'month',
    features: [
      'Everything in Student',
      'Advanced Multi-Vector Interactions',
      'Patient Medication Profiles',
      'CPD Certificate Generation',
      'Unlimited Favorites & History',
      'Priority Pharmacist Support'
    ],
    limits: {
      storageLimit: 10000,
      analyticsAccess: true,
      prioritySupport: true,
      customIntegrations: false
    }
  },
  {
    id: 'enterprise',
    name: 'Hospital Enterprise',
    description: 'Full-scale integration for medical institutions and clinics.',
    price: 999,
    currency: 'AED',
    interval: 'month',
    features: [
      'Everything in Pro',
      'Custom HIS/EMR API Integrations',
      'Institution-wide Analytics',
      'Dedicated Account Manager',
      'SLA-backed 24/7 Support',
      'Multi-user License Management'
    ],
    limits: {
      storageLimit: 999999,
      analyticsAccess: true,
      prioritySupport: true,
      customIntegrations: true
    }
  }
];

export function getPlanById(planId: string) {
  return SUBSCRIPTION_PLANS.find(plan => plan.id === planId) || SUBSCRIPTION_PLANS[0];
}
