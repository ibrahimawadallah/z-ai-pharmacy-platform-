import { describe, it, expect, beforeEach, vi } from 'vitest'

const findUnique = vi.fn()
const update = vi.fn()
const create = vi.fn()

vi.mock('@/lib/db', () => ({
  db: {
    user: {
      findUnique: (...args: unknown[]) => findUnique(...args),
      update: (...args: unknown[]) => update(...args),
      create: (...args: unknown[]) => create(...args),
    },
  },
}))

import {
  ensureAdminUser,
  getConfiguredAdminCredentials,
  upsertAdminUser,
  DEFAULT_ADMIN_EMAIL,
} from './admin-bootstrap'

describe('admin-bootstrap', () => {
  beforeEach(() => {
    findUnique.mockReset()
    update.mockReset()
    create.mockReset()
    delete process.env.ADMIN_EMAIL
    delete process.env.ADMIN_PASSWORD
    delete process.env.ADMIN_NAME
  })

  it('falls back to default admin credentials when env is unset', () => {
    const creds = getConfiguredAdminCredentials()
    expect(creds.email).toBe(DEFAULT_ADMIN_EMAIL)
    expect(creds.password).toBe('Admin123456!')
    expect(creds.name).toBe('System Administrator')
  })

  it('normalizes admin email from env to lowercase', () => {
    process.env.ADMIN_EMAIL = '  Admin@DrugEye.COM  '
    const creds = getConfiguredAdminCredentials()
    expect(creds.email).toBe('admin@drugeye.com')
  })

  it('creates admin user when missing', async () => {
    findUnique.mockResolvedValueOnce(null)
    create.mockResolvedValueOnce({
      id: 'u1',
      email: 'admin@drugeye.com',
      name: 'System Administrator',
      role: 'admin',
      isVerified: true,
      createdAt: new Date(),
    })

    const user = await upsertAdminUser({
      email: 'Admin@DrugEye.com',
      password: 'pw12345678',
      name: 'Admin',
    })

    expect(create).toHaveBeenCalledOnce()
    const arg = create.mock.calls[0][0]
    expect(arg.data.email).toBe('admin@drugeye.com')
    expect(arg.data.role).toBe('admin')
    expect(arg.data.isVerified).toBe(true)
    expect(arg.data.password).not.toBe('pw12345678')
    expect(user.email).toBe('admin@drugeye.com')
  })

  it('updates existing admin and resets password by default', async () => {
    findUnique.mockResolvedValueOnce({ id: 'u1', email: 'admin@drugeye.com' })
    update.mockResolvedValueOnce({
      id: 'u1',
      email: 'admin@drugeye.com',
      name: 'Admin',
      role: 'admin',
      isVerified: true,
      createdAt: new Date(),
    })

    await upsertAdminUser(
      { email: 'admin@drugeye.com', password: 'newpw1234' },
      { resetPassword: true },
    )

    expect(update).toHaveBeenCalledOnce()
    const arg = update.mock.calls[0][0]
    expect(arg.data.password).toBeDefined()
    expect(arg.data.role).toBe('admin')
  })

  it('preserves existing password when resetPassword=false', async () => {
    findUnique.mockResolvedValueOnce({ id: 'u1', email: 'admin@drugeye.com' })
    update.mockResolvedValueOnce({
      id: 'u1',
      email: 'admin@drugeye.com',
      name: 'Admin',
      role: 'admin',
      isVerified: true,
      createdAt: new Date(),
    })

    await upsertAdminUser(
      { email: 'admin@drugeye.com', password: 'newpw1234' },
      { resetPassword: false },
    )

    const arg = update.mock.calls[0][0]
    expect(arg.data.password).toBeUndefined()
  })

  it('ensureAdminUser is a no-op when email does not match configured admin', async () => {
    process.env.ADMIN_EMAIL = 'admin@drugeye.com'
    await ensureAdminUser('someone-else@example.com')
    expect(findUnique).not.toHaveBeenCalled()
    expect(create).not.toHaveBeenCalled()
  })

  it('ensureAdminUser bootstraps when admin row is missing', async () => {
    findUnique.mockResolvedValueOnce(null)
    findUnique.mockResolvedValueOnce(null)
    create.mockResolvedValueOnce({
      id: 'u1',
      email: 'admin@drugeye.com',
      name: 'System Administrator',
      role: 'admin',
      isVerified: true,
      createdAt: new Date(),
    })

    await ensureAdminUser('admin@drugeye.com')

    expect(create).toHaveBeenCalledOnce()
  })

  it('ensureAdminUser leaves existing admin alone when role is correct', async () => {
    findUnique.mockResolvedValueOnce({ id: 'u1', role: 'admin' })

    await ensureAdminUser('admin@drugeye.com')

    expect(update).not.toHaveBeenCalled()
    expect(create).not.toHaveBeenCalled()
  })
})
