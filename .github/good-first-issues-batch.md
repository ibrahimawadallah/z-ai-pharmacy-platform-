# Good First Issues Batch

## 📋 How to Use
Copy-paste each section into a new GitHub issue. Labels are listed at the top of each issue.

---

## Issue 1: Add Email Format Validation to Signup API

**Labels:** `good first issue`, `backend`, `api`, `size:small`, `help wanted`

### Context
Part of PR #4 (Signup 500 error fix). Currently, the signup API doesn't validate email format before processing, causing 500 errors on malformed emails. Adding client-side validation will prevent unnecessary API calls.

### Task
Add email format validation regex to the signup form before submission.

### Acceptance Criteria
- [ ] Email must match standard email regex pattern
- [ ] Invalid email shows inline error: "Please enter a valid email address"
- [ ] Form prevents submission if email is invalid
- [ ] Existing tests still pass

### Where to Change
- `src/app/(app)/auth/signup/page.tsx` - Add validation logic
- `src/components/auth/SignupForm.tsx` - Add error display

### How to Test
1. Run `npm run dev`
2. Navigate to `/auth/signup`
3. Enter "invalid-email" → expect validation error
4. Enter "test@example.com" → no error
5. Submit with invalid email → form should not submit

### Difficulty
Easy (< 2 hours)

### Mentor
@ibrahimawadallah

---

## Issue 2: Add Password Length Validation Error Message

**Labels:** `good first issue`, `frontend`, `size:small`, `help wanted`

### Context
Part of PR #4 (Signup 500 error fix). The signup form needs clearer validation feedback for password requirements. Currently lacks specific messaging for short passwords.

### Task
Add password length validation (min 8 characters) with user-friendly error message.

### Acceptance Criteria
- [ ] Password < 8 characters shows error: "Password must be at least 8 characters"
- [ ] Error displays inline below password field
- [ ] Form blocks submission until valid
- [ ] Error clears when user types valid password

