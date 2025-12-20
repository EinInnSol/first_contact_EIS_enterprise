# COMPLETE PROJECT MEMORY - CLAUDE.md

---

## THE MISSION

Build First Contact E.I.S. - a platform that helps 2 million people achieve housing stability by eliminating waste in $7B annual homeless services funding.

---

## THE TROJAN HORSE (ENTIRE BUSINESS MODEL)

**What Vendors See (FREE):**
- AI case plans (one-click approval)
- Benefit calculator
- QR client intake
- Appointment coordination
- Auto compliance reports

→ **Vendors love it, adopt voluntarily**

**What Cities See (THE PRODUCT - $1,200/vendor/month):**
- Layer 8 accountability dashboard
- Vendor performance comparison
- Cost per outcome analysis
- Geographic heat maps
- Predictive analytics

→ **Cities see this, mandate adoption for ALL vendors**

**Revenue Model:**
1. Seed: Give vendors free software
2. Hook: Vendors can't work without it
3. Reveal: Show cities Layer 8
4. Mandate: City requires all vendors use it
5. Scale: 400+ CoCs nationwide = $115M+ ARR

---

## NON-NEGOTIABLE RULES

### 1. MULTI-TENANT ARCHITECTURE
**Every table MUST have organization_id**
- Tenant = City/CoC (not user type)
- PostgreSQL RLS enforces isolation
- set_tenant_context() called for every request
- Tests MUST verify Org A can't see Org B data

### 2. LAYER 8 SECURITY  
**Vendors CANNOT access Layer 8**
- HTTP 403 for caseworker, vendor_admin roles
- Only city_admin, city_council allowed
- If vendors discover Layer 8 → business fails
- Access tests MUST pass before deployment

### 3. GCP ONLY
**All infrastructure on Google Cloud**
- Cloud SQL PostgreSQL (not RDS, Azure, Supabase)
- Cloud Run (not Lambda, Heroku)
- Vertex AI Claude (not direct Anthropic API)
- Region: us-east5 for everything

### 4. TESTING REQUIRED
**No code ships without tests**
- Multi-tenant isolation: 100% coverage
- Layer 8 access control: 100% coverage
- Critical paths: 60%+ coverage

---

## TECH STACK

**Backend:**
- Python 3.11
- FastAPI (async)
- SQLAlchemy 2.0 (async ORM)
- PostgreSQL 15 (Cloud SQL)
- Vertex AI Claude 4.5

**Frontend:**
- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui components

**Infrastructure:**
- GCP project: einharjer-valhalla
- Region: us-east5
- Cloud Run (backend)
- Firebase Hosting (frontend)

---

## THE DEMO (< 5 minutes)

1. **QR Scan** (30s): Client scans → assigned to PATH
2. **AI Plan** (60s): Generate → caseworker approves  
3. **Benefits** (30s): Show SSI + CalFresh + GR stack
4. **Layer 8** (90s): Login as city → vendor comparison
5. **Mind Blown** (15s): "PATH: $21K, MHALA: $78K per placement"

**Result:** City says "We need to mandate this"

---

## COMMUNICATION GUIDELINES

### With James (CEO)
**ASK:** UX decisions, business strategy, budget, timeline
**TELL:** Technical approach, implementation done, ready for review

### With Desktop Claude (CTO)
**ASK:** Architecture unclear, stuck on technical issue
**TELL:** Week complete, at checkpoint, need decision

### What You Decide (No Permission)
- Code organization
- Testing strategies
- Implementation details
- Tech choices within GCP stack

---

## CHECKPOINTS (⛔)

**STOP at every ⛔ in SPRINT_PLAN.md:**
1. Complete week's tasks
2. Run all tests (multi-tenant + Layer 8 must PASS)
3. Update CURRENT_STATE.md
4. STOP and wait for review
5. Do NOT proceed until confirmed

**Why:** Prevents building wrong thing for 6 weeks

---

## KEY TERMINOLOGY

- **CoC** - Continuum of Care (regional coordinator)
- **Layer 8** - Hidden city dashboard (vendors don't know exists)
- **Trojan Horse** - Free vendor software with embedded tracking
- **VI-SPDAT** - Vulnerability assessment (0-17 score)
- **RLS** - Row-Level Security (PostgreSQL multi-tenant)
- **Benefit Stack** - Optimal government program combination

---

## MANTRAS

> "The Trojan Horse is everything"
> "Multi-tenant or bust"  
> "Layer 8 must be hidden"
> "This changes 400+ cities"

---

**Read this entire file before starting. Refer back when stuck.**
