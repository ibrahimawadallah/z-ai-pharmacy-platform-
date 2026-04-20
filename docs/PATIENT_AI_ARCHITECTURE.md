# DrugEye Clinical: Patient Profiles & AI Assistant Architecture

## 1. System Overview
The Patient Medication Profile and AI Assistant module transforms DrugEye from a static reference tool into a dynamic, daily point-of-care application. It enables clinicians to securely manage patient medication histories, run global interaction checks, and leverage a natural language AI assistant for real-time clinical decision support.

## 2. Technical Specifications

### 2.1 Database Schema (Prisma)
- **Patient Model**: Stores demographic and clinical baseline data (MRN, DOB, Weight, Creatinine Clearance, Allergies).
- **PatientMedication Model**: Stores active/inactive medications, dosages, frequencies, and start/end dates. Linked to the MOH Drug ID for relational integrity.
- *Security & HIPAA Compliance*: 
  - All PHI (Protected Health Information) is tied strictly to the `clinicianId`.
  - In production, columns like `firstName`, `lastName`, and `mrn` should be encrypted at rest using application-level encryption (e.g., Prisma Field Level Encryption) before writing to the DB.

### 2.2 API Architecture
- `GET /api/patients`: Fetches all patients for the authenticated clinician.
- `POST /api/patients`: Creates a new patient profile.
- `GET /api/patients/[id]`: Retrieves full patient context, including nested `PatientMedication` records.
- `POST /api/patients/[id]/medications`: Adds a new medication. Triggers a background interaction check.
- `POST /api/chat`: The AI Assistant endpoint. Uses Vercel AI SDK to stream responses back to the client. Injects the active patient's medication list into the system prompt for context-aware answers.

### 2.3 AI Assistant Capabilities
- **Model**: OpenAI `gpt-4o` (or Claude 3.5 Sonnet if Anthropic is configured).
- **Context Injection**: When a clinician asks "Can I add Ibuprofen to this patient's regimen?", the system prompt silently injects: `[Current Patient: John Doe. Meds: Lisinopril 400mg, Warfarin 10mg. Allergies: Penicillin]`.
- **System Prompt**: Instructed to act as an expert UAE Clinical Pharmacist, citing MOH guidelines and prioritizing patient safety.

## 3. Implementation Phases

### Phase 1: Core Patient CRUD (Current)
- Re-implement the deleted `/api/patients` routes.
- Build the UI: Patient List (`/patients`), Patient Detail (`/patients/[id]`).
- Enable adding/removing medications to a patient profile.

### Phase 2: Global Interaction Engine
- Connect the existing `checkInteractions` logic to the Patient Profile.
- When viewing a patient, automatically flag severe interactions across their entire active medication list.

### Phase 3: AI Clinical Assistant Integration
- Install `@ai-sdk/openai` and `ai`.
- Create the sliding/floating AI Chat panel in the dashboard.
- Enable the AI to read the current page context (e.g., "Summarize the interactions for the patient I am currently viewing").

## 4. Security & Maintenance
- **Authentication**: NextAuth.js secures all endpoints. Only verified clinicians can access patient records.
- **Audit Logging**: Every PHI read/write must be logged (Phase 4 addition).
- **Testing**:
  - Unit Tests: Verify dosage calculations and interaction severities.
  - Integration Tests: E2E testing of the medication addition workflow.
