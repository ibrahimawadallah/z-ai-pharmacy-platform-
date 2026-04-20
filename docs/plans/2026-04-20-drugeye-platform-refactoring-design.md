# DrugEye Platform Refactoring Design
## Clinical Command Center Transformation

**Date:** 2026-04-20  
**Status:** Approved  

### Overview
This document outlines the refactoring of the DrugEye platform to transform the drug search results into a high-performance, intelligent clinical command center. The design focuses on archiving non-essential modules, updating the visual identity, enhancing clinical data presentation, implementing a weight-based dose calculator, and establishing robust data engineering practices.

---

## 1. Module Archiving Strategy

### Objective
Decouple non-core modules from main navigation while preserving functionality.

### Approach
- Create `/src/app/archived` directory
- Relocate specified modules to archived subdirectories:
  - `/src/app/archived/patients`
  - `/src/app/archived/shortages`  
  - `/src/app/archived/adr`
  - `/src/app/archived/pipeline`
  - `/src/app/archived/courses`
- Maintain all existing functionality and API endpoints
- Remove archived modules from main navigation components
- Preserve direct URL access for users with existing links

### Benefits
- Reduces UI clutter in primary navigation
- Maintains backward compatibility
- Simplifies main navigation for core clinical workflow
- Zero data loss or functionality reduction

### Implementation Notes
- Update navigation components (`src/components/ui/navigation-menu.tsx`, etc.)
- Ensure archived modules remain accessible via direct routes
- No changes required to database or API layer

---

## 2. Logo Update: Glassmorphism Design

### Objective
Create a modern, dark-mode optimized DrugEye logo with glassmorphism aesthetic.

### Design Specifications
- **Effect:** Semi-transparent background with backdrop blur
- **Background:** `rgba(255, 255, 255, 0.1)` with `backdrop-filter: blur(10px)`
- **Border:** Subtle 1px gradient border (`#4fd1c5` to `#06b6d4`)
- **Typography:** Modern sans-serif (Inter or similar) in white/light cyan
- **Icon:** Stylized "DE" monogram or mortar/pestle symbol
- **Dark Mode Optimized:** Designed for `#0f172a` background (slate-900)

### Implementation Options (Recommended: CSS-only)
```css
.drugeye-logo {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(79, 209, 197, 0.3);
  border-radius: 12px;
  padding: 8px 16px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
```

### Benefits
- Modern, high-tech medical aesthetic
- Performs well in both light and dark modes
- Lightweight implementation (no additional assets)
- Maintains brand recognition while updating visual language

---

## 3. Intelligent Drug Search Results Page

### Objective
Transform drug details page into comprehensive clinical command center.

### Enhanced Components

#### Pregnancy Safety Section
- Display FDA pregnancy categories (A, B, C, D, X) with explanations
- Show trimester-specific risks when available
- List necessary precautions and monitoring requirements
- Color-coded risk indicators (Green=A/B, Yellow=C, Red=D/X)
- Data source: Local MOH database with FDA/AU TGA fallback

#### G6PD Safety Alert
- Prominent red alert banner when contraindicated
- Clear explanation: "May cause hemolytic anemia in G6PD-deficient patients"
- Visual indicator: Exclamation triangle in red circle
- Alternative medication suggestions when available in database
- Always visible section (shows "No known G6PD risks" when safe)

#### Clinical Data Tabs Enhancement
**Side Effects Tab:**
- Organized by frequency: Very Common (>10%), Common (1-10%), Uncommon (0.1-1%), Rare (<0.1%)
- Severity coloring: Mild (green), Moderate (amber), Severe (red)
- Mechanism of action when available
- Onset and duration information

**Indications Tab:**
- FDA-approved indications with evidence levels
- Off-label uses clearly marked
- Dosage ranges per indication
- Clinical guidelines references (WHO, ACC/AHA, etc.)

**Contraindications Tab:**
- Absolute contraindications (red flag)
- Relative contraindications (yellow flag)
- Specific conditions to avoid
- Drug-drug interactions that create contraindications

### Data Flow
1. Drug ID from route parameters
2. Fetch drug record with related clinical data via Prisma
3. Transform data for UI presentation
4. Render specialized sections with appropriate styling

---

## 4. Weight-Based Dose Calculator

### Objective
Implement transparent, weight-based dosing calculator within drug results page.

### Implementation

#### Input Section
- Single input field: "Patient Weight (kg)"
- Input validation: numeric, positive, reasonable range (0.5-300 kg)
- Default value: 70 kg (standard adult)
- Units clearly displayed

#### Calculation Logic
```
Total Dose (mg) = Base Dose (mg/kg) × Patient Weight (kg)
```

#### Display Requirements
- Show the exact formula used
- Display base dose sourced from drug data
- Show step-by-step calculation
- Final result with appropriate units (mg, mL, etc.)
- Example: "Dose = 5 mg/kg × 70 kg = 350 mg"

