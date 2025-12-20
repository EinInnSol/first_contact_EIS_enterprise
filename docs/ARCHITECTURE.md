# FIRST CONTACT E.I.S. - COMPLETE TECHNICAL ARCHITECTURE

## Document Purpose
Complete technical architecture based on research into HMIS compliance, current software pain points, coordination challenges, and predictive analytics best practices.

---

## SYSTEM OVERVIEW

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                         FIRST CONTACT E.I.S.                             â”‚
â”‚                  Multi-Tenant AI Orchestration Platform                  â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜

        â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
        â”‚   CLIENT     â”‚    â”‚  CASEWORKER  â”‚    â”‚ CITY ADMIN   â”‚
        â”‚   (Mobile)   â”‚    â”‚  (Dashboard) â”‚    â”‚  (Layer 8)   â”‚
        â””â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”˜    â””â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”˜    â””â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”˜
               â”‚                   â”‚                   â”‚
               â”‚                   â”‚                   â”‚
        â”Œâ”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”
        â”‚              NEXT.JS 14 FRONTEND                      â”‚
        â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”    â”‚
        â”‚  â”‚ Client  â”‚  â”‚Caseworkerâ”‚  â”‚  City Dashboard  â”‚    â”‚
        â”‚  â”‚ Portal  â”‚  â”‚   App    â”‚  â”‚   (Layer 8)      â”‚    â”‚
        â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜    â”‚
        â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                â”‚
                        â”Œâ”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”
                        â”‚   Cloud CDN   â”‚
                        â”‚(Firebase Host)â”‚
                        â””â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”˜
                                â”‚
        â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
        â”‚              FASTAPI BACKEND (Cloud Run)              â”‚
        â”‚                                                        â”‚
        â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”    â”‚
        â”‚  â”‚         API LAYER (Versioned v1)             â”‚    â”‚
        â”‚  â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤    â”‚
        â”‚  â”‚ PUBLIC    â”‚ LAYERS 1-7   â”‚ LAYER 8 (City)   â”‚    â”‚
        â”‚  â”‚ /intake   â”‚ /clients     â”‚ /analytics       â”‚    â”‚
        â”‚  â”‚ /qr       â”‚ /case-plans  â”‚ /vendors         â”‚    â”‚
        â”‚  â”‚           â”‚ /benefits    â”‚ /predictions     â”‚    â”‚
        â”‚  â”‚           â”‚ /compliance  â”‚ /geographic      â”‚    â”‚
        â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜    â”‚
        â”‚                                                        â”‚
        â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”    â”‚
        â”‚  â”‚            MIDDLEWARE LAYER                   â”‚    â”‚
        â”‚  â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤    â”‚
        â”‚  â”‚ - Auth (JWT)                                 â”‚    â”‚
        â”‚  â”‚ - Organization Context (RLS)                 â”‚    â”‚
        â”‚  â”‚ - Rate Limiting                              â”‚    â”‚
        â”‚  â”‚ - Request Logging                            â”‚    â”‚
        â”‚  â”‚ - Error Handling                             â”‚    â”‚
        â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜    â”‚
        â”‚                                                        â”‚
        â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”    â”‚
        â”‚  â”‚           SERVICE LAYER (Core Logic)         â”‚    â”‚
        â”‚  â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤    â”‚
        â”‚  â”‚ SmartClientMatcher    â”‚ Prevent duplicates   â”‚    â”‚
        â”‚  â”‚ BenefitStackEngine    â”‚ SSI+CalFresh+GR calc â”‚    â”‚
        â”‚  â”‚ AppointmentOrchestratorâ”‚ Multi-agency coord  â”‚    â”‚
        â”‚  â”‚ CasePlanGenerator     â”‚ AI recommendations   â”‚    â”‚
        â”‚  â”‚ ComplianceReporter    â”‚ Auto HUD APR         â”‚    â”‚
        â”‚  â”‚ PredictiveAnalytics   â”‚ Housing outcomes     â”‚    â”‚
        â”‚  â”‚ TransportCoordinator  â”‚ Route optimization   â”‚    â”‚
        â”‚  â”‚ NotificationService   â”‚ SMS/Email reminders  â”‚    â”‚
        â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜    â”‚
        â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                 â”‚
        â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
        â”‚                   DATA LAYER                           â”‚
        â”‚                                                        â”‚
        â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”‚
        â”‚  â”‚  Cloud SQL   â”‚  â”‚  Firestore   â”‚  â”‚ BigQuery â”‚   â”‚
        â”‚  â”‚ (PostgreSQL) â”‚  â”‚ (Real-time)  â”‚  â”‚(Analytics)â”‚   â”‚
        â”‚  â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤  â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤  â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤   â”‚
        â”‚  â”‚ - Clients    â”‚  â”‚ - Sessions   â”‚  â”‚ - Layer 8â”‚   â”‚
        â”‚  â”‚ - Users      â”‚  â”‚ - Messages   â”‚  â”‚ - Trends â”‚   â”‚
        â”‚  â”‚ - Vendors    â”‚  â”‚ - Notifs     â”‚  â”‚ - ML dataâ”‚   â”‚
        â”‚  â”‚ - Benefits   â”‚  â”‚ - Events     â”‚  â”‚          â”‚   â”‚
        â”‚  â”‚ (WITH RLS)   â”‚  â”‚              â”‚  â”‚          â”‚   â”‚
        â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â”‚
        â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜

        â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
        â”‚              EXTERNAL INTEGRATIONS                     â”‚
        â”‚                                                        â”‚
        â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”‚
        â”‚  â”‚  Vertex AI   â”‚  â”‚    Twilio    â”‚  â”‚  Maps APIâ”‚   â”‚
        â”‚  â”‚   (Claude)   â”‚  â”‚  (SMS/Call)  â”‚  â”‚  (Routes)â”‚   â”‚
        â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â”‚
        â”‚                                                        â”‚
        â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”‚
        â”‚  â”‚ Cloud Storageâ”‚  â”‚Secret Managerâ”‚  â”‚ SendGrid â”‚   â”‚
        â”‚  â”‚ (Docs/QR)    â”‚  â”‚  (API Keys)  â”‚  â”‚  (Email) â”‚   â”‚
        â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â”‚
        â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

---

## 1. FRONTEND ARCHITECTURE

### Technology Stack
```
- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- Components: shadcn/ui
- State: React Query + Zustand
- Auth: NextAuth.js
- Hosting: Firebase Hosting + Cloud CDN
```

