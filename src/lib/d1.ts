/**
 * Cloudflare D1 client helper
 * Replaces: import { db } from '@/lib/db'  (Prisma)
 * Replaces: import postgres from 'postgres'
 *
 * Usage in API routes (Cloudflare Workers / Next.js on CF Pages):
 *   import { getD1 } from '@/lib/d1'
 *   const db = getD1(request)
 *   const rows = await db.query('SELECT * FROM Drug WHERE id = ?', [id])
 */

// Type declarations for Cloudflare D1
interface D1Database {
  prepare(sql: string): D1PreparedStatement
  batch(statements: D1PreparedStatement[]): Promise<D1Result[]>
}

interface D1PreparedStatement {
  bind(...params: unknown[]): D1PreparedStatement
  all<T>(): Promise<{ results: T[] }>
  first<T>(): Promise<T | null>
  run(): Promise<D1Result>
}

interface D1Result {
  success: boolean
  meta: {
    duration: number
    changes: number
    last_row_id: number
    served_by: string
  }
}

export interface D1Env {
  DB: D1Database
}

/** Extract the D1 binding from the incoming request context */
export function getD1(request: Request): D1Database {
  // Cloudflare Workers injects env via request.cf / globalThis
  const env = (globalThis as unknown as D1Env)
  if (!env.DB) throw new Error('D1 binding "DB" not found. Check wrangler.toml.')
  return env.DB
}

/** Run a SELECT and return typed rows */
export async function query<T = Record<string, unknown>>(
  db: D1Database,
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  const result = await db.prepare(sql).bind(...params).all<T>()
  return result.results
}

/** Run a SELECT and return the first row or null */
export async function queryOne<T = Record<string, unknown>>(
  db: D1Database,
  sql: string,
  params: unknown[] = []
): Promise<T | null> {
  const result = await db.prepare(sql).bind(...params).first<T>()
  return result ?? null
}

/** Run an INSERT / UPDATE / DELETE */
export async function execute(
  db: D1Database,
  sql: string,
  params: unknown[] = []
): Promise<D1Result> {
  return db.prepare(sql).bind(...params).run()
}

/** Run multiple statements in a single batch (atomic) */
export async function batch(
  db: D1Database,
  statements: { sql: string; params?: unknown[] }[]
): Promise<D1Result[]> {
  const prepared = statements.map(s =>
    s.params?.length
      ? db.prepare(s.sql).bind(...s.params)
      : db.prepare(s.sql)
  )
  return db.batch(prepared)
}