### Where to Change
- `src/components/auth/SignupForm.tsx` - Add validation and error UI
- `src/lib/validation.ts` (create if doesn't exist) - Add password schema

### How to Test
1. Go to signup form
2. Type password "123" → expect error
3. Type password "12345678" → error clears
4. Submit blocked while error visible

### Difficulty
Easy (< 1 hour)

### Mentor
@ibrahimawadallah

---

## Issue 3: Add One Arabic Translation Key to Consultation Page

**Labels:** `good first issue`, `frontend`, `i18n`, `size:small`, `help wanted`

### Context
Part of PR #8 (Arabic RTL support). Starting with simple translation keys for the consultation page before full RTL layout implementation.

### Task
Add Arabic translation for the "Consultation" header text.

### Acceptance Criteria
- [ ] Create `ar.json` locale file in `public/locales/` if not exists
- [ ] Add key: `"consultation.title": "استشارة"`
- [ ] Update `src/app/(app)/consultation/page.tsx` to use translation key
- [ ] Default to English if Arabic translation missing

### Where to Change
- `public/locales/ar.json` - Create/add translation
- `public/locales/en.json` - Add English fallback
- `src/app/(app)/consultation/page.tsx` - Use `useTranslation()` hook

### How to Test
1. Add `?lang=ar` query param or set browser to Arabic
2. Consultation page shows "استشارة" in header
3. English browsers still show "Consultation"

### Difficulty
Easy (< 1 hour)

### Mentor
@ibrahimawadallah

---

## Issue 4: Add Tooltip Text for "Last Synced" Badge

**Labels:** `good first issue`, `frontend`, `documentation`, `size:small`, `help wanted`

### Context
Part of PR #7 (Data-source page with last-synced badge). Users don't understand what the "last synced" timestamp means.

### Task
Add a tooltip that explains the last-synced badge when users hover over it.

### Acceptance Criteria
- [ ] Hovering badge shows tooltip: "Data last synchronized with external source"
- [ ] Tooltip includes actual timestamp formatted nicely
- [ ] Uses existing tooltip component from shadcn/ui
- [ ] Accessible (keyboard focus shows tooltip)

### Where to Change
- `src/components/data-source/SyncBadge.tsx` (or similar) - Wrap with Tooltip component
- `src/components/ui/tooltip.tsx` - Use existing component

### How to Test
1. Go to data-source page
2. Hover over "Last synced 2h ago" badge
3. Tooltip appears with explanatory text
4. Test keyboard focus with Tab key

### Difficulty
Easy (< 1 hour)

### Mentor
@ibrahimawadallah

---

## Issue 5: Fix Missing " aria-label" on Audit Log Icon Button

**Labels:** `good first issue`, `frontend`, `accessibility`, `size:small`, `help wanted`

### Context
Part of PR #5 (Audit log UI). Icon buttons need accessibility labels for screen readers.

### Task
Add `aria-label` attribute to audit log view-details icon button.

### Acceptance Criteria
- [ ] Icon button has `aria-label="View audit log details"`
- [ ] Screen reader announces label when focused
- [ ] No visual change to the button

### Where to Change
- `src/components/audit-log/AuditLogRow.tsx` (or similar)

### How to Test
1. Install browser screen reader extension or use NVDA/VoiceOver
2. Tab to the view-details icon button
3. Hear "View audit log details" announced
4. OR check HTML in DevTools for `aria-label` attribute

### Difficulty
Easy (< 30 minutes)

### Mentor
@ibrahimawadallah

---

## Issue 6: Add Unit Test for Audit Log Empty State

**Labels:** `good first issue`, `testing`, `frontend`, `size:small`, `help wanted`

### Context
Part of PR #5 (Audit log UI). Testing coverage needed for edge case: empty audit log list.

### Task
Write a test that verifies the empty state message displays correctly when no audit logs exist.

### Acceptance Criteria
- [ ] Test renders `AuditLogList` with empty array prop
- [ ] Test expects "No audit logs found" message visible
- [ ] Test passes with `npm test`
- [ ] Test file follows existing naming convention `*.test.tsx`

### Where to Change
- `src/components/audit-log/__tests__/AuditLogList.test.tsx` (create if needed)

### How to Test
1. Run `npm test AuditLogList`
2. Verify test passes
3. Verify test actually checks the right thing (temporarily break component to confirm)

### Difficulty
Easy (< 2 hours)

### Mentor
@ibrahimawadallah

---

## Issue 7: Add Security Header Test for X-Content-Type-Options

**Labels:** `good first issue`, `testing`, `security`, `size:small`, `help wanted`

### Context
Part of PR #6 (Security hardening). Need to verify security headers are present on all API responses.

### Task
Write a test that verifies `X-Content-Type-Options: nosniff` header is present.

### Acceptance Criteria
- [ ] Create test in `tests/security/headers.test.ts`
- [ ] Test makes request to any API endpoint
- [ ] Test asserts header `x-content-type-options` equals `nosniff`
- [ ] Test passes in CI

### Where to Change
- `tests/security/headers.test.ts` (create)
- May need to add `tests/` folder structure

### How to Test
1. Run `npm test security`
2. Confirm test passes
3. Check that removing header from `next.config.js` or middleware causes test to fail

### Difficulty
Easy (< 2 hours)

### Mentor
@ibrahimawadallah

---

## Issue 8: Document the Audit Log API Endpoint

**Labels:** `good first issue`, `documentation`, `api`, `size:small`, `help wanted`

### Context
Part of PR #5 (Audit log UI). The API endpoint lacks documentation for contributors.

### Task
Add JSDoc comments to the audit log API route explaining parameters and response format.

### Acceptance Criteria
- [ ] JSDoc comment above handler function
- [ ] Document query params: `?limit`, `?offset`, `?userId`
- [ ] Document response shape with example
- [ ] Document error responses (401, 403, 500)

### Where to Change
- `src/app/api/audit-log/route.ts` - Add JSDoc comments

### How to Test
1. Hover over function in VSCode - see JSDoc popup
2. Review comments for clarity
3. Ask: would a new contributor understand how to use this?

### Difficulty
Easy (< 1 hour)

### Mentor
@ibrahimawadallah

---

## Issue 9: Fix Signup Form Focus Order for Accessibility

**Labels:** `good first issue`, `frontend`, `accessibility`, `size:small`, `help wanted`

### Context
Part of PR #4 (Signup 500 error fix). Tab navigation order should be logical for keyboard users.

### Task
Ensure signup form fields have correct tab order (Name → Email → Password → Confirm → Submit).

### Acceptance Criteria
- [ ] Tab key moves in logical order through form
- [ ] No hidden focus traps or skipped fields
- [ ] Submit button is last in tab order
- [ ] Tested with keyboard only

### Where to Change
- `src/components/auth/SignupForm.tsx` - Check/fix tabIndex or DOM order

### How to Test
1. Load signup page
2. Press Tab repeatedly
3. Verify order: Name → Email → Password → Confirm → Submit
4. No unexpected jumps or cycles

### Difficulty
Easy (< 1 hour)

### Mentor
@ibrahimawadallah

---

## Issue 10: Add README Section for Running Security Tests

**Labels:** `good first issue`, `documentation`, `security`, `size:small`, `help wanted`

### Context
Part of PR #6 (Security hardening). New contributors need to know how to run security-specific tests.

### Task
Add a section to README.md explaining how to run security tests.

### Acceptance Criteria
- [ ] New "Security Testing" section in README.md
- [ ] Command: `npm run test:security` (or equivalent)
- [ ] Brief explanation of what security tests cover
- [ ] Link to `tests/security/` folder

### Where to Change
- `README.md` - Add section before "Contributing"

### How to Test
1. Preview markdown in VSCode
2. Verify new section renders correctly
3. Copy commands and verify they work in terminal

### Difficulty
Easy (< 30 minutes)

### Mentor
@ibrahimawadallah

---

## 📌 Recommended Issues to Pin

Pin these 3 issues for maximum visibility (truly independent, <1 day tasks):

1. **Issue 4: Add Tooltip Text for "Last Synced" Badge** - Very scoped, UI only, instant gratification
2. **Issue 2: Add Password Length Validation** - Clear requirements, common pattern, good intro to form validation
3. **Issue 7: Add Security Header Test** - Good intro to testing, security domain, isolated change

Avoid pinning RTL or complex validation issues as they require more context.
