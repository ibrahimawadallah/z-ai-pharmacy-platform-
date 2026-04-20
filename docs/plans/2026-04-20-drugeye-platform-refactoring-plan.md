# DrugEye Platform Refactoring Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the DrugEye platform into a high-performance, intelligent clinical command center by archiving non-core modules, enhancing the drug search results page with comprehensive clinical data, implementing a weight-based dose calculator, and establishing robust data engineering practices.

**Architecture:** Modular refactoring approach preserving existing functionality while enhancing clinical utility. Archived modules remain accessible but removed from main navigation. Drug details page expanded with specialized clinical sections. Backend enhanced with fallback data sourcing mechanisms.

**Tech Stack:** Next.js 16, React 19, TypeScript, Prisma ORM, PostgreSQL, Tailwind CSS, shadcn/ui

---

### Phase 1: Foundation - Archiving and Visual Updates

#### Task 1: Create Archived Directory Structure

**Files:**
- Create: `src/app/archived/patients/page.tsx`
- Create: `src/app/archived/shortages/page.tsx`  
- Create: `src/app/archived/adr/page.tsx`
- Create: `src/app/archived/pipeline/page.tsx`
- Create: `src/app/archived/courses/page.tsx`

**Step 1: Create archived directory**
```bash
mkdir -p src/app/archived
```

**Step 2: Move patients module**
```bash
cp src/app/(app)/patients/page.tsx src/app/archived/patients/page.tsx
```

**Step 3: Move shortages module**
```bash
cp src/app/(app)/shortages/page.tsx src/app/archived/shortages/page.tsx
```

**Step 4: Move ADR module**
```bash
cp src/app/(app)/adr/page.tsx src/app/archived/adr/page.tsx
```

**Step 5: Move pipeline module**
```bash
cp src/app/(app)/pipeline/page.tsx src/app/archived/pipeline/page.tsx
```

**Step 6: Move courses module**
```bash
cp src/app/(app)/courses/page.tsx src/app/archived/courses/page.tsx
```

**Step 7: Verify files exist**
```bash
ls -la src/app/archived/
```

**Step 8: Commit**
```bash
git add src/app/archived/
git commit -m "feat: create archived directory structure for non-core modules"
```

#### Task 2: Update Navigation to Remove Archived Module Links

**Files:**
- Modify: `src/components/ui/navigation-menu.tsx:1-50`
- Modify: `src/components/layout/AppLayout.tsx:1-50`
- Modify: `src/app/layout.tsx:1-20` (if navigation exists there)

**Step 1: Identify navigation components**
```bash
grep -r "Patients\|Shortages\|ADR\|Pipeline\|Courses" src/components/ --include="*.tsx"
```

**Step 2: Modify navigation-menu.tsx to remove archived module links**
```bash
# Edit file to remove nav items for archived modules
```

**Step 3: Modify AppLayout.tsx if it contains navigation**
```bash
# Edit file to remove nav items for archived modules
```

**Step 4: Verify navigation still works for core modules**
```bash
# Manual check or write test
```

**Step 5: Commit**
```bash
git add src/components/ui/navigation-menu.tsx src/components/layout/AppLayout.tsx
git commit -m "feat: remove archived modules from main navigation"
```

#### Task 3: Implement Glassmorphism Logo Update

**Files:**
- Modify: `src/app/layout.tsx:57-62` (icon configuration)
- Create: `src/components/logo/DrugEyeLogo.tsx` (new component)
- Modify: `src/app/layout.tsx:106-126` (to use new logo component)

**Step 1: Create new DrugEyeLogo component**
```bash
# Create glassmorphism logo component with CSS
```

**Step 2: Update layout.tsx to use new logo**
```bash
# Replace icon configuration with new component
```

**Step 3: Add glassmorphism CSS to globals.css or component**
```bash
# Add CSS for glassmorphism effect
```

**Step 4: Verify logo appears correctly in both light/dark modes**
```bash
# Visual verification
```