### Application Structure
```
frontend/
â”œâ”€â”€ app/
â”‚   â”œâ”€â”€ (public)/
â”‚   â”‚   â”œâ”€â”€ intake/
â”‚   â”‚   â”‚   â””â”€â”€ [qr_code_id]/
â”‚   â”‚   â”‚       â””â”€â”€ page.tsx          # QR intake form (no auth)
â”‚   â”‚   â””â”€â”€ page.tsx                   # Landing page
â”‚   â”‚
â”‚   â”œâ”€â”€ (client)/
â”‚   â”‚   â”œâ”€â”€ dashboard/
â”‚   â”‚   â”‚   â””â”€â”€ page.tsx               # Client portal
â”‚   â”‚   â”œâ”€â”€ appointments/
â”‚   â”‚   â”‚   â””â”€â”€ page.tsx               # My appointments
â”‚   â”‚   â”œâ”€â”€ documents/
â”‚   â”‚   â”‚   â””â”€â”€ page.tsx               # Upload docs
â”‚   â”‚   â””â”€â”€ benefits/
â”‚   â”‚       â””â”€â”€ page.tsx               # Benefit status
â”‚   â”‚
â”‚   â”œâ”€â”€ (caseworker)/                  # LAYERS 1-7
â”‚   â”‚   â”œâ”€â”€ dashboard/
â”‚   â”‚   â”‚   â””â”€â”€ page.tsx               # Caseworker home
â”‚   â”‚   â”œâ”€â”€ clients/
â”‚   â”‚   â”‚   â”œâ”€â”€ page.tsx               # Client list
â”‚   â”‚   â”‚   â””â”€â”€ [id]/
â”‚   â”‚   â”‚       â”œâ”€â”€ page.tsx           # Client detail
â”‚   â”‚   â”‚       â”œâ”€â”€ case-plan/page.tsx
â”‚   â”‚   â”‚       â”œâ”€â”€ benefits/page.tsx
â”‚   â”‚   â”‚       â””â”€â”€ timeline/page.tsx
â”‚   â”‚   â”œâ”€â”€ calendar/
â”‚   â”‚   â”‚   â””â”€â”€ page.tsx               # Appointment calendar
â”‚   â”‚   â”œâ”€â”€ recommendations/
â”‚   â”‚   â”‚   â””â”€â”€ page.tsx               # "Calling audibles"
â”‚   â”‚   â””â”€â”€ compliance/
â”‚   â”‚       â””â”€â”€ page.tsx               # Reports
â”‚   â”‚
â”‚   â”œâ”€â”€ (city)/                        # LAYER 8 (City Only!)
â”‚   â”‚   â”œâ”€â”€ analytics/
â”‚   â”‚   â”‚   â”œâ”€â”€ vendors/page.tsx       # Vendor comparison
â”‚   â”‚   â”‚   â”œâ”€â”€ geographic/page.tsx    # Heat maps
â”‚   â”‚   â”‚   â”œâ”€â”€ bottlenecks/page.tsx   # System analysis
â”‚   â”‚   â”‚   â””â”€â”€ predictions/page.tsx   # Predictive models
â”‚   â”‚   â”œâ”€â”€ vendors/
â”‚   â”‚   â”‚   â”œâ”€â”€ page.tsx               # Vendor list
â”‚   â”‚   â”‚   â””â”€â”€ [id]/page.tsx          # Vendor detail
â”‚   â”‚   â””â”€â”€ reports/
â”‚   â”‚       â””â”€â”€ page.tsx               # System reports
â”‚   â”‚
â”‚   â””â”€â”€ api/
â”‚       â””â”€â”€ auth/[...nextauth]/route.ts
â”‚
â”œâ”€â”€ components/
â”‚   â”œâ”€â”€ ui/                            # shadcn/ui components
â”‚   â”œâ”€â”€ client/                        # Client-specific
â”‚   â”œâ”€â”€ caseworker/                    # Caseworker-specific
â”‚   â”œâ”€â”€ city/                          # City dashboard
â”‚   â””â”€â”€ shared/                        # Reusable
â”‚
â”œâ”€â”€ lib/
â”‚   â”œâ”€â”€ api.ts                         # API client
â”‚   â”œâ”€â”€ auth.ts                        # Auth helpers
â”‚   â””â”€â”€ utils.ts
â”‚
â””â”€â”€ hooks/
    â”œâ”€â”€ useClient.ts
    â”œâ”€â”€ useCasePlan.ts
    â””â”€â”€ useAnalytics.ts
```

### Key Frontend Features

#### 1. Smart Client Matching (Duplicate Prevention)
```typescript
// components/caseworker/SmartClientSearch.tsx
export function SmartClientSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: potentialDuplicates } = useQuery({
    queryKey: ['client-search', searchTerm],
    queryFn: () => api.smartSearch(searchTerm),
    enabled: searchTerm.length > 3
  })

  return (
    <div>
      <Input
        placeholder="Search: Name, DOB, SSN, Phone"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {potentialDuplicates?.length > 0 && (
        <Alert>
          âš ï¸ Possible matches found. Is this the same person?
          {potentialDuplicates.map(client => (
            <ClientMatchCard key={client.id} client={client} />
          ))}
        </Alert>
      )}
    </div>
  )
}
```

#### 2. One-Click Approvals (Human-in-the-Loop)
```typescript
// components/caseworker/CasePlanApproval.tsx
export function CasePlanApproval({ plan }: { plan: CasePlan }) {
  const approveMutation = useMutation({
    mutationFn: () => api.approveCasePlan(plan.id),
    onSuccess: () => {
      toast.success("Case plan approved! Scheduling appointments...")
    }
  })

  return (
    <Card>
      <CardHeader>
        <h3>AI-Generated Case Plan for {plan.client.name}</h3>
        <Badge>Confidence: {plan.confidence_score}%</Badge>
      </CardHeader>

      <CardContent>
        <RecommendedPathway pathway={plan.recommended_pathway} />
        <BenefitStack benefits={plan.benefit_stack} />
        <ActionList actions={plan.actions} />
        <Projections
          stabilityDays={plan.projected_stability_days}
          exitIncome={plan.projected_exit_income}
        />
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button
          onClick={() => approveMutation.mutate()}
          className="bg-green-600"
        >
          âœ“ APPROVE
        </Button>
        <Button
          variant="outline"
          onClick={() => openModifyDialog()}
        >
          âœŽ MODIFY
        </Button>
        <Button
          variant="destructive"
          onClick={() => openRejectDialog()}
        >
          âœ— REJECT
        </Button>
      </CardFooter>
    </Card>
  )
}
```

#### 3. Layer 8 Analytics Dashboard
```typescript
// app/(city)/analytics/vendors/page.tsx
export default function VendorAnalyticsPage() {
  const { data: vendors } = useQuery({
    queryKey: ['vendor-performance'],
    queryFn: api.getVendorPerformance,
    // This endpoint returns 403 for non-city users
  })

  return (
    <div className="space-y-6">
      <h1>Vendor Performance Comparison</h1>

      {/* Sortable table */}
      <VendorComparisonTable
        vendors={vendors}
        defaultSortBy="cost_per_positive_outcome"
      />

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        <HousingRateChart vendors={vendors} />
        <RetentionRateChart vendors={vendors} />
        <ExitIncomeChart vendors={vendors} />
        <CostEfficiencyChart vendors={vendors} />
      </div>

      {/* Geographic heat map */}
      <QRScanHeatMap />

      {/* Predictive insights */}
      <PredictiveInsights />
    </div>
  )
}
```

---

## 2. BACKEND ARCHITECTURE

### Technology Stack
```
- Framework: FastAPI 0.104+
- Language: Python 3.11
- ORM: SQLAlchemy 2.0 (async)
- Database: PostgreSQL 15 (Cloud SQL)
- Cache: Redis (Memorystore)
- Auth: JWT (python-jose)
- Tasks: Cloud Tasks
- Hosting: Cloud Run
```