#### UI Presentation
- Prominent calculator section below drug header
- Hepatic/Renal adjustment tables:
  - Hidden by default in "normal cases"
  - Expandable section labeled "Advanced Adjustments"
  - Shown automatically when hepatic/renal data present
  - Clear indication when adjustments are not applicable

#### Error Handling
- Invalid weight: Show validation message
- Missing base dose: Display "Weight-based dosing not established for this drug"
- Extreme weights: Warn about potential need for ideal body weight adjustment

---

## 5. Data Engineering & Fallback Mechanism

### Objective
Ensure comprehensive clinical data availability through intelligent fallback.

### Primary Data Source
- Local MOH/UAE approved drug database (existing Prisma implementation)
- Tables: Drug, DrugInteraction, DrugSideEffect, ICD10Mapping, etc.
- Updated via existing import scripts

### Fallback Logic for Missing Data
When pregnancy/G6PD/dosing data is missing from local database:

1. **Detection Layer**
   - Check for null/empty values in relevant fields
   - Flag drugs requiring external data supplementation

2. **External Data Sources (in priority order)**
   - FDA Drug Labels (DailyMed) - Primary source for pregnancy/lactation
   - WHO Essential Medicines List & Formulary
   - Micromedex® (via licensed access if available)
   - Drugs.com API (for OTC information)
   - ClinicalTrials.gov (for investigational uses)
   - PubMed Central (for primary literature)

3. **Implementation Approach**
   - Create external data service layer
   - Implement caching mechanism (Redis or in-memory with TTL)
   - Add source attribution to all displayed data
   - Show visual indicator: "Data supplemented from [Source]"
   - Provide "View Source" link for verification
   - Log external data usage for quality monitoring

### Database Enhancements
- Add fields to Drug model if missing:
  - `pregnancyCategory` (String)
  - `pregnancyPrecautions` (Text)
  - `g6pdSafe` (Boolean)
  - `g6pdWarning` (Text)
  - `baseDoseMgPerKg` (Float)
  - `baseDoseIndication` (String)
- Create external_sourcing_log table for audit trail

### Benefits
- Clinically comprehensive information at point of care
- Transparent about data sourcing
- Maintains trust through clear attribution
- Continuous improvement via usage analytics
- Reduces need for manual data entry

---

## 6. Performance & Technical Considerations

### Frontend Optimizations
- React Query for data fetching and caching
- Optimized database queries with proper indexing
- Pagination for large result sets
- Skeleton loading states
- Memoized expensive computations
- Image optimization for logos/icons

### Backend Optimizations
- Database indexes on frequently queried fields:
  - `drug.genericName`, `drug.packageName`
  - `drug.status`
  - `drugInteraction.drugId`
  - `drugSideEffect.drugId`
- Query limits and pagination in API routes
- Caching of frequent queries (drug search, popular drugs)
- Efficient Prisma query structure with selective field loading

### Security & Privacy
- No patient data stored or transmitted in calculator
- All calculations performed client-side
- External API calls routed through backend proxy
- Environment variables for external service credentials
- Input sanitization and validation

---

## 7. Implementation Phases

### Phase 1: Foundation
- [ ] Create archived directory structure
- [ ] Move specified modules to archived
- [ ] Update navigation to remove archived module links
- [ ] Implement glassmorphism logo
- [ ] Verify all archived modules still functional via direct access

### Phase 2: Clinical Data Enhancement
- [ ] Enhance drug details page with pregnancy safety section
- [ ] Implement G6PD safety alert system
- [ ] Upgrade clinical data tabs with better organization
- [ ] Add data source attribution system
- [ ] Implement basic external data fallback

### Phase 3: Dose Calculator & Advanced Features
- [ ] Implement weight-based dose calculator
- [ ] Add hepatic/renal adjustment collapsible sections
- [ ] Enhance formula transparency and UI
- [ ] Improve external data integration
- [ ] Add usage analytics for external data fallback

### Phase 4: Optimization & Quality Assurance
- [ ] Performance testing and optimization
- [ ] Accessibility compliance review (WCAG 2.1 AA)
- [ ] Cross-browser testing
- [ ] Documentation updates
- [ ] Final QA and sign-off

---

## 8. Success Criteria

### Functional
- All archived modules accessible via direct URLs
- Pregnancy safety information displayed for all drugs
- G6PD safety alerts appear when clinically indicated
- Weight-based calculator shows transparent math
- External data fallback clearly attributed
- Navigation streamlined to core clinical workflow

### Performance
- Search results load in <2 seconds (95th percentile)
- Drug details page loads in <1.5 seconds
- No layout shifts during loading
- Efficient API utilization (<50ms avg response time)

### Clinical Utility
- Healthcare professionals can make informed decisions without leaving search results
- Critical safety information prominently displayed
- Dosing calculations transparent and verifiable
- Information sourced from trusted clinical references
- Reduced cognitive load through intelligent information hierarchy

---
*Design approved and ready for implementation planning.*