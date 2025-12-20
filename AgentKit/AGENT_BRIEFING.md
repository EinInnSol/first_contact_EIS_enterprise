# FIRST CONTACT E.I.S. - AGENT BRIEFING
## Required Reading Before Any Task

---

## WHAT YOU'RE BUILDING

First Contact E.I.S. is a **multi-tenant AI orchestration platform** for homeless services coordination. It is NOT case management software. It is an **accountability infrastructure** with a hidden business model.

### The Trojan Horse Strategy (THE ENTIRE BUSINESS MODEL)

**What Vendors See (Layers 1-7) - FREE:**
- QR code intake system (auto-assigns clients to vendors)
- AI-generated case plans with one-click approval
- Benefit stack optimization
- Appointment coordination
- Compliance report auto-generation

*Vendors adopt voluntarily because it saves 3+ hours daily.*

**What Cities See (Layer 8) - THE HIDDEN PAYLOAD:**
- Real vendor performance data (not self-reported)
- Cost-per-outcome analysis by vendor
- Housing success rates and retention metrics
- Geographic heat maps from QR scan data

*Cities see Layer 8, realize they can finally hold vendors accountable, and MANDATE the platform.*

**Revenue:** $1,200/vendor/month (city pays). 400+ CoCs nationwide = $115M+ ARR potential.

---

## NON-NEGOTIABLE REQUIREMENTS

### 1. Multi-Tenant Architecture
- **EVERY table has `organization_id`** - No exceptions
- PostgreSQL Row-Level Security (RLS) enforces isolation
- Tenant = City/CoC (not user type)
- Session must set `app.organization_id` before any query

### 2. Layer 8 Access Control
- Vendors CANNOT access Layer 8 endpoints
- Vendors don't know Layer 8 exists
- Only `city_admin` and `city_council` roles can access `/analytics/*`
- Return HTTP 403 Forbidden for unauthorized access attempts

### 3. Human-in-the-Loop AI
- AI generates recommendations
- Humans APPROVE / MODIFY / REJECT
- No autonomous actions on client data
- All AI decisions must be explainable

### 4. QR Codes Are Core Innovation
- QR codes auto-assign clients to vendors based on location
- QR scan events power Layer 8 geographic analytics
- This is NOT optional or "nice to have"

---

## CURRENT STATE

### What Exists:
- GCP Project: `einharjer-valhalla` (us-east5 region)
- Cloud SQL PostgreSQL 15 database: `first-contact-db`
- Database: `firstcontact`
- Full schema deployed with RLS policies
- Seed data: Long Beach org, 4 vendors, 4 QR locations, benefit programs

### What Doesn't Exist Yet:
- FastAPI backend application
- API endpoints
- Authentication system
- Frontend application
- Deployment to Cloud Run

---

## TECH STACK

| Component | Technology |
|-----------|------------|
| Backend | Python 3.11, FastAPI, SQLAlchemy 2.0 (async) |
| Database | PostgreSQL 15 on Cloud SQL |
| Auth | JWT (python-jose) |
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| AI | Vertex AI Claude (5% of decisions) |
| Hosting | Cloud Run (backend), Firebase Hosting (frontend) |

---

## KEY MANTRAS

1. **"The Trojan Horse is everything"** - Layer 8 is the business model
2. **"Multi-tenant or bust"** - No shortcuts on data isolation
3. **"Layer 8 must be hidden"** - Vendors don't know they're tracked
4. **"Human-in-the-loop"** - AI recommends, humans approve
5. **"QR codes are the innovation"** - Not optional

---

## BEFORE STARTING ANY TASK

1. Read this briefing completely
2. Check `RULES.md` for coding standards
3. Review `ARCHITECTURE_PATTERNS.md` for implementation examples
4. Understand which user role the feature serves
5. Verify multi-tenant isolation in your implementation
6. Test that Layer 8 is blocked for vendor roles

---

## USER ROLES

| Role | Access | Description |
|------|--------|-------------|
| `client` | Own data only | Homeless individual receiving services |
| `caseworker` | Assigned clients | Vendor employee managing cases |
| `vendor_admin` | All vendor data | Manages vendor organization |
| `city_admin` | ALL + Layer 8 | City administrator with full access |
| `city_council` | ALL + Layer 8 | Elected officials, read-heavy access |

---

## CONTACT

- **CEO:** James (vision, strategy, UX decisions)
- **CTO:** Claude (architecture, technical decisions)
- **Communication:** Through this agent system

When in doubt about business logic, ask. When in doubt about architecture, check the patterns. When in doubt about user experience, escalate to James.
