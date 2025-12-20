# API STRUCTURE - FIRST CONTACT E.I.S.

## Base URL
```
Production: https://api.firstcontact-eis.com/v1
Development: http://localhost:8000/api/v1
```

## Authentication
All endpoints require JWT Bearer token except public intake.

```
Authorization: Bearer <jwt_token>
```

JWT payload includes:
```json
{
  "sub": "user_uuid",
  "org_id": 1,
  "vendor_id": 101,  // null for city admins
  "role": "caseworker",
  "exp": 1234567890
}
```

---

## ENDPOINTS BY LAYER

### PUBLIC (No Auth Required)

#### QR Intake
```
POST /intake/qr/{qr_location_id}
```
Client scans QR code and submits intake form.

Request:
```json
{
  "first_name": "Marcus",
  "last_name": "Thompson",
  "date_of_birth": "1985-03-15",
  "phone": "562-555-1234",
  "email": "marcus@email.com",
  "vi_spdat_responses": {
    "q1_homeless_duration": 3,
    "q2_emergency_services": 2,
    // ... 40 questions
  }
}
```

Response:
```json
{
  "success": true,
  "case_number": "LB-2847",
  "assigned_vendor": "PATH",
  "message": "Your caseworker Sarah will contact you within 24 hours."
}
```

---

### LAYERS 1-7 (Vendor Access)

#### Clients

```
GET /clients
```
List clients (filtered by caseworker assignment for caseworkers, all for vendor_admin)

Query params: `?status=enrolled&page=1&limit=20`

```
GET /clients/{client_id}
```
Get client details

```
PATCH /clients/{client_id}
```
Update client info

---

#### Case Plans

```
GET /clients/{client_id}/case-plans
```
List case plans for client

```
GET /case-plans/{plan_id}
```
Get specific case plan with actions

```
POST /clients/{client_id}/case-plans/generate
```
Generate AI case plan (creates pending plan)

Response:
```json
{
  "id": "uuid",
  "client_id": "uuid",
  "status": "pending",
  "recommended_pathway": "sober_living",
  "summary": "Based on VI-SPDAT score of 9 and active substance use...",
  "reasoning": [
    "High medical urgency (8/10)",
    "Willing to enter treatment",
    "No disability documentation yet"
  ],
  "actions": [
    {
      "type": "appointment",
      "description": "DPSS - CalFresh/GR/Medi-Cal",
      "provider": "DPSS Long Beach",
      "suggested_date": "2025-11-28",
      "suggested_time": "10:00",
      "transport_needed": true
    }
  ],
  "benefit_stack": {
    "immediate": ["calfresh", "gr", "medi_cal"],
    "pending": ["ssi"],
    "projected_income": 1417,
    "projected_expenses": 550,
    "projected_net": 867
  },
  "projected_stability_days": 120,
  "confidence_score": 0.85
}
```

```
POST /case-plans/{plan_id}/approve
```
Approve case plan (triggers scheduling)

```
POST /case-plans/{plan_id}/modify
```
Modify and approve

```
POST /case-plans/{plan_id}/reject
```
Reject with reason

---

#### Benefit Stack

```
GET /clients/{client_id}/benefits
```
Get current benefit enrollments

```
GET /clients/{client_id}/benefits/projection
```
Get AI-generated benefit stack projection

Response:
```json
{
  "current_monthly_income": 234,
  "projected_monthly_income": 1417,
  "programs": {
    "active": [
      {"code": "calfresh", "amount": 234, "status": "active"}
    ],
    "pending": [
      {"code": "gr", "amount": 221, "status": "applied", "expected_date": "2025-12-15"}
    ],
    "recommended": [
      {"code": "ssi", "amount": 1183, "timeline": "3-6 months", "requirements": ["disability_documentation"]}
    ]
  },
  "notes": [
    "GR amount will reduce to $121 when GR Housing Subsidy activated",
    "IHSS available after SSI approval - can pay family caregiver"
  ]
}
```

```
POST /clients/{client_id}/benefits/{program_code}/apply
```
Mark benefit as applied

```
PATCH /clients/{client_id}/benefits/{enrollment_id}
```
Update benefit status (approved, denied, etc.)

---

#### Actions & Appointments

```
GET /actions
```
List pending actions for caseworker

Query: `?status=pending&date=2025-11-28`

```
PATCH /actions/{action_id}
```
Update action status

```
POST /actions/{action_id}/complete
```
Mark action completed

---

#### Orchestrator ("Calling Audibles")

```
GET /orchestrator/recommendations
```
Get pending AI recommendations for caseworker

Response:
```json
{
  "recommendations": [
    {
      "id": "uuid",
      "type": "appointment_optimization",
      "priority": "high",
      "summary": "Bump Robert to today's cancelled 2pm slot?",
      "reasoning": [
        "Higher urgency (8/10 vs 6/10)",
        "All documents ready",
        "On existing transport route"
      ],
      "actions": [
        {"action": "cancel_appointment", "client": "Maria", "details": "..."},
        {"action": "book_appointment", "client": "Robert", "details": "..."},
        {"action": "update_transport", "client": "Robert", "details": "..."},
        {"action": "send_sms", "client": "Robert", "details": "..."}
      ],
      "estimated_execution_time": "60 seconds",
      "manual_equivalent": "2-4 hours"
    }
  ]
}
```

