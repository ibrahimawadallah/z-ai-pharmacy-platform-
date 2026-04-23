# Full-Scale Drug Database Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix all TypeScript errors and build comprehensive drug database with ~19,000 UAE drugs enriched with clinical data (interactions, pregnancy, G6PD, side effects, ICD-10 mappings) using DailyMed API and existing data files.

**Architecture:** 
- Phase 1: Fix TypeScript errors in critical files
- Phase 2: Create data import scripts that load existing clinical data files
- Phase 3: Build DailyMed API enrichment pipeline for remaining drugs
- Phase 4: Import UAE drug list and verify data coverage

**Tech Stack:** TypeScript, Prisma, PostgreSQL (Neon), DailyMed API, Vercel AI SDK

---

## Part 1: TypeScript Error Fixes

### Task 1: Fix src/app/api/chat/route.ts

**Files:**
- Modify: `src/app/api/chat/route.ts`

**Issue:** AI SDK tool types - The tool() function signature has changed in newer versions

**Step 1: Read the current implementation**

Run: `cat src/app/api/chat/route.ts | head -100`

**Step 2: Update the tool definitions**

The issue is that `tool` from 'ai' package expects a specific return type. Replace the execute function returns with proper typing.

```typescript
// Replace tool definitions with proper return types
const drugLookupTool = tool({
  description: 'Look up drug information from the UAE MOH database',
  parameters: z.object({
    drugName: z.string()
  }),
  execute: async ({ drugName }: { drugName: string }) => {
    // ... existing code
    return { found: true, drugName, drug: {...}, message: '' } as const
  }
});
```

**Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit src/app/api/chat/route.ts --skipLibCheck 2>&1 | head -20`

Expected: No errors (or errors reduced)

---

### Task 2: Fix src/app/api/admin/populate-clinical/route.ts

**Files:**
- Modify: `src/app/api/admin/populate-clinical/route.ts:82,218,239,240,248,254`

**Issue:** Duplicate properties in object literals

**Step 1: Find duplicate properties**

Run: `Select-String -Path "src/app/api/admin/populate-clinical/route.ts" -Pattern "^\\s+\\w+:" | Select-Object -First 30`

**Step 2: Identify and remove duplicates**

Common duplicates: `data: { ...data, ...data }` - remove the spread

**Step 3: Fix Prisma type errors**

The issue at line 294+ is that TypeScript thinks the update object is `never`. This happens when there's a type mismatch.

```typescript
// Fix: Explicitly type the update data
const updateData = {
  pregnancyCategory: item.pregnancyCategory || null,
  pregnancyPrecautions: item.pregnancyPrecautions || null,
  breastfeedingSafety: item.breastfeedingSafety || null,
  g6pdSafety: item.g6pdSafety || null,
  g6pdWarning: item.g6pdWarning || null,
  baseDoseMgPerKg: item.baseDoseMgPerKg || null,
  baseDoseIndication: item.baseDoseIndication || null,
} as const;

await prisma.drug.update({ where: { id: item.id }, data: updateData });
```

---

### Task 3: Fix src/app/api/admin/import-interactions/route.ts

**Files:**
- Modify: `src/app/api/admin/import-interactions/route.ts:162`

**Issue:** Unknown property 'mechanism' in DrugInteractionCreateInput

**Step 1: Check Prisma schema for DrugInteraction**

Run: `Select-String -Path "prisma/schema.prisma" -Pattern "model DrugInteraction" -Context 0,20`

**Step 2: Add missing field to Prisma schema if needed, or remove from object**

If `mechanism` doesn't exist in schema, remove it from the create call:

```typescript
// Remove mechanism if not in schema
await prisma.drugInteraction.create({
  data: {
    drugId: drug.id,
    secondaryDrugName: interaction.drug2,
    severity: interaction.severity,
    description: interaction.description,
    // Remove: mechanism: interaction.mechanism,
  }
});
```

---

### Task 4: Fix src/lib/auth-options.ts

**Files:**
- Modify: `src/lib/auth-options.ts:16,40`

**Issue:** Cannot augment 'next-auth' module - it's untyped

**Step 1: Replace module augmentation with declaration**

```typescript
// Replace this:
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
    }
  }
}

// With this (or use type instead):
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user?: {
      id: string
      role: string
    } & DefaultSession['user']
  }
}
```

**Step 2: For JWT, use separate declaration**

```typescript
declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
  }
}
```

---

### Task 5: Fix src/lib/external-data-service.ts

**Files:**
- Modify: `src/lib/external-data-service.ts:39`

**Issue:** Duplicate property in object literal

**Step 1: Find the duplicate**

Run: `Get-Content src/lib/external-data-service.ts | Select-String -Pattern "^\\s+\\w+:" | Group-Object | Where-Object { $_.Count -gt 1 }`

**Step 2: Remove duplicate**

---

### Task 6: Fix src/components/MotionWrapper.tsx

**Files:**
- Modify: `src/components/MotionWrapper.tsx:11`

**Issue:** 'Motion' does not exist on framer-motion, should be 'motion'

**Step 1: Fix import**

```typescript
// Change this:
import { Motion } from 'framer-motion'

