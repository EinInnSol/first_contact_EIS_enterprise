# Enterprise Strategy: From Demo to Production

## Executive Summary
We have successfully built a "High-Fidelity Prototype" that demonstrates the core value proposition. To transition to a city-wide "Enterprise Product," we must shift our focus from speed/visuals to reliability, security, and scalability.

---

## 1. Constructive Retrospective

### ✅ What We Did Right
*   **Technology Stack**: FastAPI + Next.js + Cloud Run is the correct, modern, scalable choice.
*   **Trojan Horse Vision**: Separate Vendor (L1-7) and City (L8) interfaces is architecturally sound.
*   **AI Integration**: Using Vertex AI (Claude) directly allows for privacy-compliant reasoning.

### ⚠️ What Needs Improvement
*   **"Demo-Ware" Pollution**: The code is riddled with `if settings.PILOT_MODE:` checks. This makes the codebase fragile and hard to test. Logic should be data-driven, not mode-driven.
*   **Secret Management**: Secrets are currently fetched at app startup via code. This couples the app to the infrastructure. Secrets should be injected as environment variables (12-Factor App methodology).
*   **Directory Structure**: The root directory was cluttered (now fixed), which posed security risks and cognitive load.

### 🛑 What We Didn't Need
*   **Firestore Sync**: Attempting to sync Postgres with Firestore adds unnecessary complexity ($$). Postgres with JSONB is sufficient for 99% of our needs.
*   **Script Explosion**: Too many ad-hoc scripts. We need a unified build system.

---

## 2. The Enterprise Strategy (Phase 2)

### Phase 2.1: Operational Hygiene (Immediate) - **COMPLETED**
*   [x] Restructure repository (Clean root, standardized folders).
*   [x] Standardize `.gitignore`.
*   [x] Fix launcher scripts.

### Phase 2.2: Decoupling "Demo" from "Logic" (High Priority)
**Goal**: The application should behave the same way in Demo and Production. The *data* determines the state.
1.  **Remove `PILOT_MODE` Logic**: Delete conditional logic in `orchestrator.py` and `ai_recommendations.py`.
2.  **Data Seeder**: Create a sophisticated `SeederService` that injects the "Maria Garcia" scenario into the database.
3.  **Result**: The Orchestrator simply reads the DB. If it sees Maria, it generates the recommendation. It doesn't need to "know" it's a demo.

### Phase 2.3: Infrastructure as Code (IaC)
**Goal**: Disaster Recovery and Scalability.
1.  **Terraform**: specific definitions for:
    *   Cloud Run Services (Backend, Frontend).
    *   Cloud SQL (Postgres).
    *   Redis (Caching & Queues).
    *   Networking (VPC, Connectors).
2.  **CI/CD**: One-click deploy limits human error.

### Phase 2.4: Performance & Async Architecture
**Goal**: Handle thousands of concurrent users without lag.
1.  **Background Workers**: Move AI processing (10s+) to background queues (Cloud Tasks or Celery).
2.  **Redis Caching**: Cache Layer 8 dashboards (expensive aggregations) to load instantly.

### Phase 2.5: Compliance & Security (The "Gov" Layer)
**Goal**: Pass City Audit / HIPAA.
1.  **Audit Logs**: Immutable log of every L8 access.
2.  **RBAC Enforcement**: Rigorous automated testing of RLS (Row Level Security) policies.

---

## 3. Immediate Next Steps
1.  **Review this plan.**
2.  **Begin Phase 2.2**: Refactor `orchestrator.py` to remove hardcoded demo logic.
