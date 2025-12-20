# TASK QUEUE - FIRST CONTACT E.I.S.
## Prioritized Agent Tasks

---

## PRIORITY LEVELS

- **P0**: Blocking everything else. Do these first.
- **P1**: Core functionality. Required for demo.
- **P2**: Important features. Needed for pilot.
- **P3**: Nice to have. Post-launch.

---

## PHASE 1: FOUNDATION (P0)

### Task 1.1: Project Scaffolding
**Agent Type:** Backend
**Estimated Time:** 30 minutes
**Dependencies:** None

Create the FastAPI project structure:
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   ├── models/
│   │   ├── __init__.py
│   │   └── base.py
│   ├── schemas/
│   │   └── __init__.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py
│   │   └── v1/
│   │       └── __init__.py
│   ├── services/
│   │   └── __init__.py
│   └── utils/
│       └── __init__.py
├── tests/
│   ├── __init__.py
│   └── conftest.py
├── requirements.txt
├── Dockerfile
└── .env.example
```

**Deliverables:**
- [ ] All directories and __init__.py files created
- [ ] requirements.txt with all dependencies
- [ ] .env.example with all required variables
- [ ] Dockerfile for Cloud Run deployment

---

### Task 1.2: Database Connection Module
**Agent Type:** Backend
**Estimated Time:** 20 minutes
**Dependencies:** Task 1.1

Implement `app/database.py`:
- Async SQLAlchemy engine for Cloud SQL
- Session factory
- `get_db` dependency
- `set_tenant_context` function for RLS

**Deliverables:**
- [ ] database.py with all functions from ARCHITECTURE_PATTERNS.md
- [ ] Connection works with Cloud SQL Proxy

---

### Task 1.3: Configuration Module
**Agent Type:** Backend
**Estimated Time:** 15 minutes
**Dependencies:** Task 1.1

Implement `app/config.py`:
- Pydantic Settings class
- Load from environment variables
- Required: DATABASE_URL, JWT_SECRET, JWT_ALGORITHM

**Deliverables:**
- [ ] config.py with Pydantic Settings
- [ ] All required variables documented

---

### Task 1.4: Base Models & TenantMixin
**Agent Type:** Backend
**Estimated Time:** 20 minutes
**Dependencies:** Task 1.2

Implement `app/models/base.py`:
- TenantMixin class (from ARCHITECTURE_PATTERNS.md)
- Ensure organization_id on all models

**Deliverables:**
- [ ] TenantMixin implemented
- [ ] Example model using mixin

---

### Task 1.5: Authentication Dependencies
**Agent Type:** Backend
**Estimated Time:** 30 minutes
**Dependencies:** Task 1.3, Task 1.4

Implement `app/api/deps.py`:
- JWT token validation
- `get_current_user` dependency
- `require_role` factory function
- Pre-built role dependencies (require_city_admin, etc.)

**Deliverables:**
- [ ] deps.py with all auth functions
- [ ] Role-based access control working
- [ ] RLS context set automatically

---

## PHASE 2: CORE MODELS (P0)

### Task 2.1: User Model
**Agent Type:** Backend
**Estimated Time:** 15 minutes
**Dependencies:** Task 1.4

Implement User model matching existing schema:
- Roles: client, caseworker, vendor_admin, city_admin, city_council
- organization_id, vendor_id (nullable for city admins)

---

### Task 2.2: Organization & Vendor Models
**Agent Type:** Backend
**Estimated Time:** 15 minutes
**Dependencies:** Task 1.4

Implement Organization and Vendor models matching schema.

---

### Task 2.3: Client Model
**Agent Type:** Backend
**Estimated Time:** 20 minutes
**Dependencies:** Task 2.2

Implement Client model with:
- All fields from database schema
- Status enum
- Relationships to vendor, caseworker, QR location

---

### Task 2.4: QR Location & Scan Event Models
**Agent Type:** Backend
**Estimated Time:** 15 minutes
**Dependencies:** Task 2.2

Implement QRLocation and QRScanEvent models.
Critical for Layer 8 geographic analytics.

---

### Task 2.5: Case Plan & Action Models
**Agent Type:** Backend
**Estimated Time:** 20 minutes
**Dependencies:** Task 2.3

Implement CasePlan and CasePlanAction models.
Include status workflow (pending → approved → completed).

---

### Task 2.6: Benefit Program Models
**Agent Type:** Backend
**Estimated Time:** 15 minutes
**Dependencies:** Task 2.3

Implement BenefitProgram and ClientBenefitEnrollment models.

---

### Task 2.7: Vendor Performance Metrics Model
**Agent Type:** Backend
**Estimated Time:** 15 minutes
**Dependencies:** Task 2.2

Implement VendorPerformanceMetrics for Layer 8.
City-only access!

---

## PHASE 3: CORE ENDPOINTS (P1)

### Task 3.1: Health Check & Main App
**Agent Type:** Backend
**Estimated Time:** 15 minutes
**Dependencies:** All Phase 1 & 2

Implement main.py with:
- FastAPI app
- CORS middleware
- Router includes
- Health check endpoint

---

### Task 3.2: Auth Endpoints
**Agent Type:** Backend
**Estimated Time:** 30 minutes
**Dependencies:** Task 3.1

Implement `/api/v1/auth`:
- POST /login (returns JWT)
- POST /register (if needed)
- GET /me (current user)

---

### Task 3.3: QR Intake Endpoint (PUBLIC)
**Agent Type:** Backend
**Estimated Time:** 30 minutes
**Dependencies:** Task 3.1

Implement `/api/v1/intake/qr/{qr_location_id}`:
- NO auth required
- Auto-assign to vendor
- Record scan event
- Generate case number

**CRITICAL FOR DEMO**

---

### Task 3.4: Clients CRUD Endpoints
**Agent Type:** Backend
**Estimated Time:** 45 minutes
**Dependencies:** Task 3.2

Implement `/api/v1/clients`:
- GET / (list, filtered by role)
- GET /{id} (detail)
- PATCH /{id} (update)

Role-based filtering:
- Caseworker sees assigned clients
- Vendor admin sees vendor's clients
- City admin sees all

---

### Task 3.5: Case Plans Endpoints
**Agent Type:** Backend
**Estimated Time:** 45 minutes
**Dependencies:** Task 3.4

Implement `/api/v1/case-plans`:
- GET /clients/{id}/case-plans (list for client)
- POST /clients/{id}/case-plans/generate (AI generation - stub)
- POST /{id}/approve
- POST /{id}/modify
- POST /{id}/reject

---

### Task 3.6: Benefits Endpoints
**Agent Type:** Backend
**Estimated Time:** 30 minutes
**Dependencies:** Task 3.4

Implement `/api/v1/benefits`:
- GET /clients/{id}/benefits
- GET /clients/{id}/benefits/projection
- POST /clients/{id}/benefits/{code}/apply

---

### Task 3.7: Layer 8 Analytics Endpoints
**Agent Type:** Backend
**Estimated Time:** 45 minutes
**Dependencies:** Task 3.2

Implement `/api/v1/analytics`:
- GET /vendors (vendor performance)
- GET /geographic (QR heat map)
- GET /costs (cost per outcome)

**ALL ENDPOINTS MUST USE require_city_admin**

---

## PHASE 4: BUSINESS LOGIC (P1)

### Task 4.1: Case Number Generator
**Agent Type:** Backend
**Estimated Time:** 15 minutes
**Dependencies:** Phase 2

Generate unique case numbers like "LB-2847".
Format: {ORG_PREFIX}-{SEQUENTIAL}

---

### Task 4.2: VI-SPDAT Calculator
**Agent Type:** Backend
**Estimated Time:** 30 minutes
**Dependencies:** Phase 2

Calculate VI-SPDAT score from responses.
Determine acuity level (low, moderate, high, severe).

---

### Task 4.3: Benefit Stack Calculator
**Agent Type:** Backend
**Estimated Time:** 45 minutes
**Dependencies:** Phase 2

Implement benefit stack logic from ARCHITECTURE_PATTERNS.md:
- Check eligibility
- Calculate current vs projected income
- Handle GR/housing subsidy interaction
- Generate application timeline

---

### Task 4.4: Vendor Performance Calculator
**Agent Type:** Backend
**Estimated Time:** 30 minutes
**Dependencies:** Phase 3

Calculate vendor metrics:
- Total clients, housing rate
- Average days to housing
- Cost per client
- Retention rates

---

## PHASE 5: TESTING (P1)

### Task 5.1: Multi-Tenant Isolation Tests
**Agent Type:** Testing
**Estimated Time:** 30 minutes
**Dependencies:** Phase 3

**CRITICAL TESTS:**
- Org 1 cannot read Org 2's data
- Org 1 cannot write to Org 2's data
- RLS enforces even without app-level checks

---

### Task 5.2: Layer 8 Access Control Tests
**Agent Type:** Testing
**Estimated Time:** 30 minutes
**Dependencies:** Task 3.7

**CRITICAL TESTS:**
- Caseworker gets 403 on /analytics/*
- Vendor admin gets 403 on /analytics/*
- City admin gets 200 on /analytics/*

---

### Task 5.3: QR Intake Tests
**Agent Type:** Testing
**Estimated Time:** 20 minutes
**Dependencies:** Task 3.3

Test:
- Valid QR creates client
- Scan event recorded
- Vendor auto-assigned
- Invalid QR returns 404

---

### Task 5.4: Benefit Calculation Tests
**Agent Type:** Testing
**Estimated Time:** 20 minutes
**Dependencies:** Task 4.3

Test:
- GR + housing subsidy interaction
- SSI eligibility
- Projected income accuracy

---

## PHASE 6: DEPLOYMENT (P2)

### Task 6.1: Docker Configuration
**Agent Type:** DevOps
**Estimated Time:** 20 minutes
**Dependencies:** Phase 3

Create production Dockerfile:
- Python 3.11 base
- Install dependencies
- Cloud SQL Proxy compatible

---

### Task 6.2: Cloud Run Deployment
**Agent Type:** DevOps
**Estimated Time:** 30 minutes
**Dependencies:** Task 6.1

Deploy to Cloud Run:
- Connect to Cloud SQL
- Set environment variables
- Configure secrets

---

### Task 6.3: CI/CD Pipeline
**Agent Type:** DevOps
**Estimated Time:** 45 minutes
**Dependencies:** Task 6.2

GitHub Actions workflow:
- Run tests on PR
- Build and deploy on merge to main

---

## SUMMARY

| Phase | Tasks | Priority | Estimated Time |
|-------|-------|----------|----------------|
| 1 | 5 | P0 | 2 hours |
| 2 | 7 | P0 | 2 hours |
| 3 | 7 | P1 | 4 hours |
| 4 | 4 | P1 | 2 hours |
| 5 | 4 | P1 | 2 hours |
| 6 | 3 | P2 | 2 hours |
| **Total** | **30** | - | **~14 hours** |

With parallel agent execution in Antigravity, could compress to 4-6 hours of wall clock time.