**Step 5: Commit**
```bash
git add src/components/logo/DrugEyeLogo.tsx src/app/layout.tsx src/styles/globals.css
git commit -m "feat: implement glassmorphism DrugEye logo"
```

### Phase 2: Clinical Data Enhancement

#### Task 4: Enhance Drug Model for Pregnancy and G6PD Data

**Files:**
- Modify: `prisma/schema.prisma:177-228` (Drug model)

**Step 1: Add pregnancy safety fields to Drug model**
```prisma
pregnancyCategory   String?     // A, B, C, D, X or AU categories
pregnancyPrecautions String?    // Text field for precautions
breastfeedingSafety String?    // Already exists, enhance usage
```

**Step 2: Add G6PD safety fields**
```prisma
g6pdSafety          String?     // Safe, Contraindicated, Caution
g6pdWarning         String?    // Text explanation when not safe
```

**Step 3: Apply database migration**
```bash
npx prisma migrate dev --name add-pregnancy-g6pd-fields
```

**Step 4: Commit**
```bash
git add prisma/schema.prisma
git commit -m "feat: extend drug model with pregnancy and g6pd safety fields"
```

#### Task 5: Implement Pregnancy Safety Display in Drug Details Page

**Files:**
- Modify: `src/app/(app)/drug/[id]/page.tsx:180-250` (Card content area)
- Create: `src/components/medical/PregnancySafetyPanel.tsx` (new component)

**Step 1: Create PregnancySafetyPanel component**
```bash
# Create component that displays pregnancy category and precautions
```

**Step 2: Modify drug details page to fetch and display pregnancy data**
```bash
# Update getDrugDetails to include pregnancy data
# Add PregnancySafetyPanel to UI
```

**Step 3: Add styling for pregnancy safety categories**
```bash
# Add CSS classes for different risk levels
```

**Step 4: Test with known drugs**
```bash
# Verify display for drugs with known pregnancy categories
```

**Step 5: Commit**
```bash
git add src/components/medical/PregnancySafetyPanel.tsx src/app/(app)/drug/[id]/page.tsx
git commit -m "feat: add pregnancy safety display to drug details"
```

#### Task 6: Implement G6PD Safety Alert System

**Files:**
- Modify: `src/app/(app)/drug/[id]/page.tsx:180-250`
- Create: `src/components/medical/G6PDSafetyAlert.tsx` (new component)

**Step 1: Create G6PDSafetyAlert component**
```bash
# Create high-visibility alert component
```

**Step 2: Modify drug details page to display G6PD alert**
```bash
# Update to show prominent alert when g6pdSafety indicates risk
```

**Step 3: Implement always-visible section (shows safe status when applicable)**
```bash
# Ensure section always visible, showing appropriate status
```

**Step 4: Add styling for high-visibility alert**
```bash
# Red/yellow styling for immediate attention
```

**Step 5: Test with contraindicated and safe drugs**
```bash
# Verify alert appears correctly for both cases
```

**Step 6: Commit**
```bash
git add src/components/medical/G6PDSafetyAlert.tsx src/app/(app)/drug/[id]/page.tsx
git commit -m "feat: implement g6pd safety alert system"
```

#### Task 7: Enhance Clinical Data Tabs with Better Organization

**Files:**
- Modify: `src/app/(app)/drug/[id]/page.tsx:224-340` (Tabs content)
- Create: `src/components/medical/EnhancedSideEffectsTab.tsx`
- Create: `src/components/medical/EnhancedIndicationsTab.tsx`  
- Create: `src/components/medical/EnhancedContraindicationsTab.tsx`

**Step 1: Create enhanced side effects tab component**
```bash
# Organize by frequency and severity with visual indicators
```

**Step 2: Create enhanced indications tab component**
```bash
# Show FDA-approved uses, evidence levels, off-label markings
```

**Step 3: Create enhanced contraindications tab component**
```bash
# Distinguish absolute vs relative contraindications
```