```
POST /orchestrator/recommendations/{id}/approve
```
Approve and execute recommendation

```
POST /orchestrator/recommendations/{id}/reject
```
Reject with reason

---

#### Compliance Reports

```
GET /compliance/reports
```
List compliance reports

```
GET /compliance/reports/{report_id}
```
Get report details and data

```
POST /compliance/reports/generate
```
Generate new report

Request:
```json
{
  "report_type": "hud_apr",
  "period_start": "2025-07-01",
  "period_end": "2025-09-30"
}
```

```
POST /compliance/reports/{report_id}/review
```
Mark as reviewed

```
POST /compliance/reports/{report_id}/send
```
Send report to recipient

---

### LAYER 8 (City Admin Only)

**ACCESS CONTROL:** All Layer 8 endpoints return `403 Forbidden` for roles other than `city_admin` and `city_council`.

#### Vendor Performance

```
GET /analytics/vendors
```
Get all vendor performance metrics

Response:
```json
{
  "period": {"start": "2025-10-01", "end": "2025-10-31"},
  "vendors": [
    {
      "id": 101,
      "name": "PATH",
      "metrics": {
        "total_clients": 147,
        "housed_count": 43,
        "housing_rate": 0.29,
        "avg_exit_income": 1200,
        "avg_days_to_housing": 45,
        "avg_cost_per_client": 23000,
        "retention_6mo": 0.82,
        "no_show_rate": 0.08
      }
    },
    {
      "id": 104,
      "name": "MHALA",
      "metrics": {
        "total_clients": 89,
        "housed_count": 21,
        "housing_rate": 0.24,
        "avg_exit_income": 400,
        "avg_days_to_housing": 112,
        "avg_cost_per_client": 82000,
        "retention_6mo": 0.45,
        "no_show_rate": 0.22
      }
    }
  ]
}
```

```
GET /analytics/vendors/{vendor_id}
```
Get detailed metrics for specific vendor

```
GET /analytics/vendors/{vendor_id}/trends
```
Get historical trend data

---

#### Geographic Analytics

```
GET /analytics/geographic
```
Get QR scan heat map data

Response:
```json
{
  "period": {"start": "2025-10-01", "end": "2025-10-31"},
  "locations": [
    {
      "id": "lb-mlk-park",
      "name": "MLK Park",
      "lat": 33.7866,
      "lng": -118.1589,
      "scan_count": 89,
      "intake_count": 67,
      "conversion_rate": 0.75,
      "assigned_vendor": "PATH"
    }
  ],
  "service_gaps": [
    {
      "area": "North Long Beach",
      "population_estimate": 450,
      "nearest_qr_distance_miles": 2.3,
      "recommendation": "Add QR location near Atlantic Ave"
    }
  ]
}
```

---

#### Bottleneck Analysis

```
GET /analytics/bottlenecks
```
Identify system bottlenecks

Response:
```json
{
  "bottlenecks": [
    {
      "type": "provider_delay",
      "provider": "DPSS",
      "service": "SSI Assessment",
      "avg_wait_days": 42,
      "impact": "Delays 34% of housing placements",
      "affected_clients": 23
    },
    {
      "type": "document_barrier",
      "document": "Birth Certificate",
      "avg_acquisition_days": 21,
      "impact": "Blocks benefit applications",
      "affected_clients": 45
    }
  ]
}
```

---

#### Cost Analysis

```
GET /analytics/costs
```
Cost per outcome analysis

Response:
```json
{
  "period": {"start": "2025-01-01", "end": "2025-10-31"},
  "total_spent": 2100000,
  "outcomes": {
    "permanent_housing": {"count": 43, "cost_per": 23000},
    "sober_living": {"count": 28, "cost_per": 15000},
    "transitional": {"count": 31, "cost_per": 18000},
    "disengaged": {"count": 67, "cost_per": 8500}
  },
  "vendor_comparison": [
    {"vendor": "PATH", "cost_per_positive_outcome": 21000},
    {"vendor": "CityNet", "cost_per_positive_outcome": 28000},
    {"vendor": "MHALA", "cost_per_positive_outcome": 78000}
  ]
}
```

---

## ERROR RESPONSES

### 400 Bad Request
```json
{
  "error": "validation_error",
  "message": "Invalid date format",
  "details": {"field": "date_of_birth", "expected": "YYYY-MM-DD"}
}
```

### 401 Unauthorized
```json
{
  "error": "unauthorized",
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "error": "forbidden",
  "message": "Access denied. City admin role required."
}
```

### 404 Not Found
```json
{
  "error": "not_found",
  "message": "Client not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "internal_error",
  "message": "An unexpected error occurred",
  "request_id": "abc123"
}
```

---

## RATE LIMITS

- Standard endpoints: 100 requests/minute
- AI generation endpoints: 10 requests/minute
- Compliance report generation: 5 requests/hour

---

## WEBHOOKS (Future)

For external system integration:
- `client.created`
- `client.status_changed`
- `case_plan.approved`
- `appointment.scheduled`
- `appointment.completed`
- `benefit.status_changed`