// To this:
import { motion } from 'framer-motion'
// And use <motion.div> instead of <Motion.div>
```

---

## Part 2: Data Import Architecture

### Task 7: Create Data Import Script

**Files:**
- Create: `scripts/import-all-drugs.ts`

**Step 1: Create the main import script structure**

```typescript
import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

const prisma = new PrismaClient()

interface DrugData {
  drugCode: string
  packageName: string
  genericName: string
  strength: string
  dosageForm: string
  status: string
}

interface ClinicalData {
  pregnancyCategory?: string
  pregnancyPrecautions?: string
  breastfeedingSafety?: string
  g6pdSafety?: string
  g6pdWarning?: string
  baseDoseMgPerKg?: number
  baseDoseIndication?: string
}

async function importDrugs() {
  console.log('Starting drug import...')
  
  // 1. Load UAE drug list
  // 2. Load existing clinical data
  // 3. Match and import
  // 4. Report results
}

importDrugs()
  .then(() => console.log('Import complete'))
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

**Step 2: Add data loading functions**

```typescript
import drugInteractionDatabase from '../../database/data/drug-interactions.ts'
import pregnancyCategories from '../../database/data/pregnancy-categories.ts'
import drugIcd10Mappings from '../../database/data/uae-drugs-complete-icd10-mappings.json'
```

---

### Task 8: Run Initial Data Import

**Step 1: Run the import script**

Run: `npx tsx scripts/import-all-drugs.ts`

Expected: Logs showing imported counts

**Step 2: Verify data**

```typescript
const counts = await Promise.all([
  prisma.drug.count(),
  prisma.drugInteraction.count(),
  prisma.drugSideEffect.count(),
  prisma.iCD10Mapping.count(),
])
console.log('Drugs:', counts[0])
console.log('Interactions:', counts[1])
console.log('SideEffects:', counts[2])
console.log('ICD10Mappings:', counts[3])
```

---

## Part 3: DailyMed Enrichment

### Task 9: Create DailyMed Enrichment Script

**Files:**
- Create: `scripts/enrich-from-dailymed.ts`

**Step 1: Create the enrichment script**

```typescript
import { PrismaClient } from '@prisma/client'
import https from 'https'

const prisma = new PrismaClient()

// Fetch from DailyMed API
async function fetchDailyMedData(ingredient: string) {
  const url = `https://dailymed.nlm.nih.gov/dailymed/services/v2/spls.xml?pagesize=50&search=${encodeURIComponent(ingredient)}`
  // ... fetch and parse XML
}

// Process drugs without clinical data
async function enrichDrugs() {
  const drugs = await prisma.drug.findMany({
    where: {
      OR: [
        { pregnancyCategory: null },
        { g6pdSafety: null }
      ]
    },
    take: 1000 // Process in batches
  })
  
  for (const drug of drugs) {
    const clinicalData = await fetchDailyMedData(drug.genericName)
    if (clinicalData) {
      await prisma.drug.update({
        where: { id: drug.id },
        data: clinicalData
      })
    }
  }
}

enrichDrugs()
  .then(() => console.log('Enrichment complete'))
  .finally(() => prisma.$disconnect())
```

---

### Task 10: Run DailyMed Enrichment

**Step 1: Test with small batch first**

Run: `npx tsx scripts/enrich-from-dailymed.ts --dry-run`

**Step 2: Run full enrichment (may take hours for 19k drugs)**

Run: `npx tsx scripts/enrich-from-dailymed.ts`

---

## Part 4: Verification

### Task 11: Verify Data Quality

**Step 1: Run verification script**

```typescript
const stats = {
  totalDrugs: await prisma.drug.count(),
  withPregnancy: await prisma.drug.count({ where: { pregnancyCategory: { not: null } } }),
  withG6PD: await prisma.drug.count({ where: { g6pdSafety: { not: null } } }),
  withInteractions: await prisma.drug.count({ where: { interactions: { some: {} } } }),
  withSideEffects: await prisma.drug.count({ where: { sideEffects: { some: {} } } }),
  withICD10: await prisma.drug.count({ where: { icd10Codes: { some: {} } } }),
}

console.table(stats)
```

Expected output:
```
┌─────────────────────┬────────┐
│ Metric              │ Count  │
├─────────────────────┼────────┤
│ Total Drugs         │ 19000  │
│ With Pregnancy      │ 15000  │
│ With G6PD           │ 12000  │
│ With Interactions   │ 8000   │
│ With Side Effects   │ 10000  │
│ With ICD10          │ 18000  │
└─────────────────────┴────────┘
```

---

## Execution Commands Summary

```bash
# TypeScript fixes
npx tsc --noEmit --skipLibCheck

# Data import
npx tsx scripts/import-all-drugs.ts

# DailyMed enrichment  
npx tsx scripts/enrich-from-dailymed.ts

# Verification
npx tsx scripts/verify-data.ts
```

---

**Plan complete and saved to `docs/plans/2026-04-23-drug-database-full-scale.md`.**

**Two execution options:**

1. **Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

2. **Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

Which approach?