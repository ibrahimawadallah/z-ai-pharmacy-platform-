# PostgreSQL (Prisma) vs Cloudflare D1 — Comparison

## Architecture

| | PostgreSQL + Prisma | Cloudflare D1 |
|---|---|---|
| Engine | PostgreSQL 15 (Prisma.io hosted) | SQLite (distributed at edge) |
| ORM / Client | Prisma Client + raw `postgres` driver | Raw SQL via `D1Database` binding |
| Connection model | TCP connection pool (max 1–10) | HTTP-based, stateless, no pool needed |
| Runtime | Node.js (Next.js server) | Edge (Cloudflare Workers) |
| Cold start | ~200–500ms (connection setup) | ~0ms (no connection, binding is local) |

---

## Query Syntax

### PostgreSQL (Prisma ORM)
```ts
// Prisma
const drugs = await db.drug.findMany({
  where: { status: 'Active', packageName: { contains: q, mode: 'insensitive' } },
  take: 20, skip: 0
})

// Raw postgres driver
const rows = await sql`SELECT * FROM "Drug" WHERE status = ${status} AND "packageName" ILIKE ${'%' + q + '%'}`
```

### Cloudflare D1
```ts
const drugs = await db.prepare(
  `SELECT * FROM Drug WHERE status = ? AND packageName LIKE ? LIMIT ? OFFSET ?`
).bind(status, `%${q}%`, 20, 0).all()
```

**Key differences:**
- D1 uses `?` positional params (SQLite style), Postgres uses `$1/$2` or tagged template literals
- D1 has no `ILIKE` — use `LIKE` (case-insensitive by default in SQLite with `COLLATE NOCASE` or `LOWER()`)
- No Prisma schema / migrations — use raw `CREATE TABLE` SQL or Wrangler migrations

---

## Performance

| Metric | PostgreSQL | D1 |
|---|---|---|
| Read latency (cold) | 50–200ms | 1–5ms (edge cache hit) |
| Read latency (warm) | 5–20ms | 1–5ms |
| Write latency | 5–30ms | 10–50ms (replicates globally) |
| Concurrent reads | High (connection pool) | Very high (edge replicas) |
| Concurrent writes | High | Limited (single primary) |
| Max DB size | Unlimited | 10 GB (free: 500 MB) |
| Max row size | 1 GB | 1 MB |

---

## Features

| Feature | PostgreSQL | D1 |
|---|---|---|
| Full-text search | `tsvector` / `pg_trgm` | FTS5 extension |
| JSON columns | `jsonb` (indexed) | `JSON` (text, no index) |
| Array columns | Native `TEXT[]` | Not supported (use JSON) |
| Transactions | Full ACID | Full ACID (SQLite WAL) |
| Migrations | Prisma Migrate | `wrangler d1 migrations apply` |
| Backups | Automatic (Prisma.io) | Time-travel (30 days, paid) |
| Replication | Manual / read replicas | Automatic global read replicas |
| `ILIKE` | ✅ | ❌ (use `LOWER(col) LIKE LOWER(?)`) |
| `NOW()` | ✅ | `datetime('now')` |
| `CUID / UUID` | `gen_random_uuid()` | Must generate in app code |

---

## Cost

| | PostgreSQL (Prisma.io) | D1 |
|---|---|---|
| Free tier | 1 DB, 1 GB | 5 GB storage, 5M reads/day, 100K writes/day |
| Paid | ~$15/mo (starter) | ~$0.001 per 1M reads beyond free |
| Egress | Charged | Free (edge, no egress) |

---

## Migration Checklist

- [x] `wrangler.toml` — D1 binding configured
- [x] `src/lib/d1.ts` — D1 query helpers (`query`, `queryOne`, `execute`, `batch`)
- [x] `src/lib/auth-options.ts` — removed `PrismaAdapter` + `postgres`, uses D1 directly
- [x] `src/app/api/drugs/search/route.ts` — D1 + `export const runtime = 'edge'`
- [x] `src/app/api/drugs/[id]/route.ts` — D1
- [x] `src/app/api/drugs/interactions/route.ts` — D1
- [x] `src/app/api/drugs/stats/route.ts` — D1 (single aggregation query replaces 5 Prisma calls)
- [ ] Remaining API routes (patients, auth/signup, admin, etc.)
- [ ] Schema migration: `wrangler d1 migrations create drug-eye init`
- [ ] Data migration: export Postgres → import to D1 via `wrangler d1 execute`

---

## Schema Differences to Watch

```sql
-- PostgreSQL (Prisma)               -- D1 (SQLite)
TEXT[]                                TEXT (store as JSON)
BOOLEAN                               INTEGER (0/1)
TIMESTAMP WITH TIME ZONE              TEXT (ISO 8601)
SERIAL / gen_random_uuid()            TEXT (generate cuid in app)
"CaseSensitiveTable"                  CaseSensitiveTable (no quotes needed)
ILIKE '%query%'                       LIKE '%query%' (SQLite is case-insensitive for ASCII)
NOW()                                 datetime('now')
```

---

## When to Use Which

**Use PostgreSQL + Prisma when:**
- Complex relational queries with joins across many tables
- Heavy write workloads (bulk imports, transactions)
- Need `jsonb`, arrays, full PostGIS, or advanced extensions
- Team prefers type-safe ORM over raw SQL

**Use Cloudflare D1 when:**
- Global low-latency reads are critical (pharmacy lookups, drug search)
- Deploying on Cloudflare Pages/Workers (zero cold start)
- Cost is a concern (generous free tier)
- Read-heavy workload (drug database is mostly reads)
- Want to eliminate connection pool management entirely