**Step 4: Update drug details page to use new tab components**
```bash
# Replace existing tab content with enhanced versions
```

**Step 5: Add frequency-based organization to side effects**
```bash
# Very Common (>10%), Common (1-10%), Uncommon (0.1-1%), Rare (<0.1%)
```

**Step 6: Commit**
```bash
git add src/components/medical/EnhancedSideEffectsTab.tsx src/components/medical/EnhancedIndicationsTab.tsx src/components/medical/EnhancedContraindicationsTab.tsx src/app/(app)/drug/[id]/page.tsx
git commit -m "feat: enhance clinical data tabs with better organization"
```

### Phase 3: Dose Calculator and Advanced Features

#### Task 8: Add Base Dose Field to Drug Model

**Files:**
- Modify: `prisma/schema.prisma:177-228` (Drug model)

**Step 1: Add base dose fields**
```prisma
baseDoseMgPerKg     Float?      // Base dose in mg/kg for calculation
baseDoseIndication  String?     // Indication for which base dose applies
```

**Step 2: Apply database migration**
```bash
npx prisma migrate dev --name add-base-dose-fields
```

**Step 3: Commit**
```bash
git add prisma/schema.prisma
git commit -m "feat: add base dose fields for weight-based calculations"
```

#### Task 9: Implement Weight-Based Dose Calculator Component

**Files:**
- Create: `src/components/medical/WeightBasedDoseCalculator.tsx`
- Modify: `src/app/(app)/drug/[id]/page.tsx:340-450` (sidebar area)

**Step 1: Create WeightBasedDoseCalculator component**
```bash
# Create component with weight input, calculation display, formula transparency
```

**Step 2: Implement calculation logic**
```javascript
// Total Dose (mg) = Base Dose (mg/kg) × Patient Weight (kg)
// Display: "Result = 5 mg/kg × 70 kg = 350 mg"
```

**Step 3: Add input validation**
```bash
# Validate weight is numeric, positive, in reasonable range
```

**Step 4: Implement hepatic/renal adjustment collapsible sections**
```bash
# Hide by default, show when clinically relevant data exists
```

**Step 5: Integrate into drug details page sidebar**
```bash
# Place prominently below drug header
```

**Step 6: Test calculation accuracy**
```bash
# Verify with known drug doses and weights
```

**Step 7: Commit**
```bash
git add src/components/medical/WeightBasedDoseCalculator.tsx src/app/(app)/drug/[id]/page.tsx
git commit -m "feat: implement weight-based dose calculator"
```

### Phase 4: Data Engineering and Fallback Mechanisms

#### Task 10: Create External Data Service Layer

**Files:**
- Create: `src/lib/external-data-service.ts`
- Modify: `src/lib/db.ts:1-18` (import and initialize)

**Step 1: Create external data service**
```bash
# Service to fetch from FDA, WHO, Micromedex when local data missing
```

**Step 2: Implement caching mechanism**
```bash
# Add Redis or in-memory cache with TTL to prevent excessive API calls
```

**Step 3: Create data source attribution system**
```bash
# Track whether data came from local DB or external source
```

**Step 4: Commit**
```bash
git add src/lib/external-data-service.ts
git commit -m "feat: create external data service layer with caching"
```

#### Task 11: Implement Pregnancy/G6PD Data Fallback Logic

**Files:**
- Modify: `src/app/(app)/drug/[id]/page.tsx:52-90` (fetchDrug function)
- Modify: `src/lib/external-data-service.ts:1-50`

**Step 1: Modify drug fetch to check for missing pregnancy/G6PD data**
```bash
# After local DB fetch, check if critical fields are null/empty
```

**Step 2: Implement fallback to external data service**
```bash
# Call external service when local data missing
# Merge results with clear source attribution
```

**Step 3: Add UI indicators for externally sourced data**
```bash
# Show "Data supplemented from [Source]" labels
# Provide "View Source" links for verification
```

**Step 4: Implement logging for external data usage**
```bash
# Track when external data is used for quality monitoring
```