### Project Structure
```
backend/
â”œâ”€â”€ app/
â”‚   â”œâ”€â”€ __init__.py
â”‚   â”œâ”€â”€ main.py                        # FastAPI app + middleware
â”‚   â”œâ”€â”€ config.py                      # Settings (Pydantic)
â”‚   â”œâ”€â”€ database.py                    # SQLAlchemy setup + RLS
â”‚   â”‚
â”‚   â”œâ”€â”€ models/                        # SQLAlchemy models
â”‚   â”‚   â”œâ”€â”€ __init__.py
â”‚   â”‚   â”œâ”€â”€ base.py                    # TenantMixin
â”‚   â”‚   â”œâ”€â”€ organization.py
â”‚   â”‚   â”œâ”€â”€ user.py
â”‚   â”‚   â”œâ”€â”€ vendor.py
â”‚   â”‚   â”œâ”€â”€ client.py
â”‚   â”‚   â”œâ”€â”€ qr_location.py
â”‚   â”‚   â”œâ”€â”€ case_plan.py
â”‚   â”‚   â”œâ”€â”€ benefit_enrollment.py
â”‚   â”‚   â”œâ”€â”€ appointment.py
â”‚   â”‚   â”œâ”€â”€ transport_request.py
â”‚   â”‚   â”œâ”€â”€ compliance_report.py
â”‚   â”‚   â””â”€â”€ vendor_performance.py      # Layer 8
â”‚   â”‚
â”‚   â”œâ”€â”€ schemas/                       # Pydantic schemas
â”‚   â”‚   â”œâ”€â”€ __init__.py
â”‚   â”‚   â”œâ”€â”€ client.py
â”‚   â”‚   â”œâ”€â”€ case_plan.py
â”‚   â”‚   â”œâ”€â”€ benefit.py
â”‚   â”‚   â””â”€â”€ analytics.py
â”‚   â”‚
â”‚   â”œâ”€â”€ api/
â”‚   â”‚   â”œâ”€â”€ __init__.py
â”‚   â”‚   â”œâ”€â”€ deps.py                    # Dependencies (auth, RLS)
â”‚   â”‚   â”‚
â”‚   â”‚   â””â”€â”€ v1/
â”‚   â”‚       â”œâ”€â”€ __init__.py
â”‚   â”‚       â”œâ”€â”€ intake.py              # PUBLIC: QR intake
â”‚   â”‚       â”œâ”€â”€ auth.py                # PUBLIC: Login/register
â”‚   â”‚       â”‚
â”‚   â”‚       â”œâ”€â”€ clients.py             # LAYERS 1-7
â”‚   â”‚       â”œâ”€â”€ case_plans.py          # LAYERS 1-7
â”‚   â”‚       â”œâ”€â”€ benefits.py            # LAYERS 1-7
â”‚   â”‚       â”œâ”€â”€ appointments.py        # LAYERS 1-7
â”‚   â”‚       â”œâ”€â”€ recommendations.py     # LAYERS 1-7 (audibles)
â”‚   â”‚       â”œâ”€â”€ compliance.py          # LAYERS 1-7
â”‚   â”‚       â”‚
â”‚   â”‚       â””â”€â”€ analytics.py           # LAYER 8 (city only!)
â”‚   â”‚
â”‚   â”œâ”€â”€ services/                      # Core business logic
â”‚   â”‚   â”œâ”€â”€ __init__.py
â”‚   â”‚   â”œâ”€â”€ smart_client_matcher.py    # Fuzzy matching
â”‚   â”‚   â”œâ”€â”€ benefit_stack_engine.py    # Benefit calculations
â”‚   â”‚   â”œâ”€â”€ case_plan_generator.py     # AI case plans
â”‚   â”‚   â”œâ”€â”€ appointment_orchestrator.py # Multi-agency coord
â”‚   â”‚   â”œâ”€â”€ transport_coordinator.py   # Route optimization
â”‚   â”‚   â”œâ”€â”€ compliance_reporter.py     # Auto APR generation
â”‚   â”‚   â”œâ”€â”€ notification_service.py    # SMS/Email
â”‚   â”‚   â”œâ”€â”€ predictive_analytics.py    # ML models
â”‚   â”‚   â””â”€â”€ hmis_exporter.py           # CSV exports
â”‚   â”‚
â”‚   â”œâ”€â”€ ai/                            # Vertex AI integration
â”‚   â”‚   â”œâ”€â”€ __init__.py
â”‚   â”‚   â”œâ”€â”€ claude_client.py
â”‚   â”‚   â”œâ”€â”€ prompts.py
â”‚   â”‚   â””â”€â”€ parsers.py
â”‚   â”‚
â”‚   â”œâ”€â”€ middleware/
â”‚   â”‚   â”œâ”€â”€ __init__.py
â”‚   â”‚   â”œâ”€â”€ organization.py            # RLS context
â”‚   â”‚   â”œâ”€â”€ rate_limit.py
â”‚   â”‚   â””â”€â”€ logging.py
â”‚   â”‚
â”‚   â””â”€â”€ utils/
â”‚       â”œâ”€â”€ __init__.py
â”‚       â”œâ”€â”€ security.py
â”‚       â”œâ”€â”€ validation.py
â”‚       â””â”€â”€ vi_spdat.py                # VI-SPDAT scoring
â”‚
â”œâ”€â”€ tests/
â”‚   â”œâ”€â”€ __init__.py
â”‚   â”œâ”€â”€ conftest.py
â”‚   â”œâ”€â”€ test_multi_tenant.py           # CRITICAL
â”‚   â”œâ”€â”€ test_layer8_access.py          # CRITICAL
â”‚   â”œâ”€â”€ test_smart_matching.py
â”‚   â”œâ”€â”€ test_benefit_stack.py
â”‚   â”œâ”€â”€ test_orchestrator.py
â”‚   â””â”€â”€ test_compliance.py
â”‚
â”œâ”€â”€ alembic/
â”‚   â”œâ”€â”€ versions/
â”‚   â””â”€â”€ env.py
â”‚
â”œâ”€â”€ requirements.txt
â”œâ”€â”€ Dockerfile
â””â”€â”€ .env.example
```

---

## 3. CORE SERVICES (The Innovation Layer)

### 3.1 SmartClientMatcher (Solve Duplicate Problem)

```python
# app/services/smart_client_matcher.py
from typing import List, Tuple
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.client import Client
import jellyfish  # phonetic matching
from datetime import date

class SmartClientMatcher:
    """
    Prevents duplicate client records using fuzzy matching.

    Research finding: "Primary complaint with Clarity is duplicate clients"
    Solution: Match on 2 of 3 identifiers (name, DOB, SSN)
    """

    def __init__(self, db: AsyncSession):
        self.db = db

    async def find_potential_duplicates(
        self,
        first_name: str,
        last_name: str,
        date_of_birth: date | None,
        ssn: str | None,
        phone: str | None,
        organization_id: int
    ) -> List[Tuple[Client, float]]:
        """
        Find potential duplicate clients with confidence scores.

        Returns: List of (Client, confidence_score) tuples
        """
        # Get all clients in organization
        result = await self.db.execute(
            select(Client).where(Client.organization_id == organization_id)
        )
        existing_clients = result.scalars().all()

        matches = []

        for client in existing_clients:
            score = 0.0
            match_count = 0

            # Name matching (phonetic + fuzzy)
            name_similarity = self._name_similarity(
                first_name, last_name,
                client.first_name, client.last_name
            )
            if name_similarity > 0.85:
                score += name_similarity
                match_count += 1

            # DOB exact match
            if date_of_birth and client.date_of_birth == date_of_birth:
                score += 1.0
                match_count += 1

            # SSN match (last 4 digits OK)
            if ssn and client.ssn_encrypted:
                if self._ssn_match(ssn, client.ssn_encrypted):
                    score += 1.0
                    match_count += 1

            # Phone match
            if phone and client.phone:
                if self._normalize_phone(phone) == self._normalize_phone(client.phone):
                    score += 0.5

            # If 2 of 3 main identifiers match, flag as potential duplicate
            if match_count >= 2:
                confidence = score / match_count
                matches.append((client, confidence))

        # Sort by confidence descending
        matches.sort(key=lambda x: x[1], reverse=True)
        return matches

    def _name_similarity(self, first1: str, last1: str, first2: str, last2: str) -> float:
        """
        Combine phonetic and edit distance matching.
        Handles typos, alternate spellings, nicknames.
        """
        # Soundex matching (phonetic)
        soundex_match = (
            jellyfish.soundex(first1) == jellyfish.soundex(first2) and
            jellyfish.soundex(last1) == jellyfish.soundex(last2)
        )

        # Jaro-Winkler distance (fuzzy)
        first_similarity = jellyfish.jaro_winkler_similarity(
            first1.lower(), first2.lower()
        )
        last_similarity = jellyfish.jaro_winkler_similarity(
            last1.lower(), last2.lower()
        )

        avg_similarity = (first_similarity + last_similarity) / 2

        return 1.0 if soundex_match else avg_similarity

    def _ssn_match(self, ssn1: str, ssn2_encrypted: str) -> bool:
        """Check SSN match (decrypt for comparison)"""
        # Decrypt ssn2, compare
        # Even last 4 digits match = high confidence
        pass

    def _normalize_phone(self, phone: str) -> str:
        """Strip all non-digits"""
        return ''.join(c for c in phone if c.isdigit())
```

