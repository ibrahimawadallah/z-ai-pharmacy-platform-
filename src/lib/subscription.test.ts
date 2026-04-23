import { describe, it, expect, vi } from 'vitest'
import { getPlanById, SUBSCRIPTION_PLANS } from './subscription-config'

describe('Subscription Logic', () => {
  it('should retrieve correct plan details by ID', () => {
    const proPlan = getPlanById('pro')
    expect(proPlan.name).toBe('Pharmacist Pro')
    expect(proPlan.price).toBe(149)
    expect(proPlan.limits.analyticsAccess).toBe(true)
  })

  it('should fallback to basic plan for invalid IDs', () => {
    const invalidPlan = getPlanById('invalid-id')
    expect(invalidPlan.id).toBe('basic')
    expect(invalidPlan.price).toBe(0)
  })

  it('should have three defined tiers', () => {
    expect(SUBSCRIPTION_PLANS.length).toBe(3)
    const ids = SUBSCRIPTION_PLANS.map(p => p.id)
    expect(ids).toContain('basic')
    expect(ids).toContain('pro')
    expect(ids).toContain('enterprise')
  })

  it('should have appropriate limits for enterprise tier', () => {
    const enterprise = getPlanById('enterprise')
    expect(enterprise.limits.customIntegrations).toBe(true)
    expect(enterprise.limits.storageLimit).toBeGreaterThan(10000)
  })
})