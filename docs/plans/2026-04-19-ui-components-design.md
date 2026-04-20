# UI Components Design - Loading, Empty States, Progress

## Overview
Adding missing UI components for production-ready UX: loading skeletons, empty states, and progress indicators.

## Current State Analysis

### Loading States (Inconsistent)
- Most pages use simple text "Loading..." or inline spinner
- No skeleton loaders for data tables/lists
- Spinners vary across components (Loader2, custom SVGs, CSS animations)

### Empty States (Inconsistent)
- Various messages: "No results", "No patients yet", "No favorites"
- No consistent empty state component
- Icons and styling differ

### Progress Indicators (Missing)
- No progress bars for multi-step flows
- No stepper components
- No loading progress for API calls

## Design

### 1. Loading Skeleton Component
- Reusable Skeleton component exists at `src/components/ui/skeleton.tsx`
- Create wrapper component with common patterns:
  - `SkeletonCard` - For card-based content
  - `SkeletonTable` - For table rows
  - `SkeletonList` - For list items
  - `SkeletonText` - For paragraph lines

### 2. Empty State Component
New component at `src/components/ui/empty-state.tsx`:
```tsx
interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
}
```

### 3. Progress Component
Enhance existing progress with:
- `ProgressSteps` - For multi-step forms
- `LoadingOverlay` - Full-screen loading
- `InlineSpinner` - Small loading indicator

## Implementation Sites
- `src/app/(app)/patients/page.tsx` - Loading + empty
- `src/app/(app)/favorites/page.tsx` - Empty state
- `src/app/(app)/search/page.tsx` - Loading skeleton
- `src/app/(app)/drug/[id]/page.tsx` - Loading skeleton
- `src/app/(app)/alerts/page.tsx` - Loading skeleton
- `src/components/medical/*` - Loading states

## Approval
Approved for implementation.