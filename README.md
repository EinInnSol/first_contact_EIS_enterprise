# First Contact E.I.S.

**Emergency Information System**  
A Multi-Tenant AI Orchestration Platform for Homeless Services Coordination

---

## 🎯 MISSION

Transform how $7+ billion in annual homeless services funding delivers outcomes by providing cities unprecedented accountability visibility into vendor performance.

**The Problem:** Long Beach spent $54M in 2024 to house 71 people ($760K per person). Cities have zero visibility into which vendors actually deliver results.

**The Solution:** A "Trojan Horse" platform that vendors love (free efficiency software) while secretly generating Layer 8 accountability data that cities use to mandate adoption.

---

## 🚀 QUICK START

**New to this project? Start here:**

1. Read `START_HERE.md` (your entry point)
2. Read `.claude/CLAUDE.md` (complete project context)
3. Read `docs/ARCHITECTURE.md` (technical blueprint)
4. Follow `GCP_SETUP.md` (get environment ready)
5. Execute `SPRINT_PLAN.md` (6-week build plan)

---

## 📁 PROJECT STRUCTURE

```
FirstContactEIS/
├── README.md                   ← YOU ARE HERE
├── .gitignore                  ← Git configuration
├── backend/                    ← FastAPI Application (Python)
│   ├── app/                    ← Application Source
│   ├── scripts/                ← Utility scripts
│   └── tests/                  ← Pytest suite
├── frontend/                   ← Next.js Application (TypeScript)
│   ├── src/                    ← Application Source
│   └── public/                 ← Static assets
├── docs/                       ← Documentation
│   ├── project_history/        ← Archived build plans & logs
│   ├── ARCHITECTURE.md         ← Technical Blueprint
│   └── VISION_MANIFESTO.md     ← Product Vision
├── scripts/                    ← Deployment & Setup Scripts
│   ├── windows/                ← PowerShell & Batch files
│   └── linux/                  ← Bash scripts
└── bin/                        ← Development tools (ignored by git)
```

---

## 🏗️ THE ARCHITECTURE

### The Stack
- **Backend:** Python 3.11, FastAPI, SQLAlchemy (async)
- **Database:** PostgreSQL 15 on Cloud SQL (Row-Level Security)
- **Frontend:** Next.js 15, TypeScript, Tailwind CSS
- **AI:** Vertex AI Claude 4.5 Sonnet
- **Infrastructure:** Google Cloud Platform (`einharjer-valhalla`)
- **Region:** us-east5

### The Innovation: Trojan Horse

**What Vendors See (Free):**
- AI case plan generation (one-click approval)
- Benefit stack calculator (optimal combinations)
- Multi-agency appointment coordination
- QR code client intake system
- Automated compliance reporting

**What Cities See (The Product):**
- Layer 8 accountability dashboard
- Vendor performance comparison (cost per outcome)
- Geographic heat maps (QR scan data)
- Predictive analytics (ML-powered)
- Strategic recommendations ("calling audibles")

**The Business Model:**
1. Vendors adopt voluntarily (saves 3+ hours daily)
2. Platform collects performance data silently
3. Cities see Layer 8, realize they need it
4. Cities mandate platform for ALL vendors
5. Revenue: $1,200/vendor/month (city pays)

---

## 🎯 NON-NEGOTIABLE RULES

### 1. Multi-Tenant Architecture
**EVERY table has `organization_id`.**  
PostgreSQL RLS enforces isolation even if code has bugs.

### 2. Layer 8 Must Be Hidden
**Vendors CANNOT access Layer 8 endpoints.**  
HTTP 403 for non-city roles. If vendors discover it → business fails.

### 3. GCP Only
**All infrastructure on Google Cloud Platform.**  
No AWS, Azure, or self-hosted anything.

### 4. Testing Required
**No feature ships without tests.**  
Multi-tenant isolation and Layer 8 security tests MUST pass.

*See `.claude/rules/` for detailed enforcement.*

---

## 📅 6-WEEK BUILD PLAN

| Week | Focus | Deliverable | Checkpoint |
|------|-------|-------------|------------|
| 1 | Foundation | Database + RLS + Tests | ⛔ Review |
| 2 | Backend API | Auth + Endpoints + Deploy | ⛔ Review |
| 3 | QR & AI | Intake + Case Plans + Benefits | ⛔ Review |
| 4 | Layer 8 | Analytics + Access Control | ⛔ Review |
| 5 | Frontend | Dashboards + QR Page | ⛔ Review |
| 6 | Demo | Polish + Video + Docs | ⛔ Final |

**Each ⛔ checkpoint requires Desktop Claude review before proceeding.**

---

## 🎬 DEMO SUCCESS CRITERIA

The demo must prove the Trojan Horse works:

1. **QR Intake** (30 sec): Scan code → client auto-assigned to vendor
2. **AI Case Plan** (60 sec): Generate plan → caseworker clicks APPROVE
3. **Benefit Stack** (30 sec): Show optimal SSI + CalFresh + GR combo
4. **Layer 8 Reveal** (90 sec): Login as city → vendor comparison dashboard
5. **Mind Blown Moment** (15 sec): "PATH costs $21K per placement, MHALA costs $78K"

**Total demo time: < 5 minutes**

---

## 💼 THE TEAM

**James Fernstrom** - CEO  
Vision, strategy, business development, client relationships

**Desktop Claude** - CTO  
Architecture, planning, research, strategic decisions

**Claude Code** - Implementation Partner  
Building the platform, following the blueprint

---

## 🌟 THE IMPACT

**Current State:**
- $7+ billion spent annually on homeless services
- ~650,000 people experiencing homelessness
- Average cost: $40K-80K per person housed
- Cities have zero vendor accountability

**With First Contact E.I.S.:**
- Same $7B budget
- 2-3x more people helped (through efficiency)
- Real-time vendor performance data
- Automatic accountability via smart contracts (V3.0)

**Over 10 years: 1-2 million additional people helped.**

Not through raising more money. Through eliminating waste.

---

## 📊 MARKET OPPORTUNITY

| Metric | Value |
|--------|-------|
| Annual US Homeless Services Spending | $7+ billion |
| Number of Continuums of Care | 400+ |
| Estimated Vendors Nationwide | 8,000+ |
| Price per Vendor (monthly) | $1,200 |
| **Total Addressable Market (ARR)** | **$115M+** |

**Year 1 Target:** Long Beach (20 vendors) = $288K ARR  
**Year 2 Target:** 6 cities (147 vendors) = $2.1M ARR  
**Year 5 Target:** 80 cities (2,000 vendors) = $28.8M ARR

---

## 🚦 CURRENT STATUS

**As of Dec 19, 2025:**

✅ Complete architecture designed  
✅ Database schema defined  
✅ API structure planned  
✅ Handoff package ready  
❌ Nothing deployed yet  
❌ Ready for implementation  

See `CURRENT_STATE.md` for detailed progress tracking.

---

**Let's build something that actually helps 2 million people.**
