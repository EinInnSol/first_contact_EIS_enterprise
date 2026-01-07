# NEURAL NEXUS (Layer 9): System Design & Philosophy

## 1. Concept: "The Autonomic Nervous System"
Most software is "Reactive" (User clicks button -> App does X).
The **Neural Nexus** is "Autonomic" (System observes state -> System acts to maintain homeostasis).

Just as the human body regulates temperature without conscious thought, the Neural Nexus monitors the *Health of the Homeless Services Ecosystem* and triggers interventions automatically.

## 2. The "Layer 8 & 9" Theory
*   **Layer 7**: Application Layer (HTTP/Interface).
*   **Layer 8**: The Human Layer (Politics, Caseworker Fatigue, Vendor Silos).
*   **Layer 9 (The Nexus)**: The Artificial Coordination Layer that fixes Layer 8 inefficiencies.

## 3. Architecture components

### A. The "Dendrites" (Sensors)
The Nexus ingests signals from:
1.  **Bed Availability** (Real-time capacity).
2.  **Weather APIs** (Approaching storms = increased urgency).
3.  **Caseworker Load** (If a caseworker is overwhelmed, don't route new high-needs cases there).
4.  **Client Biometrics/Status** (Time since last meal, medical urgency).

### B. The "Synapse" (Vertex AI Decision Engine)
*   **Model**: Gemini Pro / PaLM 2 via Vertex AI.
*   **Prompt Strategy**: "As the City Superintendent, given these inputs, what is the optimal distribution of resources?"
*   **Output**: A set of `OrchestrationEvents` (e.g., "Dispatch Van A to Sector 4", "Alert shelter B to prepare overflow").

### C. The "Effectors" (Action Takers)
*   `/api/v1/orchestrator/dispatch`: Simulates physical movement.
*   `/api/v1/orchestrator/alert`: Sends SMS/Email Push.
*   `/api/v1/orchestrator/reallocate`: Moves funding/inventory logic.

## 4. Implementation Rules
1.  **Do No Harm**: The component must never hallucinate a resource that doesn't exist. Hard validations against the SQL database are required *before* any AI suggestion is executed.
2.  **Human-in-the-Loop (Initially)**: All Level 3 (high cost) interventions require Caseworker Approval.
3.  **Latency**: Decisions must be made in <2000ms.
4.  **Environmental Safety Lock**: The Nexus is strictly prohibited from recommending "Client Discharge" or "Street Release" if active Weather Alerts are detected (e.g., Temp < 32°F, Storm Warning). It must instead default to "Emergency Shelter Extend".

## 5. Security - "The Blood-Brain Barrier"
*   The Nexus operates in a separate VPC scope.
*   PII (Personally Identifiable Information) is anonymized before being sent to Vertex AI (Token IDs only).

---
*Knowledge Item Created: Jan 06 2026*
*Status: Approved Design Pattern*