**Step 5: Commit**
```bash
git add src/lib/external-data-service.ts src/app/(app)/drug/[id]/page.tsx
git commit -m "feat: implement pregnancy/g6pd data fallback with external sources"
```

#### Task 12: Enhance Drug Search Results with ICD-10 Display

**Files:**
- Modify: `src/app/(app)/search/page.tsx:333-356` (ICD-10 display in table)
- Verify: `src/app/api/drugs/search/route.ts:13-80` (already includes icd10Codes)

**Step 1: Verify search API already includes ICD-10 codes**
```bash
# Confirm include: { icd10Codes: true } in search route
```

**Step 2: Enhance ICD-10 display in search results table**
```bash
# Show first 2-3 codes with "+X more" indicator
# Add tooltip showing all codes on hover
```

**Step 3: Improve formatting of ICD-10 codes**
```bash
# Consistent styling, better visual separation
```

**Step 4: Commit**
```bash
git add src/app/(app)/search/page.tsx
git commit -m "feat: enhance icd-10 display in search results"
```

### Phase 5: Optimization and Quality Assurance

#### Task 12: Optimize Database Queries for Performance

**Files:**
- Modify: `src/app/api/drugs/search/route.ts:13-80`
- Modify: `src/app/api/drugs/[id]/route.ts:10-30`
- Modify: `src/app/api/drugs/autocomplete/route.ts:1-30`

**Step 1: Add database indexes for frequently queried fields**
```bash
# Update prisma schema with indexes on:
# - drug.genericName, drug.packageName (for search)
# - drug.status (for active drug filtering)
# - drugInteraction.drugId (for interaction lookups)
```

**Step 2: Apply migration for indexes**
```bash
npx prisma migrate dev --name add-performance-indexes
```

**Step 3: Optimize API routes for field selection**
```bash
# Ensure only necessary fields are fetched in each route
# Use Prisma's select to minimize data transfer
```

**Step 4: Commit**
```bash
git add prisma/schema.prisma
git commit -m "feat: add database indexes for search performance"
```

#### Task 13: Implement Loading States and Error Handling

**Files:**
- Modify: `src/app/(app)/drug/[id]/page.tsx:42-110` (loading/error states)
- Modify: `src/app/(app)/search/page.tsx:34-110` (loading/error states)

**Step 1: Enhance loading skeletons**
```bash
# Add more detailed skeletons matching final layout
```

**Step 2: Improve error handling with user-friendly messages**
```bash
# Show actionable error messages, not just technical details
```

**Step 3: Add retry mechanisms for failed requests**
```bash
# Allow users to retry failed data loads
```

**Step 4: Commit**
```bash
git add src/app/(app)/drug/[id]/page.tsx src/app/(app)/search/page.tsx
git commit -m "feat: enhance loading states and error handling"
```

#### Task 14: Conduct Final Testing and Verification

**Files:**
- Test: Various components and pages

**Step 1: Test archived module accessibility**
```bash
# Verify all archived modules accessible via direct URLs
```

**Step 2: Test pregnancy safety display**
```bash
# Verify with drugs from each category (A, B, C, D, X)
```

**Step 3: Test G6PD alert system**
```bash
# Verify alert appears for contraindicated drugs
# Verify safe status shown for G6PD-safe drugs
```

**Step 4: Test weight-based calculator**
```bash
# Verify calculations with multiple drugs and weights
# Verify formula transparency
```

**Step 5: Test external data fallback**
```bash
# Verify fallback works when local data missing
# Verify source attribution is clear
```

**Step 6: Performance testing**
```bash
# Verify load times meet targets (<2s search, <1.5s drug details)
```

**Step 7: Commit**
```bash
git add .
git commit -m "feat: complete refactoring and clinical command center transformation"
```

## Execution Instructions

**Plan complete and saved to `docs/plans/2026-04-20-drugeye-platform-refactoring-plan.md`. Two execution options:**

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach?**