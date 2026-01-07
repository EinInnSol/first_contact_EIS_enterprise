# 6-WEEK SPRINT PLAN

**Goal:** Demo-ready First Contact E.I.S. platform deployed to GCP

---

## WEEK 1: Foundation & Database ⛔

### Tasks
1. Install & configure gcloud CLI
2. Deploy Cloud SQL PostgreSQL database
3. Run DATABASE_SCHEMA.sql (with RLS policies)
4. Load seed data (Long Beach + 4 vendors)
5. Write multi-tenant isolation tests
6. Verify RLS works correctly

### Success Criteria
- [ ] Database deployed on Cloud SQL
- [ ] All tables have organization_id
- [ ] RLS policies active
- [ ] Multi-tenant tests PASS
- [ ] Can query as Org 1, cannot see Org 2 data

### Deliverable
Working database with bulletproof multi-tenant isolation

⛔ **CHECKPOINT 1: Stop here for Desktop Claude review**

---

## WEEK 2: Backend API Core ⛔

### Tasks
1. Create FastAPI project structure
2. Implement SQLAlchemy models (async)
3. Build JWT authentication
4. Create client CRUD endpoints
5. Deploy to Cloud Run
6. Test API via HTTPS

### Success Criteria
- [ ] FastAPI app running locally
- [ ] JWT auth working
- [ ] Can create/read/update clients
- [ ] Deployed to Cloud Run
- [ ] HTTPS endpoint accessible

### Deliverable
Working REST API deployed to production

⛔ **CHECKPOINT 2: Stop here for Desktop Claude review**

---

## WEEK 3: QR System & AI ⛔

### Tasks
1. Build public QR intake endpoint (no auth)
2. Integrate Vertex AI Claude
3. Implement benefit stack calculator
4. Build AI case plan generator
5. Create approval workflow endpoints

### Success Criteria
- [ ] QR scan creates client record
- [ ] Client auto-assigned to vendor
- [ ] Vertex AI generates case plans
- [ ] Benefit calculator works
- [ ] Caseworker can approve/reject plans

### Deliverable
Working QR intake + AI case generation

⛔ **CHECKPOINT 3: Stop here for Desktop Claude review**

---

## WEEK 4: Layer 8 Analytics ⛔

### Tasks
1. Calculate vendor performance metrics
2. Create Layer 8 endpoints (analytics.py)
3. Implement access control (city-only)
4. Generate synthetic comparison data
5. Test vendor access blocked (403)

### Success Criteria
- [ ] Vendor metrics calculated correctly
- [ ] Layer 8 endpoints return data for cities
- [ ] Layer 8 endpoints return 403 for vendors
- [ ] Access control tests PASS
- [ ] Comparison data looks realistic

### Deliverable
Hidden accountability dashboard (Layer 8)

⛔ **CHECKPOINT 4: Stop here for Desktop Claude review**

---

## WEEK 5: Frontend Dashboards ⛔

### Tasks
1. Create Next.js project
2. Build caseworker dashboard
3. Build city analytics dashboard
4. Create mobile QR intake page
5. Deploy to Firebase Hosting

### Success Criteria
- [ ] Caseworker can view clients
- [ ] Caseworker can approve AI plans
- [ ] City admin sees Layer 8 dashboard
- [ ] QR page works on mobile
- [ ] Frontend deployed and live

### Deliverable
Complete UI for all user types

⛔ **CHECKPOINT 5: Stop here for Desktop Claude review**

---

## WEEK 6: Demo Polish & Launch ⛔

### Tasks
1. Write demo script
2. Create demo video (record backup)
3. Polish synthetic data
4. Create demo accounts (caseworker, city admin)
5. Practice demo 10+ times
6. Prepare presentation materials

### Success Criteria
- [ ] 5-minute demo flow works perfectly
- [ ] Video backup exists
- [ ] Demo accounts ready
- [ ] Data looks professional
- [ ] Confident presenting

### Deliverable
Demo-ready platform for Long Beach pitch

⛔ **FINAL CHECKPOINT: Ready for city presentation**

---

## The Demo Flow (< 5 minutes)

1. **QR Intake** (30s): Scan → Client assigned to PATH
2. **AI Plan** (60s): Generate → Caseworker approves
3. **Benefits** (30s): Optimal stack shown
4. **Layer 8 Reveal** (90s): Login as city → Vendor comparison
5. **Mind Blown** (15s): "PATH: $21K, MHALA: $78K per placement"

---

**Update CURRENT_STATE.md after each checkpoint**