### 3.2 BenefitStackEngine (Coordination Intelligence)

```python
# app/services/benefit_stack_engine.py
from typing import Dict, List
from app.models.client import Client
from app.models.benefit_enrollment import BenefitEnrollment
from app.schemas.benefit import BenefitStackProjection, BenefitRecommendation

class BenefitStackEngine:
    """
    Calculates optimal benefit combinations based on eligibility rules.

    Research finding: "SSI recipients NOW eligible for CalFresh (as of June 2019)"
    Research finding: "GR Housing Subsidy ($575) reduces GR by $100"

    Must handle complex interactions and dependencies.
    """

    # Load from database or JSON
    BENEFIT_RULES = {
        "ssi": {
            "typical_amount": 1183,
            "requires": ["disability_documentation"],
            "enables": ["ihss", "medi_cal"],
            "timeline_months": "3-6"
        },
        "gr": {
            "typical_amount": 221,
            "requires": ["no_dependents", "not_receiving_ssi_ssdi"],
            "enables": ["gr_housing_subsidy"],
            "excludes": ["ssi", "ssdi", "calworks"]
        },
        "gr_housing_subsidy": {
            "typical_amount": 575,
            "requires": ["gr_recipient", "housed"],
            "affects": {
                "gr": {"reduces_by": 100}  # CRITICAL
            }
        },
        "calfresh": {
            "typical_amount": 234,
            "requires": ["low_income"],
            "expedited_homeless": True,
            "timeline_days": 3
        },
        "ihss": {
            "typical_amount": 1200,
            "requires": ["ssi_or_medi_cal", "needs_assistance"],
            "note": "Family member can be paid as caregiver"
        },
        # ... all other programs from 04_BENEFIT_PROGRAMS.json
    }

    async def calculate_benefit_stack(
        self,
        client: Client,
        client_info: Dict
    ) -> BenefitStackProjection:
        """
        Generate optimal benefit stack for client.

        Returns:
        - Immediate eligibility (apply now)
        - Pending applications (in progress)
        - Recommended timeline (step-by-step)
        - Projected monthly income
        - Projected monthly expenses
        """
        eligible_now = []
        recommended_timeline = []
        projected_income = 0

        # STEP 1: Check immediate eligibility
        for program_code, rules in self.BENEFIT_RULES.items():
            if self._is_eligible(client_info, rules["requires"]):
                if not self._is_excluded(client_info, rules.get("excludes", [])):
                    eligible_now.append(program_code)

        # STEP 2: Calculate application sequence
        # CalFresh + Medi-Cal + GR (same DPSS appointment)
        if "calfresh" in eligible_now and "medi_cal" in eligible_now and "gr" in eligible_now:
            recommended_timeline.append({
                "step": 1,
                "programs": ["calfresh", "medi_cal", "gr"],
                "provider": "DPSS Long Beach",
                "timeline": "Week 1",
                "note": "Can apply for all 3 at same appointment"
            })

        # SSI (start early - takes 3-6 months)
        if "ssi" in eligible_now:
            recommended_timeline.append({
                "step": 2,
                "programs": ["ssi"],
                "provider": "Social Security Administration",
                "timeline": "Week 2 (3-6 months to approval)",
                "note": "CRITICAL: Start this early!"
            })

        # Housing subsidy (once housed)
        if "gr_housing_subsidy" in eligible_now:
            recommended_timeline.append({
                "step": 3,
                "programs": ["gr_housing_subsidy"],
                "provider": "DPSS",
                "timeline": "Once housing secured",
                "note": "Reduces GR to $121 but adds $575 housing = net +$475"
            })

        # IHSS (after SSI approved)
        recommended_timeline.append({
            "step": 4,
            "programs": ["ihss"],
            "provider": "DPSS IHSS",
            "timeline": "After SSI approval",
            "note": "Family member can be paid $800-1,500/month as caregiver"
        })

        # STEP 3: Calculate projected income (with interactions!)
        income_sources = {}

        # Base amounts
        if "ssi" in eligible_now:
            income_sources["ssi"] = 1183
        if "calfresh" in eligible_now:
            income_sources["calfresh"] = 234
        if "gr" in eligible_now:
            # Check if housing subsidy will be active
            if client_info.get("housed") and "gr_housing_subsidy" in eligible_now:
                income_sources["gr"] = 121  # Reduced!
                income_sources["gr_housing_subsidy"] = 575
            else:
                income_sources["gr"] = 221

        projected_income = sum(income_sources.values())

        # STEP 4: Calculate expenses
        projected_expenses = self._estimate_expenses(client_info, income_sources)

        return BenefitStackProjection(
            immediate_eligibility=eligible_now,
            recommended_timeline=recommended_timeline,
            projected_monthly_income=projected_income,
            projected_monthly_expenses=projected_expenses,
            projected_net_monthly=projected_income - projected_expenses,
            income_breakdown=income_sources
        )

    def _is_eligible(self, client_info: Dict, requirements: List[str]) -> bool:
        """Check if client meets all requirements"""
        for req in requirements:
            if req == "disability_documentation" and not client_info.get("has_disability_docs"):
                return False
            if req == "low_income" and client_info.get("monthly_income", 0) > 1500:
                return False
            # ... more eligibility checks
        return True

    def _is_excluded(self, client_info: Dict, exclusions: List[str]) -> bool:
        """Check if client is excluded"""
        for exclusion in exclusions:
            if exclusion == "ssi" and client_info.get("has_ssi"):
                return True
        return False

    def _estimate_expenses(self, client_info: Dict, benefits: Dict) -> float:
        """Estimate monthly expenses based on housing + benefits"""
        expenses = 0

        # Rent
        if client_info.get("housed"):
            if "gr_housing_subsidy" in benefits:
                expenses += 500  # Remaining after $575 subsidy
            else:
                expenses += 1075  # Full rent in Long Beach

        # Utilities (after CARE discount)
        if "care" in benefits:
            expenses += 50
        else:
            expenses += 100

        # Food covered by CalFresh
        # Medical covered by Medi-Cal
        # Phone covered by Lifeline

        return expenses
```

### 3.3 AppointmentOrchestrator (Solve Coordination Problem)

