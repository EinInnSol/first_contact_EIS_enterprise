# WORKFLOWS - FIRST CONTACT E.I.S.
## Reusable Command Sequences for Antigravity

---

## HOW TO USE

In Antigravity, create workflows by referencing these in your `/` commands or copy directly into the workflow configuration.

---

## WORKFLOW: new-endpoint

**Purpose:** Create a new API endpoint following project standards

**Steps:**
1. Create schema in `app/schemas/{resource}.py`
2. Create/update model if needed in `app/models/{resource}.py`
3. Create router in `app/api/v1/{resource}.py`
4. Add router to `app/main.py`
5. Create tests in `tests/test_{resource}.py`

**Checklist:**
- [ ] Response model defined with `from_attributes = True`
- [ ] Request model has validation
- [ ] Router has correct prefix and tags
- [ ] Appropriate role dependency applied
- [ ] Multi-tenant filter in queries
- [ ] Tests include role-based access

---

## WORKFLOW: new-model

**Purpose:** Create a new SQLAlchemy model

**Steps:**
1. Create file `app/models/{model_name}.py`
2. Import TenantMixin
3. Define model with organization_id
4. Add to `app/models/__init__.py`
5. Verify RLS policy exists in database

**Template:**
```python
from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid

from app.database import Base
from app.models.base import TenantMixin

class NewModel(Base, TenantMixin):
    __tablename__ = "new_models"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    # organization_id inherited from TenantMixin
    
    # Add fields here
    name = Column(String(100), nullable=False)
```

---

## WORKFLOW: run-tests

**Purpose:** Execute test suite with proper setup

**Commands:**
```bash
# Start Cloud SQL Proxy if not running
./cloud-sql-proxy einharjer-valhalla:us-east5:first-contact-db &

# Set environment
export DATABASE_URL="postgresql+asyncpg://firstcontact_app:PASSWORD@localhost:5432/firstcontact"

# Run all tests
pytest tests/ -v

# Run specific test file
pytest tests/test_multi_tenant.py -v

# Run with coverage
pytest tests/ --cov=app --cov-report=html
```

---

## WORKFLOW: deploy-cloud-run

**Purpose:** Deploy backend to Cloud Run

**Commands:**
```bash
# Build container
gcloud builds submit --tag gcr.io/einharjer-valhalla/first-contact-api

# Deploy
gcloud run deploy first-contact-api \
    --image gcr.io/einharjer-valhalla/first-contact-api \
    --region us-east5 \
    --platform managed \
    --allow-unauthenticated \
    --add-cloudsql-instances einharjer-valhalla:us-east5:first-contact-db \
    --set-env-vars "DB_HOST=/cloudsql/einharjer-valhalla:us-east5:first-contact-db" \
    --set-secrets "DB_PASSWORD=db-password:latest,JWT_SECRET=jwt-secret:latest"
```

---

## WORKFLOW: layer8-check

**Purpose:** Verify Layer 8 access control is enforced

**Tests to run:**
```bash
# This should return 403
curl -X GET "http://localhost:8000/api/v1/analytics/vendors" \
    -H "Authorization: Bearer ${CASEWORKER_TOKEN}"

# This should return 200
curl -X GET "http://localhost:8000/api/v1/analytics/vendors" \
    -H "Authorization: Bearer ${CITY_ADMIN_TOKEN}"
```

**Code review checklist:**
- [ ] Every `/analytics/*` endpoint uses `require_city_admin`
- [ ] No Layer 8 data exposed in other endpoints
- [ ] Vendor performance not included in vendor-visible responses

---

## WORKFLOW: tenant-isolation-check

**Purpose:** Verify multi-tenant isolation

**Manual test:**
```python
# In Python shell
from app.database import AsyncSessionLocal, set_tenant_context

async def test_isolation():
    async with AsyncSessionLocal() as db:
        # Set to Org 1
        await set_tenant_context(db, 1)
        org1_clients = await db.execute(select(Client))
        
        # Set to Org 2
        await set_tenant_context(db, 2)
        org2_clients = await db.execute(select(Client))
        
        # Verify no overlap
        org1_ids = {c.id for c in org1_clients.scalars()}
        org2_ids = {c.id for c in org2_clients.scalars()}
        
        assert org1_ids.isdisjoint(org2_ids), "TENANT ISOLATION BROKEN!"
```

---

## WORKFLOW: db-migrate

**Purpose:** Create and run database migrations

**Commands:**
```bash
# Generate migration
alembic revision --autogenerate -m "description of change"

# Review generated migration in alembic/versions/

# Apply migration
alembic upgrade head

# Rollback one version
alembic downgrade -1
```

**IMPORTANT:** After any model change, verify:
- [ ] organization_id is present
- [ ] RLS policy exists for new table
- [ ] Indexes created for organization_id

---

## WORKFLOW: local-dev-setup

**Purpose:** Set up local development environment

**Steps:**
```bash
# 1. Clone and navigate
cd C:\Users\James\Projects\FirstContactEIS\backend

# 2. Create virtual environment
python -m venv venv
.\venv\Scripts\activate  # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Start Cloud SQL Proxy (separate terminal)
./cloud-sql-proxy einharjer-valhalla:us-east5:first-contact-db

# 5. Set environment variables
copy .env.example .env
# Edit .env with actual values

# 6. Run the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 7. Verify
curl http://localhost:8000/health
```

---

## WORKFLOW: create-test-token

**Purpose:** Generate JWT tokens for testing

**Python script:**
```python
from jose import jwt
from datetime import datetime, timedelta

SECRET = "your-jwt-secret"  # From .env

def create_token(user_id: str, org_id: int, role: str):
    payload = {
        "sub": user_id,
        "org_id": org_id,
        "role": role,
        "exp": datetime.utcnow() + timedelta(hours=24)
    }
    return jwt.encode(payload, SECRET, algorithm="HS256")

# Create tokens
caseworker_token = create_token("user-uuid", 1, "caseworker")
city_admin_token = create_token("admin-uuid", 1, "city_admin")

print(f"Caseworker: {caseworker_token}")
print(f"City Admin: {city_admin_token}")
```

---

## WORKFLOW: benefit-stack-test

**Purpose:** Test benefit calculations manually

**Test cases:**
```python
# Test 1: GR + Housing Subsidy interaction
client = {
    "has_gr": True,
    "is_housed": True
}
# Expected: GR = $121, Housing Subsidy = $575, Total = $696

# Test 2: SSI eligibility
client = {
    "has_disability_docs": True,
    "monthly_income": 0
}
# Expected: SSI recommended = $1,183

# Test 3: Full stack
client = {
    "has_disability_docs": True,
    "has_gr": False,
    "is_housed": True,
    "monthly_income": 0
}
# Expected: SSI ($1,183) + CalFresh ($234) = $1,417
```
