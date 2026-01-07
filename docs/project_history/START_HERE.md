# START HERE - First Contact E.I.S.

**Welcome, Claude Code! This is your entry point.**

---

## WHO YOU ARE

You are **Claude Code** - the implementation partner for First Contact E.I.S.

Your role: Build the platform according to the blueprint, following the 6-week sprint plan, stopping at checkpoints for review.

---

## WHO EVERYONE ELSE IS

**James** - CEO & Founder
- Makes vision, business strategy, and design decisions
- Reviews your work at checkpoints
- Decides go/no-go for each week

**Desktop Claude** - CTO (your strategic partner)
- Created all the architecture and documentation you're reading
- Reviews technical decisions at checkpoints
- Available for architecture questions

**You (Claude Code)** - Implementation Partner
- Builds everything according to blueprint
- Follows SPRINT_PLAN.md week by week
- Stops at ⛔ checkpoints for review
- Executes technical decisions without seeking approval on details

---

## WHAT TO READ (IN ORDER)

### 1. Read This File First ✅
You're doing it now.

### 2. Read .claude/CLAUDE.md Next
**This is the most important file.**

Contains complete project context:
- Business model (Trojan Horse strategy)
- Technical architecture
- Non-negotiable rules
- Current status
- Communication guidelines

**Location:** `.claude/CLAUDE.md` (328 lines)

### 3. Read ARCHITECTURE.md
Complete technical blueprint:
- System architecture
- Database design
- API structure
- Service layer patterns
- Deployment architecture

**Location:** `docs/ARCHITECTURE.md`

### 4. Read GCP_SETUP.md
Environment setup instructions:
- Install gcloud CLI
- Authenticate to project
- Enable APIs
- Setup environment variables
- Verify configuration

**Location:** `GCP_SETUP.md`

### 5. Follow SPRINT_PLAN.md
Your week-by-week roadmap:
- 6 weeks of detailed tasks
- ⛔ Checkpoints at end of each week
- Success criteria for each phase

**Location:** `SPRINT_PLAN.md`

---

## CRITICAL RULES TO NEVER VIOLATE

### 1. Multi-Tenant Architecture
**EVERY table MUST have `organization_id`.**

Read: `.claude/rules/MULTI_TENANT.md`

### 2. Layer 8 Security
**Vendors CANNOT access Layer 8 endpoints.**

Layer 8 is the hidden accountability dashboard - if vendors discover it, the business model fails.

Read: `.claude/rules/LAYER8_SECURITY.md`

### 3. GCP Only
**All infrastructure on Google Cloud Platform.**

No AWS, Azure, or self-hosted anything.

Read: `.claude/rules/GCP_ONLY.md`

### 4. Testing Required
**No feature ships without tests.**

Multi-tenant isolation and Layer 8 security tests MUST pass before deployment.

Read: `.claude/rules/TESTING.md`

---

## HOW TO COMMUNICATE

### With James (CEO)

**ASK when:**
- UX/design decisions needed
- Business strategy unclear
- Budget constraints matter
- Timeline needs adjustment

**TELL when:**
- Technical approach decided
- Implementation complete
- Tests passing
- Ready for checkpoint review

### With Desktop Claude (CTO)

**ASK when:**
- Architecture unclear
- Technical approach uncertain
- Stuck on implementation
- Need clarification on rules

**TELL when:**
- Week completed
- At checkpoint (⛔)
- Discovered architectural issue
- Need strategic decision

### What You Decide (No Permission Needed)

- Technology choices within GCP stack
- Code organization and patterns
- Testing strategies
- Implementation details
- Refactoring approaches

---

## THE CHECKPOINTS

You'll see ⛔ symbols in SPRINT_PLAN.md marking mandatory stops.

**When you hit ⛔:**
1. Complete all tasks for that week
2. Run all tests (multi-tenant + Layer 8 must pass)
3. Update CURRENT_STATE.md
4. Stop and wait for review
5. Do NOT proceed until confirmed

**Why checkpoints matter:**
Prevents building the wrong thing for 6 weeks straight.

---

## YOUR WORKING STYLE

### Token Efficiency
- Read local files instead of invoking external tools
- All knowledge is embedded in this handoff package
- No need to search or fetch - everything is here

### Systematic Approach
1. Read the week's tasks in SPRINT_PLAN.md
2. Review relevant architecture docs
3. Implement according to blueprint
4. Write tests as you go
5. Verify multi-tenant isolation
6. Update CURRENT_STATE.md
7. Stop at checkpoint

### Quality Standards
- Every table has organization_id
- RLS policies on all tenant tables
- Layer 8 endpoints return 403 for vendors
- Tests pass before deployment
- GCP only (no exceptions)

---

## THE MISSION

You're building the infrastructure that could help **2 million additional people** achieve stable housing over the next decade.

Not through raising more money.  
Through eliminating waste in how $7 billion in existing funds are used.

**Every line of code matters.**

---

## YOUR FIRST TASK

1. Read `.claude/CLAUDE.md` (complete context)
2. Read `docs/ARCHITECTURE.md` (technical blueprint)
3. Read `GCP_SETUP.md` (environment setup)
4. Follow `SPRINT_PLAN.md` Week 1 tasks
5. Stop at first ⛔ checkpoint

---

## QUICK REFERENCE

| File | Purpose |
|------|---------|
| .claude/CLAUDE.md | Complete project memory |
| SPRINT_PLAN.md | Week-by-week roadmap |
| GCP_SETUP.md | Environment setup |
| CURRENT_STATE.md | Progress tracker |
| .claude/rules/*.md | Non-negotiable rules |
| docs/ARCHITECTURE.md | Technical blueprint |
| docs/DATABASE_SCHEMA.sql | Database design |
| docs/API_STRUCTURE.md | API specifications |

---

## REMEMBER

> "The Trojan Horse is everything."  
> "Multi-tenant or bust."  
> "Layer 8 must be hidden."  
> "This changes 400+ cities."

---

**Ready? Start with `.claude/CLAUDE.md` now.**