```python
# app/services/appointment_orchestrator.py
from typing import List, Dict
from datetime import datetime, timedelta
from app.models.client import Client
from app.models.appointment import Appointment
from app.services.transport_coordinator import TransportCoordinator
from app.services.notification_service import NotificationService

class AppointmentOrchestrator:
    """
    Coordinates multi-agency appointments and transportation.

    Research finding: "Transportation is #1 barrier to appointment attendance"
    Research finding: "Reminder calls day before reduce no-shows"

    This is the "calling audibles" feature.
    """

    def __init__(
        self,
        transport: TransportCoordinator,
        notifications: NotificationService
    ):
        self.transport = transport
        self.notifications = notifications

    async def optimize_appointments(
        self,
        client_id: str,
        appointments_needed: List[Dict]
    ) -> Dict:
        """
        Given multiple needed appointments, optimize scheduling.

        Strategy:
        1. Group by geographic proximity
        2. Schedule on same day if possible
        3. Optimize transport route
        4. Book transportation
        5. Send confirmations + reminders
        """
        # Get client location
        client = await self.db.get(Client, client_id)

        # Group appointments by location
        grouped = self._group_by_proximity(appointments_needed)

        # Find optimal date/time slots
        schedule = []
        for group in grouped:
            # Try to schedule all in group on same day
            optimal_date = await self._find_optimal_date(group)

            for appt in group:
                # Book appointment
                appointment = Appointment(
                    client_id=client_id,
                    provider=appt["provider"],
                    appointment_date=optimal_date,
                    appointment_time=appt["suggested_time"],
                    transport_needed=True
                )
                schedule.append(appointment)

        # Optimize transport route for same-day appointments
        same_day_appts = self._group_by_date(schedule)
        for date, appts in same_day_appts.items():
            route = await self.transport.optimize_route(
                client_location=client.current_address,
                destinations=[a.provider.address for a in appts]
            )

            # Book transportation
            transport_request = await self.transport.book_transport(
                client_id=client_id,
                route=route,
                date=date
            )

        # Send confirmation
        await self.notifications.send_sms(
            client.phone,
            f"Your appointments are scheduled:\n{self._format_schedule(schedule)}"
        )

        # Schedule reminder for day before
        for appt in schedule:
            reminder_time = appt.appointment_date - timedelta(days=1)
            await self.notifications.schedule_reminder(
                client.phone,
                f"Reminder: {appt.provider.name} tomorrow at {appt.appointment_time}",
                send_at=reminder_time
            )

        return {
            "appointments": schedule,
            "transport_routes": route,
            "estimated_travel_time": route.total_duration,
            "confirmations_sent": True
        }

    async def handle_cancellation(
        self,
        cancelled_appointment: Appointment
    ) -> Dict:
        """
        When appointment cancelled, AI recommends replacement.

        This is "calling audibles" - real-time optimization.
        """
        # Find clients with higher urgency who are ready
        candidates = await self._find_swap_candidates(cancelled_appointment)

        if not candidates:
            return {"recommendation": None}

        # Score each candidate
        best_candidate = max(candidates, key=lambda c: c.score)

        # Generate recommendation for caseworker
        recommendation = {
            "type": "appointment_swap",
            "original_client": cancelled_appointment.client,
            "recommended_client": best_candidate.client,
            "reasoning": [
                f"Higher urgency ({best_candidate.urgency}/10 vs {cancelled_appointment.client.urgency}/10)",
                f"All required documents ready ({len(best_candidate.documents_ready)}/{len(best_candidate.documents_required)})",
                f"On existing transport route (saves {best_candidate.transport_savings} minutes)",
                f"Has been waiting {best_candidate.days_waiting} days"
            ],
            "actions_if_approved": [
                {"action": "cancel_appointment", "client_id": cancelled_appointment.client_id},
                {"action": "book_appointment", "client_id": best_candidate.client.id},
                {"action": "update_transport_route"},
                {"action": "send_sms_confirmation", "to": best_candidate.client.phone},
                {"action": "notify_provider", "provider": cancelled_appointment.provider}
            ],
            "estimated_execution_time": "60 seconds",
            "manual_equivalent_time": "2-4 hours",
            "confidence": 0.92
        }

        return recommendation

    async def _find_swap_candidates(self, cancelled: Appointment) -> List:
        """Find clients who could take this slot"""
        # Same provider, same appointment type
        # Higher urgency
        # Documents ready
        # On or near transport route
        pass
```

### 3.4 PredictiveAnalytics (Layer 8 Intelligence)

```python
# app/services/predictive_analytics.py
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from typing import Dict, List
from app.models.client import Client

class PredictiveAnalytics:
    """
    ML models for outcome prediction and system optimization.

    Research finding: "LA County uses ~500 factors for homelessness prevention"
    Research finding: "Random forests outperformed logistic regression for VA"
    Research finding: "Must track disparate impact by race/ethnicity"
    """

    def __init__(self):
        # Load pre-trained models
        self.housing_success_model = self._load_model("housing_success_rf.pkl")
        self.retention_model = self._load_model("retention_6mo_rf.pkl")

    async def predict_housing_success(
        self,
        client: Client,
        case_plan: Dict
    ) -> Dict:
        """
        Predict probability of successful housing placement.

        Features (based on research):
        - VI-SPDAT score
        - Homeless duration (months)
        - ER visits (last 6 months)
        - Mental health engagement
        - Substance use treatment
        - Benefits enrollment progress
        - Appointment attendance rate
        - Social support score
        - Prior housing attempts
        - Caseworker caseload size
        """
        features = self._extract_features(client, case_plan)

        # Predict
        probability = self.housing_success_model.predict_proba(features)[0][1]

        # Feature importance (explainability)
        importances = self.housing_success_model.feature_importances_
        top_factors = self._get_top_factors(features, importances)

        return {
            "success_probability": probability,
            "confidence_level": "high" if probability > 0.7 or probability < 0.3 else "medium",
            "top_positive_factors": top_factors["positive"],
            "top_risk_factors": top_factors["negative"],
            "recommended_interventions": self._generate_interventions(top_factors)
        }

    async def identify_system_bottlenecks(
        self,
        organization_id: int,
        date_range: tuple
    ) -> List[Dict]:
        """
        Analyze aggregate data to find system bottlenecks.

        Returns bottlenecks like:
        - DPSS SSI assessments: avg 42 day wait
        - Birth certificate delays: avg 21 days
        - Mental health intake: avg 28 days
        """
        # Query all clients' timelines
        timelines = await self._get_client_timelines(organization_id, date_range)

        # Calculate avg time for each step
        step_durations = {}
        for timeline in timelines:
            for step in timeline.steps:
                key = f"{step.provider}:{step.service}"
                if key not in step_durations:
                    step_durations[key] = []
                step_durations[key].append(step.duration_days)

        # Identify outliers (>75th percentile)
        bottlenecks = []
        for key, durations in step_durations.items():
            avg = np.mean(durations)
            p75 = np.percentile(durations, 75)

            if avg > p75 * 1.5:  # Significantly slower than normal
                provider, service = key.split(":")
                bottlenecks.append({
                    "type": "provider_delay",
                    "provider": provider,
                    "service": service,
                    "avg_wait_days": avg,
                    "impact": f"Delays {len(durations)} clients",
                    "recommendation": self._generate_bottleneck_solution(key, avg)
                })

        return sorted(bottlenecks, key=lambda x: x["avg_wait_days"], reverse=True)

    async def predict_vendor_outcomes(
        self,
        vendor_id: int,
        timeframe_days: int = 90
    ) -> Dict:
        """
        Predict vendor's performance for next 90 days.

        Based on:
        - Current caseload
        - Client acuity levels
        - Historical performance
        - Current system bottlenecks
        """
        # Get vendor's current clients
        clients = await self._get_vendor_clients(vendor_id)

        # Predict individual outcomes
        predictions = []
        for client in clients:
            pred = await self.predict_housing_success(client, client.active_case_plan)
            predictions.append({
                "client_id": client.id,
                "predicted_outcome": "housed" if pred["success_probability"] > 0.5 else "in_progress",
                "probability": pred["success_probability"],
                "expected_days": self._estimate_days_to_outcome(pred)
            })

        # Aggregate
        expected_placements_30d = sum(1 for p in predictions if p["expected_days"] <= 30)
        expected_placements_60d = sum(1 for p in predictions if p["expected_days"] <= 60)
        expected_placements_90d = sum(1 for p in predictions if p["expected_days"] <= 90)

        # Cost projection
        avg_cost_per_day = await self._get_vendor_daily_cost(vendor_id)
        projected_cost = avg_cost_per_day * timeframe_days * len(clients)

        return {
            "vendor_id": vendor_id,
            "current_caseload": len(clients),
            "predictions": {
                "30_days": {"placements": expected_placements_30d},
                "60_days": {"placements": expected_placements_60d},
                "90_days": {"placements": expected_placements_90d}
            },
            "projected_cost": projected_cost,
            "projected_cost_per_placement": projected_cost / expected_placements_90d if expected_placements_90d > 0 else None,
            "risk_factors": await self._identify_vendor_risks(vendor_id, clients)
        }

    async def generate_equity_report(
        self,
        organization_id: int,
        date_range: tuple
    ) -> Dict:
        """
        Track outcomes by demographics to identify disparate impact.

        Research requirement: "Must track by race/ethnicity, gender"
        """
        clients = await self._get_clients_in_range(organization_id, date_range)

        demographics = ["race", "ethnicity", "gender", "age_group", "disability_status"]

        report = {}
        for demo in demographics:
            groups = self._group_by(clients, demo)
            report[demo] = {}

            for group_name, group_clients in groups.items():
                outcomes = self._calculate_outcomes(group_clients)
                report[demo][group_name] = {
                    "count": len(group_clients),
                    "housed_rate": outcomes["housed_rate"],
                    "avg_days_to_housing": outcomes["avg_days"],
                    "retention_6mo": outcomes["retention_6mo"],
                    "avg_exit_income": outcomes["avg_exit_income"]
                }

        # Identify disparities
        disparities = []
        for demo, groups in report.items():
            rates = [g["housed_rate"] for g in groups.values()]
            if max(rates) - min(rates) > 0.15:  # 15% disparity
                disparities.append({
                    "demographic": demo,
                    "disparity": max(rates) - min(rates),
                    "highest_group": max(groups.items(), key=lambda x: x[1]["housed_rate"]),
                    "lowest_group": min(groups.items(), key=lambda x: x[1]["housed_rate"]),
                    "recommendation": "Investigate potential bias in assessment or service delivery"
                })

        return {
            "summary": report,
            "disparities": disparities,
            "overall_equity_score": 1.0 - (len(disparities) / len(demographics))
        }
```

