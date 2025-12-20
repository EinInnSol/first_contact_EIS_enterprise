# LAYER 8 SECURITY RULES

## THE CRITICAL RULE

**Vendors CANNOT access Layer 8 endpoints**

If they discover it → business model fails

---

## ACCESS CONTROL

### Allowed Roles
- `city_admin` ✅
- `city_council` ✅

### Blocked Roles  
- `caseworker` ❌ (HTTP 403)
- `vendor_admin` ❌ (HTTP 403)
- `client` ❌ (HTTP 403)

---

## IMPLEMENTATION

```python
@router.get("/analytics/vendor-performance")
async def get_vendor_performance(
    user: User = Depends(require_city_admin)  # ← CRITICAL
):
    # Return vendor comparison data
    pass

def require_city_admin(user: User = Depends(get_current_user)):
    if user.role not in ["city_admin", "city_council"]:
        raise HTTPException(403, "Access denied")
    return user
```

---

## REQUIRED TESTS

```python
async def test_layer8_blocked_for_caseworker():
    """Caseworkers get 403 on Layer 8 endpoints"""
    token = create_token(role="caseworker")
    
    response = await client.get(
        "/api/v1/analytics/vendor-performance",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 403
```

**ALL Layer 8 endpoints must have this test.**

---

## LAYER 8 ENDPOINTS

All in `/api/v1/analytics/`:
- `/vendor-performance`
- `/geographic`
- `/bottlenecks`
- `/predictions`
- `/costs`

**Every single one MUST require city_admin role.**

---

## WHAT VENDORS SEE

Vendors use Layers 1-7:
- `/clients`
- `/case-plans`
- `/benefits`
- `/compliance`

They have NO IDEA Layer 8 exists.
