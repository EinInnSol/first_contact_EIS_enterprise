# CODING RULES - FIRST CONTACT E.I.S.
## All Agents Must Follow These Standards

---

## PYTHON / FASTAPI RULES

### File Structure
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app, middleware
│   ├── config.py            # Pydantic settings
│   ├── database.py          # SQLAlchemy + RLS setup
│   ├── models/              # SQLAlchemy models
│   ├── schemas/             # Pydantic schemas
│   ├── api/
│   │   ├── deps.py          # Dependencies (auth, RLS)
│   │   └── v1/              # Versioned endpoints
│   ├── services/            # Business logic
│   └── utils/               # Helpers
├── tests/
├── alembic/
├── requirements.txt
└── Dockerfile
```

### Type Hints Required
```python
# CORRECT
async def get_client(client_id: UUID, db: AsyncSession) -> Client:
    ...

# WRONG - No type hints
async def get_client(client_id, db):
    ...
```

### Async Everything
```python
# CORRECT - Use async/await
async def get_clients(db: AsyncSession) -> list[Client]:
    result = await db.execute(select(Client))
    return result.scalars().all()

# WRONG - Sync operations
def get_clients(db: Session) -> list[Client]:
    return db.query(Client).all()
```

### Pydantic Schemas for All I/O
```python
# CORRECT - Request/Response schemas
class ClientCreate(BaseModel):
    first_name: str
    last_name: str
    organization_id: int

class ClientResponse(BaseModel):
    id: UUID
    first_name: str
    last_name: str
    
    class Config:
        from_attributes = True

# WRONG - Raw dicts
@router.post("/clients")
async def create_client(data: dict):  # Never accept raw dict
    ...
```

---

## MULTI-TENANT RULES (CRITICAL)

### Every Model Inherits TenantMixin
```python
# CORRECT
class Client(Base, TenantMixin):
    __tablename__ = "clients"
    id = Column(UUID, primary_key=True)
    # organization_id inherited from TenantMixin

# WRONG - Missing organization_id
class Client(Base):
    __tablename__ = "clients"
    id = Column(UUID, primary_key=True)
    # No organization_id = SECURITY FAILURE
```

### Always Set Tenant Context
```python
# CORRECT - Set RLS context before queries
async def get_db_with_tenant(
    org_id: int,
    db: AsyncSession = Depends(get_db)
) -> AsyncSession:
    await db.execute(text(f"SET app.organization_id = '{org_id}'"))
    return db

# WRONG - Query without tenant context
async def get_clients(db: AsyncSession):
    # RLS not set = potential data leak
    return await db.execute(select(Client))
```

### Include organization_id in All Queries
```python
# CORRECT - Explicit org filter (belt AND suspenders with RLS)
async def get_client(
    client_id: UUID,
    org_id: int,
    db: AsyncSession
) -> Client:
    result = await db.execute(
        select(Client).where(
            Client.id == client_id,
            Client.organization_id == org_id  # Explicit check
        )
    )
    return result.scalar_one_or_none()
```

---

## LAYER 8 ACCESS CONTROL (CRITICAL)

### Use Role Dependencies
```python
# CORRECT - Block vendors from Layer 8
from app.api.deps import require_city_admin

@router.get("/analytics/vendors")
async def get_vendor_analytics(
    user: User = Depends(require_city_admin)  # Returns 403 for vendors
):
    ...

# WRONG - No role check
@router.get("/analytics/vendors")
async def get_vendor_analytics():  # Anyone can access = BUSINESS MODEL FAILURE
    ...
```

### The Role Dependency Implementation
```python
# In app/api/deps.py
def require_role(*allowed_roles: str):
    async def check_role(user: User = Depends(get_current_user)):
        if user.role not in allowed_roles:
            raise HTTPException(
                status_code=403,
                detail="Access denied"
            )
        return user
    return check_role

require_city_admin = require_role("city_admin", "city_council")
require_vendor_access = require_role("caseworker", "vendor_admin", "city_admin")
```

---

## API ENDPOINT RULES

### Versioned Routes
```python
# CORRECT - Version prefix
router = APIRouter(prefix="/api/v1/clients", tags=["clients"])

# WRONG - No version
router = APIRouter(prefix="/clients")
```

### Consistent Response Format
```python
# CORRECT - Pydantic response model
@router.get("/{client_id}", response_model=ClientResponse)
async def get_client(...):
    ...

# CORRECT - List response
@router.get("/", response_model=list[ClientResponse])
async def list_clients(...):
    ...
```

### Error Handling
```python
# CORRECT - Specific HTTP exceptions
if not client:
    raise HTTPException(status_code=404, detail="Client not found")

if user.role not in allowed_roles:
    raise HTTPException(status_code=403, detail="Access denied")

# WRONG - Generic exceptions
if not client:
    raise Exception("Not found")  # Returns 500, not 404
```

---

## DATABASE RULES

### Use UUID Primary Keys for Client-Facing IDs
```python
from uuid import uuid4
from sqlalchemy.dialects.postgresql import UUID

id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
```

### Use Integer for Internal References
```python
organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=False)
vendor_id = Column(Integer, ForeignKey("vendors.id"))
```

### Always Include Timestamps
```python
created_at = Column(DateTime, default=func.now(), nullable=False)
updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
```

---

## TESTING RULES

### Test Multi-Tenant Isolation
```python
# REQUIRED TEST
async def test_tenant_isolation():
    """Org 1 cannot see Org 2's data"""
    # Create data in Org 1
    await set_tenant_context(db, 1)
    client = await create_client(org_id=1)
    
    # Query as Org 2
    await set_tenant_context(db, 2)
    result = await get_clients(db)
    
    # Org 1's client must NOT appear
    assert client.id not in [c.id for c in result]
```

### Test Layer 8 Access Control
```python
# REQUIRED TEST
async def test_layer8_blocked_for_vendor():
    """Vendors get 403 on Layer 8 endpoints"""
    token = create_token(role="caseworker")
    response = await client.get(
        "/api/v1/analytics/vendors",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 403
```

---

## NAMING CONVENTIONS

| Type | Convention | Example |
|------|------------|---------|
| Files | snake_case | `client_service.py` |
| Classes | PascalCase | `ClientService` |
| Functions | snake_case | `get_client_by_id` |
| Constants | UPPER_SNAKE | `DEFAULT_PAGE_SIZE` |
| API routes | kebab-case | `/api/v1/case-plans` |
| DB tables | snake_case plural | `case_plans` |

---

## COMMIT MESSAGE FORMAT

```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

Examples:
- `feat(api): add QR intake endpoint`
- `fix(auth): correct JWT expiration handling`
- `test(rls): add multi-tenant isolation tests`