### 3.5 ComplianceReporter (Auto HUD APR)

```python
# app/services/compliance_reporter.py
from datetime import date
from app.models.compliance_report import ComplianceReport
from app.services.hmis_exporter import HMISExporter

class ComplianceReporter:
    """
    Automatically generate HUD APR and other compliance reports.

    Research finding: "APR must be submitted through Sage HMIS Repository"
    Research finding: "Caseworkers hate compliance reporting - takes 10-20 hours/month"
    """

    def __init__(self, hmis_exporter: HMISExporter):
        self.hmis = hmis_exporter

    async def generate_hud_apr(
        self,
        organization_id: int,
        period_start: date,
        period_end: date
    ) -> ComplianceReport:
        """
        Generate HUD Annual Performance Report.

        Auto-fills all data from HMIS.
        Caseworker just reviews and clicks SEND.
        """
        # Get all clients served in period
        clients = await self._get_clients_in_period(
            organization_id, period_start, period_end
        )

        # Calculate required metrics
        report_data = {
            "period_start": period_start,
            "period_end": period_end,
            "total_clients_served": len(clients),

            # Housing outcomes
            "permanently_housed": sum(1 for c in clients if c.exit_type == "permanent_housing"),
            "rapid_rehousing": sum(1 for c in clients if c.exit_type == "rapid_rehousing"),
            "transitional": sum(1 for c in clients if c.housing_type == "transitional"),

            # Income at exit
            "avg_exit_income": np.mean([c.exit_income_monthly for c in clients if c.exit_income_monthly]),
            "clients_with_income_increase": sum(1 for c in clients if c.exit_income_monthly > c.intake_income_monthly),

            # Time metrics
            "avg_days_to_housing": np.mean([
                (c.housed_date - c.intake_date).days
                for c in clients if c.housed_date
            ]),

            # Demographics (required by HUD)
            "demographics": self._calculate_demographics(clients),

            # Chronic homelessness
            "chronic_homeless_count": sum(1 for c in clients if c.is_chronic_homeless),

            # Disabilities
            "clients_with_disabilities": sum(1 for c in clients if c.has_disability),
        }

        # Generate CSV in HUD format
        csv_file = await self.hmis.export_to_sage_format(report_data)

        # Upload to Cloud Storage
        file_url = await self._upload_report(csv_file)

        # Create report record
        report = ComplianceReport(
            organization_id=organization_id,
            report_type="hud_apr",
            period_start=period_start,
            period_end=period_end,
            status="ready",
            report_data=report_data,
            file_url=file_url
        )

        await self.db.add(report)
        await self.db.commit()

        # Notify caseworker
        await self.notifications.send_email(
            to=supervisor_email,
            subject="HUD APR Ready for Review",
            body=f"""
            Your HUD Annual Performance Report for Q3 2025 is ready.

            Summary:
            - {report_data['total_clients_served']} clients served
            - {report_data['permanently_housed']} permanently housed
            - ${report_data['avg_exit_income']:.2f} average exit income

            Review and submit: {dashboard_url}/compliance/reports/{report.id}

            If no action taken in 48 hours, your supervisor will be notified.
            """
        )

        return report
```

---

## 4. DATABASE ARCHITECTURE

### Multi-Tenant with RLS (NON-NEGOTIABLE)

```python
# app/database.py
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text, event
from app.config import settings

# Create async engine
engine = create_async_engine(
    settings.database_url,
    echo=settings.debug,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20
)

AsyncSessionLocal = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)

async def set_tenant_context(session: AsyncSession, organization_id: int):
    """
    Set PostgreSQL RLS context for current session.

    CRITICAL: This MUST be called for every request.
    """
    await session.execute(
        text(f"SET app.organization_id = '{organization_id}'")
    )

async def get_db():
    """Dependency for FastAPI routes"""
    async with AsyncSessionLocal() as session:
        yield session


# app/models/base.py
from sqlalchemy import Column, Integer, DateTime, func
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

class TenantMixin:
    """
    EVERY table MUST inherit this mixin.

    Provides:
    - organization_id (for multi-tenancy)
    - created_at, updated_at timestamps
    """

    @declared_attr
    def organization_id(cls):
        return Column(
            Integer,
            nullable=False,
            index=True,
            comment="Multi-tenant isolation - references organizations.id"
        )

    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())


# Example model
class Client(Base, TenantMixin):
    __tablename__ = "clients"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    # ... other fields
```

### RLS Policies (Applied to ALL tenant tables)

```sql
-- CRITICAL: Enable RLS on every tenant table
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
-- ... etc

-- Policy: Only see data from your organization
CREATE POLICY tenant_isolation ON clients
    FOR ALL
    USING (organization_id = current_setting('app.organization_id')::INTEGER);

CREATE POLICY tenant_isolation ON users
    FOR ALL
    USING (organization_id = current_setting('app.organization_id')::INTEGER);

-- Repeat for ALL tenant tables
```

---

## 5. API LAYER DESIGN

### Authentication & Authorization

```python
# app/api/deps.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db, set_tenant_context
from app.models.user import User, UserRole
from app.config import settings

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    """
    Validate JWT, set RLS context, return user.

    JWT payload:
    {
        "sub": "user_uuid",
        "org_id": 1,
        "vendor_id": 101,
        "role": "caseworker",
        "exp": 1234567890
    }
    """
    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.jwt_secret,
            algorithms=[settings.jwt_algorithm]
        )

        user_id = payload.get("sub")
        org_id = payload.get("org_id")

        if not user_id or not org_id:
            raise HTTPException(401, "Invalid token")

        # SET RLS CONTEXT (CRITICAL!)
        await set_tenant_context(db, org_id)

        # Get user
        user = await db.get(User, user_id)
        if not user or not user.active:
            raise HTTPException(401, "User not found or inactive")

        return user

    except JWTError:
        raise HTTPException(401, "Invalid token")


def require_role(*allowed_roles: UserRole):
    """
    Dependency factory for role-based access control.

    Usage:
    @router.get("/analytics", dependencies=[Depends(require_role(UserRole.CITY_ADMIN))])
    """
    async def check_role(user: User = Depends(get_current_user)):
        if user.role not in allowed_roles:
            raise HTTPException(
                status_code=403,
                detail=f"Access denied. Required role: {allowed_roles}"
            )
        return user
    return check_role


# Convenience dependencies
require_city_admin = require_role(UserRole.CITY_ADMIN, UserRole.CITY_COUNCIL)
require_vendor_access = require_role(
    UserRole.CASEWORKER,
    UserRole.VENDOR_ADMIN,
    UserRole.CITY_ADMIN
)
```

### Layer 8 Enforcement

