# FIRST CONTACT E.I.S. - MASTER EXECUTION PLAN (Phase 2)

## 0. The North Star
**Objective**: Build a system capable of **replacing the administrative function of a human caseworker**.
**Current State**: Human-in-the-Loop (Approval required).
**Future State**: Autonomous Case Management (AI handles Discovery, Eligibility, Scheduling, and Follow-up).

## 1. The "Total Lifecycle" Architecture
To achieve the vision pitched (Housing + SSI + Rehab + Jobs), the system requires 5 distinct modules working in concert.

### Module A: The "Embedded Detective" (Intake & Eligibility)
*   **Input**: HUD 41-Question Form + Biometric/Contextual Data.
*   **AI Logic**:
    *   **SSI/SSDI**: Checks medical history against SSA "Blue Book" listings.
    *   **IHSS**: Checks "Activities of Daily Living" (ADL) limitations.
    *   **Mainstream Benefits**: Auto-screens for SNAP (Food), TANF (Cash), and Medicaid.
*   **Requirement**: "No Wrong Door" API integrations with County/State eligibility systems (or automated PDF form filling if APIs don't exist).

### Module B: The "Stability Architect" (Care Planning)
*   **Function**: Generates the **Unique Case Plan**.
*   **Logic**:
    *   *User*: Supply addiction + Job skills.
    *   *AI Deployment*: Parallel track.
        *   Track 1 (Health): Detox Bed (3 days) -> Rehab (30 days).
        *   Track 2 (Income): SSI Application (initiated immediately).
        *   Track 3 (Future): Job Corp intake scheduled for Day 31.
*   **Key Feature**: **Dynamic Re-Routing**. If User fails Track 1, Track 3 is automatically paused/rescheduled.

### Module C: The "Universal Scheduler" (Logistics)
*   **Visual**: The Flowchart (Webhook -> Schedule Intake -> Handoff).
*   **Crucial Component**: **Availability Engine**.
    *   We need real-time "Slot inventory" from partners (Clinics, Shelters, Workforce Centers).
    *   *Gap Filler*: If partners don't have APIs, we provide them a "Vendor Portal" (First Contact Lite) to manage their calendar, giving us the data.

### Module D: The "Nudge" Engine (Retention)
*   **Process**: Daily Follow-up Trigger -> 2-Week Follow-up -> SMS/WhatsApp.
*   **AI Role**: "Compassionate Persistence."
    *   Uses Large Language Models to vary the tone of messages (strictly professional vs. encouraging/coach-like) based on client psychology.

### Module E: The "Legal Wrapper" (Compliance)
*   **HIPAA**: Medical data storage (Encrypted at rest/transit).
*   **42 CFR Part 2**: Strict privacy for Substance Abuse records.
*   **DSAs (Data Sharing Agreements)**: The legal framework allowing us to share client data between the Shelter and the Hospital.

## 2. Technical Requirements "To Actually Do This"

### A. Integrations (The Hardest Part)
We need to connect to:
1.  **HMIS (Homeless Management Information System)**: The federal standard DB. We need Read/Write access.
2.  **SSA (Social Security Admin)**: For SSI verification (likely via third-party SOAP/XML APIs).
3.  **ADT Feeds (Admission, Discharge, Transfer)**: From local hospitals to know when a client enters the ER.

### B. The AI Stack (Google Cloud Native)
*   **Reasoning**: Vertex AI (Gemini 1.5 Pro) for reading medical notes and determining SSI eligibility.
*   **Document Processing**: Document AI to read uploaded IDs, eviction notices, and medical records.
*   **Voice**: Cloud Speech-to-Text for transcribing intake interviews.

## 3. The Roadmap to "Caseworker Replacement"
1.  **Phase 1 (Now)**: The Dashboard & Intake. (Human enters data, map shows dots).
2.  **Phase 2 (The Pitch)**: The **Simulation**. We verify the "AI Logic" works on fake people.
3.  **Phase 3 (Pilot)**: **Vendor Portal**. We give the app to *one* shelter and *one* clinic to sync calendars.
4.  **Phase 4 (Autonomy)**: The AI is granted "Permission to Spend" (e.g., booking an Uber for a client without asking a human).

---
*Status: Master Plan Generated. Based on User Flowcharts & Requirements.*
