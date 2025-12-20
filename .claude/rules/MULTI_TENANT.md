# MULTI-TENANT ARCHITECTURE RULES

## THE GOLDEN RULE

**EVERY table MUST have `organization_id`**

No exceptions. Ever.

---

## WHAT IS A TENANT?

**Tenant = City/CoC** (NOT user type)

- Tenant 1 = Long Beach CoC
- Tenant 2 = Pasadena CoC
- Tenant 3 = Oakland CoC

Each city's data is completely isolated.

---

## ENFORCEMENT LAYERS

### 1. Database Level (PostgreSQL RLS)
```sql
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON clients
  FOR ALL
  USING (organization_id = current_setting('app.organization_id')::INTEGER);
```

### 2. Application Level
```python
async def set_tenant_context(session: AsyncSession, org_id: int):
    await session.execute(
        text(f"SET app.organization_id = '{org_id}'")
    )
```

### 3. Model Level
```python
class TenantMixin:
    organization_id = Column(Integer, nullable=False, index=True)
```

---

## REQUIRED TESTS

```python
async def test_tenant_isolation_read():
    """Org 1 cannot read Org 2's data"""
    # Create client in Org 1
    await set_tenant_context(db, 1)
    client = Client(organization_id=1, first_name="Alice")
    
    # Try to read as Org 2
    await set_tenant_context(db, 2)
    result = await db.execute(select(Client))
    
    assert client not in result.scalars().all()
```

**This test MUST pass before deployment.**

---

## COMMON MISTAKES

❌ Assuming single tenant  
❌ Forgetting organization_id on new tables  
❌ Not setting tenant context  
❌ Using admin connection without RLS  

✅ Every table has organization_id  
✅ RLS enabled on ALL tables  
✅ Tests verify isolation  
✅ Context set for every request  