```python
# app/api/v1/analytics.py
from fastapi import APIRouter, Depends, HTTPException
from app.api.deps import require_city_admin
from app.models.user import User

router = APIRouter(prefix="/analytics", tags=["Layer 8"])

@router.get("/vendor-performance")
async def get_vendor_performance(
    user: User = Depends(require_city_admin),  # 403 for vendors!
    db: AsyncSession = Depends(get_db)
):
    """
    LAYER 8 ENDPOINT - City administrators only.

    Caseworkers and vendor admins get 403 Forbidden.
    """
    # Query vendor performance metrics
    # This is the "hidden payload" that cities see
    pass

@router.get("/geographic")
async def get_geographic_analytics(
    user: User = Depends(require_city_admin),
    db: AsyncSession = Depends(get_db)
):
    """QR scan heat maps - City only!"""
    pass

@router.get("/predictions")
async def get_predictive_analytics(
    user: User = Depends(require_city_admin),
    db: AsyncSession = Depends(get_db)
):
    """ML predictions and system optimization - City only!"""
    pass
```

---

## 6. INTEGRATION LAYER

### Vertex AI (Claude) Integration

```python
# app/ai/claude_client.py
import vertexai
from vertexai.preview.generative_models import GenerativeModel
from app.config import settings

vertexai.init(
    project=settings.gcp_project_id,
    location=settings.vertex_ai_location
)

class ClaudeClient:
    """
    Vertex AI Claude integration for case plan generation.

    Use cases:
    - Generate case plans from VI-SPDAT
    - Recommend "calling audibles"
    - Analyze bottlenecks
    """

    def __init__(self):
        self.model = GenerativeModel(settings.vertex_ai_model)

    async def generate_case_plan(self, client_data: dict, benefit_stack: dict) -> dict:
        """
        Generate AI case plan from client data.

        Prompt includes:
        - Client VI-SPDAT responses
        - Current situation
        - Benefit eligibility
        - Available resources
        - Historical outcomes for similar clients
        """
        prompt = self._build_case_plan_prompt(client_data, benefit_stack)

        response = await self.model.generate_content_async(prompt)

        # Parse structured response
        parsed = self._parse_case_plan_response(response.text)

        return parsed

    def _build_case_plan_prompt(self, client_data: dict, benefit_stack: dict) -> str:
        return f"""
You are an expert homeless services case manager. Generate a case plan.

CLIENT PROFILE:
- Name: {client_data['first_name']} {client_data['last_name']}
- VI-SPDAT Score: {client_data['vi_spdat_score']} ({client_data['acuity_level']} acuity)
- Current Situation: {client_data['current_housing_status']}
- Barriers: {client_data['barriers']}

BENEFIT ELIGIBILITY:
{json.dumps(benefit_stack, indent=2)}

AVAILABLE RESOURCES:
- Emergency shelter: 24-48 hours
- Sober living: 1-2 weeks
- Rapid rehousing: 2-8 weeks
- PSH: 3-12 months

Generate a case plan with:
1. Recommended pathway (PSH, RRH, sober living, etc.)
2. Reasoning (why this pathway?)
3. Week 1 priorities (specific appointments with providers)
4. Document requirements
5. Projected timeline to stability
6. Projected monthly income at stable state

Return as JSON.
"""
```

### Twilio Integration (SMS/Calls)

```python
# app/services/notification_service.py
from twilio.rest import Client
from app.config import settings

class NotificationService:
    """
    SMS and call notifications via Twilio.

    Research finding: "Reminder calls day before reduce no-shows"
    """

    def __init__(self):
        self.client = Client(
            settings.twilio_account_sid,
            settings.twilio_auth_token
        )

    async def send_sms(self, to: str, message: str):
        """Send SMS notification"""
        self.client.messages.create(
            to=to,
            from_=settings.twilio_phone_number,
            body=message
        )

    async def schedule_reminder(self, to: str, message: str, send_at: datetime):
        """Schedule reminder for future time"""
        # Use Cloud Tasks to schedule
        pass

    async def make_reminder_call(self, to: str, appointment: dict):
        """Automated reminder call"""
        self.client.calls.create(
            to=to,
            from_=settings.twilio_phone_number,
            url=f"{settings.api_url}/twiml/appointment-reminder/{appointment.id}"
        )
```

### Google Maps API (Route Optimization)

```python
# app/services/transport_coordinator.py
import googlemaps
from typing import List
from app.config import settings

class TransportCoordinator:
    """
    Optimize transportation routes for multi-appointment days.

    Research finding: "Transportation #1 barrier to appointments"
    """

    def __init__(self):
        self.gmaps = googlemaps.Client(key=settings.google_maps_api_key)

    async def optimize_route(
        self,
        client_location: str,
        destinations: List[str]
    ) -> dict:
        """
        Find optimal route for multiple destinations.

        Returns:
        - Optimized order
        - Total distance
        - Total duration
        - Pickup/dropoff times
        """
        # Get distance matrix
        matrix = self.gmaps.distance_matrix(
            origins=[client_location],
            destinations=destinations,
            mode="transit",
            transit_mode=["bus", "rail"]
        )

        # Solve traveling salesman problem (simplified)
        optimized_order = self._tsp_solver(matrix)

        # Get directions
        waypoints = [destinations[i] for i in optimized_order]
        directions = self.gmaps.directions(
            origin=client_location,
            destination=client_location,  # Round trip
            waypoints=waypoints,
            mode="transit"
        )

        return {
            "optimized_order": optimized_order,
            "total_duration": sum(leg['duration']['value'] for leg in directions[0]['legs']),
            "total_distance": sum(leg['distance']['value'] for leg in directions[0]['legs']),
            "route": directions[0],
            "transit_instructions": self._extract_transit_steps(directions[0])
        }
```

---

## 7. DEPLOYMENT ARCHITECTURE (GCP)

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                      PRODUCTION SETUP                        â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜

FRONTEND:
â”œâ”€â”€ Next.js Build â†’ Static Export
â”œâ”€â”€ Firebase Hosting (CDN)
â””â”€â”€ Cloud CDN (global distribution)

BACKEND:
â”œâ”€â”€ Docker Container (FastAPI)
â”œâ”€â”€ Cloud Run (Auto-scaling 1-10 instances)
â”œâ”€â”€ Cloud Load Balancer
â””â”€â”€ Cloud Armor (DDoS protection)

DATABASES:
â”œâ”€â”€ Cloud SQL (PostgreSQL 15)
â”‚   â”œâ”€â”€ Instance: db-n1-standard-1
â”‚   â”œâ”€â”€ High Availability: Yes
â”‚   â”œâ”€â”€ Backups: Daily + Point-in-time recovery
â”‚   â””â”€â”€ Private IP (VPC peering)
â”‚
â”œâ”€â”€ Firestore (Real-time features)
â”‚   â”œâ”€â”€ Sessions
â”‚   â”œâ”€â”€ Notifications
â”‚   â””â”€â”€ Live updates
â”‚
â””â”€â”€ BigQuery (Analytics/Layer 8)
    â”œâ”€â”€ Vendor performance
    â”œâ”€â”€ Trend analysis
    â””â”€â”€ ML training data

SECURITY:
â”œâ”€â”€ Secret Manager (API keys, DB passwords)
â”œâ”€â”€ Cloud KMS (Encryption keys)
â”œâ”€â”€ Identity-Aware Proxy (IAP)
â””â”€â”€ VPC Service Controls

MONITORING:
â”œâ”€â”€ Cloud Logging (Centralized logs)
â”œâ”€â”€ Cloud Monitoring (Metrics/Alerts)
â”œâ”€â”€ Error Reporting
â””â”€â”€ Cloud Trace (Performance)

CI/CD:
â”œâ”€â”€ GitHub â†’ Cloud Build
â”œâ”€â”€ Automated tests
â”œâ”€â”€ Docker build
â””â”€â”€ Deploy to Cloud Run
```

### Infrastructure as Code (Terraform)

```hcl
# infrastructure/terraform/main.tf
terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = "einharjer-valhalla"
  region  = "us-east5"
}

