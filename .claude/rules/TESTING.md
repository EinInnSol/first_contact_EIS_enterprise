# TESTING REQUIREMENTS

## THE GOLDEN RULE

**No feature ships without tests**

---

## CRITICAL TESTS (MUST PASS)

### 1. Multi-Tenant Isolation
```python
def test_tenant_isolation_read():
    """Org 1 cannot read Org 2 data"""

def test_tenant_isolation_write():
    """Org 2 cannot modify Org 1 data"""

def test_cross_org_data_leak():
    """Queries don't leak across tenants"""
```

### 2. Layer 8 Access Control
```python
def test_layer8_blocked_caseworker():
    """Caseworkers get 403"""

def test_layer8_blocked_vendor_admin():
    """Vendor admins get 403"""

def test_layer8_allowed_city_admin():
    """City admins get 200"""

def test_all_layer8_endpoints_protected():
    """ALL analytics endpoints require city role"""
```

**These tests MUST pass before ANY deployment.**

---

## TEST FRAMEWORK

```python
# pytest + pytest-asyncio + httpx
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_client(client: AsyncClient):
    response = await client.post("/api/v1/clients", json={...})
    assert response.status_code == 201
```

---

## COVERAGE GOALS

- **Week 1-2:** 60% critical paths
- **Week 3-4:** 70% overall  
- **Week 5-6:** 80%+ overall

---

## RUN TESTS

```bash
# All tests
pytest

# Multi-tenant only
pytest tests/test_multi_tenant.py

# Layer 8 only  
pytest tests/test_layer8_access.py

# With coverage
pytest --cov=app tests/
```