# Cloud SQL Instance
resource "google_sql_database_instance" "main" {
  name             = "first-contact-db"
  database_version = "POSTGRES_15"
  region           = "us-east5"

  settings {
    tier = "db-n1-standard-1"

    backup_configuration {
      enabled    = true
      start_time = "03:00"
    }

    ip_configuration {
      ipv4_enabled    = false
      private_network = google_compute_network.private_network.id
    }

    database_flags {
      name  = "cloudsql.iam_authentication"
      value = "on"
    }
  }
}

# Cloud Run Service
resource "google_cloud_run_service" "api" {
  name     = "first-contact-api"
  location = "us-east5"

  template {
    spec {
      service_account_name = google_service_account.api.email

      containers {
        image = "gcr.io/einharjer-valhalla/first-contact-api:latest"

        env {
          name  = "DB_HOST"
          value = "/cloudsql/${google_sql_database_instance.main.connection_name}"
        }

        env {
          name = "DB_PASSWORD"
          value_from {
            secret_key_ref {
              name = google_secret_manager_secret.db_password.secret_id
              key  = "latest"
            }
          }
        }
      }
    }

    metadata {
      annotations = {
        "autoscaling.knative.dev/minScale" = "1"
        "autoscaling.knative.dev/maxScale" = "10"
        "run.googleapis.com/cloudsql-instances" = google_sql_database_instance.main.connection_name
      }
    }
  }
}

# BigQuery Dataset (Layer 8)
resource "google_bigquery_dataset" "analytics" {
  dataset_id = "first_contact_analytics"
  location   = "US"

  access {
    role          = "OWNER"
    user_by_email = google_service_account.api.email
  }
}
```

---

## 8. TESTING STRATEGY

### Critical Tests (MUST PASS)

```python
# tests/test_multi_tenant.py
"""
CRITICAL: Prove multi-tenant isolation works.
Org A cannot see/modify Org B's data.
"""

@pytest.mark.asyncio
async def test_tenant_isolation_read(db: AsyncSession):
    """Org 1 cannot read Org 2's clients"""
    # Create client in Org 1
    await set_tenant_context(db, 1)
    client1 = Client(organization_id=1, first_name="Alice")
    db.add(client1)
    await db.commit()

    # Query as Org 2
    await set_tenant_context(db, 2)
    result = await db.execute(select(Client))
    clients = result.scalars().all()

    # Alice should NOT be visible
    assert client1.id not in [c.id for c in clients]

@pytest.mark.asyncio
async def test_tenant_isolation_write(db: AsyncSession):
    """Org 2 cannot modify Org 1's clients"""
    # Create client in Org 1
    await set_tenant_context(db, 1)
    client1 = Client(organization_id=1, first_name="Alice")
    db.add(client1)
    await db.commit()
    client_id = client1.id

    # Try to update as Org 2
    await set_tenant_context(db, 2)
    client = await db.get(Client, client_id)

    # RLS should prevent access
    assert client is None


# tests/test_layer8_access.py
"""
CRITICAL: Prove Layer 8 blocks vendors.
"""

@pytest.mark.asyncio
async def test_layer8_blocked_for_caseworker(api_client):
    """Caseworkers get 403 on Layer 8 endpoints"""
    caseworker_token = create_test_token(role="caseworker")

    response = await api_client.get(
        "/api/v1/analytics/vendor-performance",
        headers={"Authorization": f"Bearer {caseworker_token}"}
    )

    assert response.status_code == 403
    assert "Access denied" in response.json()["detail"]

@pytest.mark.asyncio
async def test_layer8_allowed_for_city_admin(api_client):
    """City admins can access Layer 8"""
    city_admin_token = create_test_token(role="city_admin")

    response = await api_client.get(
        "/api/v1/analytics/vendor-performance",
        headers={"Authorization": f"Bearer {city_admin_token}"}
    )

    assert response.status_code == 200
    assert "vendors" in response.json()


# tests/test_smart_matching.py
"""Test duplicate prevention"""

@pytest.mark.asyncio
async def test_fuzzy_name_matching():
    """Catch typos and alternate spellings"""
    matcher = SmartClientMatcher(db)

    # Existing: Marcus Thompson
    # New intake: Markus Thomson (typo)

    matches = await matcher.find_potential_duplicates(
        first_name="Markus",
        last_name="Thomson",
        date_of_birth=date(1985, 3, 15),
        ssn=None,
        organization_id=1
    )

    # Should find Marcus Thompson as potential duplicate
    assert len(matches) > 0
    assert matches[0][1] > 0.85  # High confidence


# tests/test_benefit_stack.py
"""Test benefit calculations"""

@pytest.mark.asyncio
async def test_gr_housing_subsidy_reduction():
    """GR reduces by $100 when housing subsidy active"""
    engine = BenefitStackEngine()

    client_info = {
        "has_gr": True,
        "housed": True,
        "eligible_gr_housing_subsidy": True
    }

    stack = await engine.calculate_benefit_stack(client, client_info)

    # Check GR is reduced
    assert stack.income_breakdown["gr"] == 121  # Not 221
    assert stack.income_breakdown["gr_housing_subsidy"] == 575

    # Total should be 696
    total = stack.income_breakdown["gr"] + stack.income_breakdown["gr_housing_subsidy"]
    assert total == 696
```

---

## 9. SECURITY ARCHITECTURE

### Data Protection

```python
# SSN Encryption
from cryptography.fernet import Fernet
from app.config import settings

class EncryptionService:
    """Encrypt PII (SSN, DOB, etc.)"""

    def __init__(self):
        self.cipher = Fernet(settings.encryption_key)

    def encrypt_ssn(self, ssn: str) -> str:
        """Encrypt SSN for storage"""
        return self.cipher.encrypt(ssn.encode()).decode()

    def decrypt_ssn(self, encrypted: str) -> str:
        """Decrypt for authorized access"""
        return self.cipher.decrypt(encrypted.encode()).decode()


# HMIS Privacy Compliance
class PrivacyManager:
    """
    HMIS requires:
    - Client consent for data sharing
    - Audit logs for all PII access
    - Data retention policies
    """

    async def check_consent(self, client_id: str, purpose: str) -> bool:
        """Verify client consented to data use"""
        pass

    async def log_pii_access(self, user_id: str, client_id: str, action: str):
        """Audit log for compliance"""
        await self.audit_log.create(
            user_id=user_id,
            client_id=client_id,
            action=action,
            timestamp=datetime.now(),
            ip_address=request.client.host
        )
```

### Rate Limiting

```python
# app/middleware/rate_limit.py
from fastapi import Request, HTTPException
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

# Apply to routes
@router.post("/intake/qr/{qr_id}")
@limiter.limit("10/minute")  # Prevent abuse
async def qr_intake(request: Request, ...):
    pass

@router.post("/ai/case-plan")
@limiter.limit("5/minute")  # AI is expensive
async def generate_case_plan(request: Request, ...):
    pass
```

---

## SUMMARY: What Makes This Architecture Special

### 1. **Research-Driven Design**
- Smart client matching (fixes Clarity's duplicate problem)
- Transportation coordination (solves #1 no-show cause)
- Auto-documentation (addresses caseworker burnout)
- Predictive analytics (LA County-style prevention)

### 2. **True Multi-Tenant**
- PostgreSQL RLS on EVERY table
- organization_id required
- Tested isolation (Org A can't see Org B)

### 3. **Layer 8 Enforcement**
- Role-based access control
- Vendors get 403 Forbidden
- Cities see performance data vendors don't know exists

### 4. **HMIS Compliance**
- FY 2024 data standards
- CSV export for Sage
- Privacy/security requirements
- Automated APR generation

### 5. **Human-in-the-Loop AI**
- AI generates recommendations
- Caseworker approves/modifies/rejects
- One-click workflows
- Explainable predictions

### 6. **Production-Ready**
- Auto-scaling (Cloud Run)
- High availability (Cloud SQL HA)
- Monitoring/logging
- CI/CD pipeline
- Disaster recovery

---

**Next Step:** Should I begin Week 1 implementation following this architecture?
