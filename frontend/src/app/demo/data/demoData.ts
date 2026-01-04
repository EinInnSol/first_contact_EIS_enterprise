// Enhanced demo data with Google Maps coordinates and all innovations

export interface DemoClient {
    id: number;
    name: string;
    age: number;
    gender: string;
    viSpdat: number;
    status: string;
    assignedVendor: string;
    intakeDate: string;
    housingStatus?: string;
    barriers: string[];
    location?: { lat: number; lng: number };
}

export interface VendorPerformance {
    id: number;
    name: string;
    housingRate: number;
    costPerOutcome: number;
    retention6mo: number;
    score: number;
    trend: number;
    location: { lat: number; lng: number };
    territory: Array<{ lat: number; lng: number }>;
    territoryName: string;
    clientsServed: number;
    activeClients: number;
    color: string;
}

export interface BenefitProgram {
    id: string;
    name: string;
    monthlyAmount: number;
    eligible: boolean;
    description: string;
    processingTime: string;
    category: 'income' | 'food' | 'housing' | 'healthcare';
}

export interface AIRecommendation {
    id: number;
    type: 'appointment' | 'resource' | 'intervention';
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    impact: string;
    action: string;
}

export interface AppointmentSlot {
    id: number;
    agency: string;
    service: string;
    date: string;
    time: string;
    duration: number;
    location: { lat: number; lng: number };
    address: string;
}

// Demo Clients with locations
export const demoClients: DemoClient[] = [
    {
        id: 1,
        name: "Robert Thompson",
        age: 42,
        gender: "Male",
        viSpdat: 8,
        status: "intake_complete",
        assignedVendor: "PATH",
        intakeDate: "2025-12-15",
        barriers: ["Chronic homelessness", "Mental health", "No income"],
        location: { lat: 33.7701, lng: -118.1937 }
    },
    {
        id: 2,
        name: "Maria Rodriguez",
        age: 35,
        gender: "Female",
        viSpdat: 6,
        status: "case_plan_approved",
        assignedVendor: "PATH",
        intakeDate: "2025-12-10",
        housingStatus: "housed",
        barriers: ["Domestic violence survivor", "Two children"],
        location: { lat: 33.7725, lng: -118.1950 }
    },
    {
        id: 3,
        name: "James Wilson",
        age: 58,
        gender: "Male",
        viSpdat: 9,
        status: "intake_complete",
        assignedVendor: "MHALA",
        intakeDate: "2025-12-20",
        barriers: ["Severe mental illness", "Substance use", "Criminal record"],
        location: { lat: 33.7489, lng: -118.2651 }
    },
    {
        id: 4,
        name: "Sarah Chen",
        age: 28,
        gender: "Female",
        viSpdat: 5,
        status: "benefits_pending",
        assignedVendor: "HOPICS",
        intakeDate: "2025-12-18",
        barriers: ["Recent job loss", "No family support"],
        location: { lat: 33.7838, lng: -118.1141 }
    },
];

// Vendor Performance with territories
export const vendorPerformance: VendorPerformance[] = [
    {
        id: 1,
        name: "PATH",
        housingRate: 0.73,
        costPerOutcome: 21000,
        retention6mo: 0.82,
        score: 94,
        trend: 5,
        location: { lat: 33.7701, lng: -118.1937 },
        territory: [
            { lat: 33.7850, lng: -118.2100 },
            { lat: 33.7850, lng: -118.1700 },
            { lat: 33.7550, lng: -118.1700 },
            { lat: 33.7550, lng: -118.2100 },
        ],
        territoryName: "North Long Beach",
        clientsServed: 156,
        activeClients: 42,
        color: "#22C55E"
    },
    {
        id: 2,
        name: "HOPICS",
        housingRate: 0.68,
        costPerOutcome: 24500,
        retention6mo: 0.76,
        score: 87,
        trend: 2,
        location: { lat: 33.7838, lng: -118.1141 },
        territory: [
            { lat: 33.8000, lng: -118.1300 },
            { lat: 33.8000, lng: -118.0900 },
            { lat: 33.7650, lng: -118.0900 },
            { lat: 33.7650, lng: -118.1300 },
        ],
        territoryName: "East Long Beach",
        clientsServed: 98,
        activeClients: 28,
        color: "#3B82F6"
    },
    {
        id: 3,
        name: "LAMP",
        housingRate: 0.54,
        costPerOutcome: 32000,
        retention6mo: 0.61,
        score: 72,
        trend: -1,
        location: { lat: 33.7675, lng: -118.1892 },
        territory: [
            { lat: 33.7800, lng: -118.2000 },
            { lat: 33.7800, lng: -118.1700 },
            { lat: 33.7550, lng: -118.1700 },
            { lat: 33.7550, lng: -118.2000 },
        ],
        territoryName: "Central Long Beach",
        clientsServed: 124,
        activeClients: 51,
        color: "#F59E0B"
    },
    {
        id: 4,
        name: "MHALA",
        housingRate: 0.24,
        costPerOutcome: 78000,
        retention6mo: 0.45,
        score: 34,
        trend: -8,
        location: { lat: 33.7489, lng: -118.2651 },
        territory: [
            { lat: 33.7650, lng: -118.2800 },
            { lat: 33.7650, lng: -118.2400 },
            { lat: 33.7300, lng: -118.2400 },
            { lat: 33.7300, lng: -118.2800 },
        ],
        territoryName: "West Long Beach",
        clientsServed: 87,
        activeClients: 66,
        color: "#EF4444"
    },
];

// Benefit Programs
export const benefitPrograms: BenefitProgram[] = [
    {
        id: "ssi",
        name: "SSI (Supplemental Security Income)",
        monthlyAmount: 943,
        eligible: true,
        description: "Federal income supplement for disabled individuals",
        processingTime: "3-6 months",
        category: "income"
    },
    {
        id: "calfresh",
        name: "CalFresh (Food Stamps)",
        monthlyAmount: 281,
        eligible: true,
        description: "Nutrition assistance program",
        processingTime: "30 days",
        category: "food"
    },
    {
        id: "ga",
        name: "General Assistance",
        monthlyAmount: 221,
        eligible: true,
        description: "County cash assistance program",
        processingTime: "14 days",
        category: "income"
    },
    {
        id: "medi-cal",
        name: "Medi-Cal",
        monthlyAmount: 0,
        eligible: true,
        description: "California's Medicaid health coverage program",
        processingTime: "45 days",
        category: "healthcare"
    },
    {
        id: "housing-voucher",
        name: "Housing Choice Voucher (Section 8)",
        monthlyAmount: 902,
        eligible: true,
        description: "Rental assistance program",
        processingTime: "6-12 months (waitlist)",
        category: "housing"
    },
];

// AI Recommendations (Calling Audibles)
export const aiRecommendations: AIRecommendation[] = [
    {
        id: 1,
        type: "appointment",
        priority: "high",
        title: "Optimize DMV Appointment",
        description: "Robert's DMV appointment conflicts with mental health therapy. Reschedule DMV to Thursday 2pm to avoid missing critical treatment.",
        impact: "Prevents missed therapy session, maintains treatment continuity",
        action: "Reschedule DMV Appointment"
    },
    {
        id: 2,
        type: "resource",
        priority: "high",
        title: "Emergency Food Resources",
        description: "Client reported food insecurity. CalFresh application pending. Connect with Long Beach Rescue Mission for immediate food assistance.",
        impact: "Addresses immediate need while benefits process",
        action: "Send Food Resource Referral"
    },
    {
        id: 3,
        type: "intervention",
        priority: "medium",
        title: "Transportation Barrier Detected",
        description: "Client has 3 appointments next week across different locations. No reliable transportation. Coordinate ride-sharing or provide bus passes.",
        impact: "Reduces no-show risk from 31% to 8%",
        action: "Arrange Transportation"
    },
];

// Appointment Slots
export const appointmentSlots: AppointmentSlot[] = [
    {
        id: 1,
        agency: "DMV",
        service: "California ID Application",
        date: "2026-01-08",
        time: "10:00 AM",
        duration: 60,
        location: { lat: 33.7866, lng: -118.1542 },
        address: "3700 E Willow St, Long Beach, CA 90815"
    },
    {
        id: 2,
        agency: "LAMP Community Health",
        service: "Mental Health Evaluation",
        date: "2026-01-08",
        time: "2:00 PM",
        duration: 90,
        location: { lat: 33.7675, lng: -118.1892 },
        address: "1220 Pacific Ave, Long Beach, CA 90813"
    },
    {
        id: 3,
        agency: "Social Security Office",
        service: "SSI Application",
        date: "2026-01-10",
        time: "9:00 AM",
        duration: 120,
        location: { lat: 33.7701, lng: -118.1937 },
        address: "1451 Martin Luther King Jr Ave, Long Beach, CA 90813"
    },
];

// AI Case Plan (same as before)
export const aiCasePlan = `# 90-Day Housing Stability Plan for Robert Thompson

## Client Overview
- **Name:** Robert Thompson
- **Age:** 42
- **VI-SPDAT Score:** 8 (High Acuity)
- **Primary Barriers:** Chronic homelessness, mental health challenges, lack of income

---

## Phase 1: Stabilization (Days 1-30)

### Immediate Needs
1. **Emergency Shelter Placement**
   - Secure bed at PATH shelter within 48 hours
   - Coordinate intake with mental health screening
   - Establish daily check-in routine

2. **Benefits Enrollment**
   - Apply for SSI (disability income) - Priority 1
   - Enroll in CalFresh (food assistance) - Week 1
   - Apply for General Assistance - Week 1
   - Medi-Cal enrollment for healthcare access

3. **Health Assessment**
   - Schedule comprehensive medical exam
   - Mental health evaluation with LAMP Community Health
   - Substance use screening if applicable
   - Medication management plan

### Milestones
- ✓ Stable shelter placement
- ✓ Benefits applications submitted
- ✓ Medical/mental health baseline established

---

## Phase 2: Foundation Building (Days 31-60)

### Housing Preparation
1. **Document Acquisition**
   - Obtain California ID (DMV appointment scheduled)
   - Birth certificate request submitted
   - Social Security card replacement

2. **Financial Stability**
   - Open bank account (once ID obtained)
   - Set up direct deposit for benefits
   - Financial literacy workshop enrollment

3. **Case Management**
   - Weekly check-ins with assigned caseworker
   - Housing readiness workshops
   - Conflict resolution training
   - Life skills development

### Milestones
- ✓ Valid ID obtained
- ✓ Bank account established
- ✓ First benefit payments received

---

## Phase 3: Housing Transition (Days 61-90)

### Permanent Housing
1. **Housing Search**
   - Apply for Housing Choice Voucher (Section 8)
   - Explore Permanent Supportive Housing options
   - Coordinate with landlord outreach team

2. **Move-In Support**
   - Furniture/household items through donation program
   - First month's rent assistance
   - Utility setup and deposits

3. **Ongoing Support**
   - Monthly case management (reduced frequency)
   - Mental health services continuation
   - Employment readiness assessment
   - Peer support group connection

### Milestones
- ✓ Housing application approved
- ✓ Lease signed
- ✓ Successful move-in
- ✓ 30-day housing retention

---

## Success Metrics
- Housing placement by Day 90
- Income from benefits: $2,347/month projected
- Mental health treatment engagement
- Zero shelter rule violations
- Case plan adherence rate >80%

## Risk Factors & Mitigation
- **Risk:** Mental health crisis → **Mitigation:** Weekly therapy, crisis hotline access
- **Risk:** Benefit denial → **Mitigation:** Appeal process, alternative income sources
- **Risk:** Housing application rejection → **Mitigation:** Multiple applications, landlord incentives

---

**Generated by First Contact E.I.S. AI**
*This plan is a recommendation. Final approval required by licensed caseworker.*
`;

// AI Strategic Responses (same as before, keeping existing ones)
export const aiStrategicResponses: Record<string, string> = {
    "Which vendor has the best housing rate?": `Based on current data, **PATH** has the best housing rate at **73%**, significantly outperforming other vendors:

**Performance Comparison:**
- PATH: 73% housing rate, $21K cost per outcome
- HOPICS: 68% housing rate, $24.5K cost per outcome  
- LAMP: 54% housing rate, $32K cost per outcome
- MHALA: 24% housing rate, $78K cost per outcome

**Why PATH Excels:**
1. Specialized rapid rehousing program
2. Strong landlord partnerships
3. Intensive case management model
4. Proven trauma-informed care approach

**Recommendation:** Consider expanding PATH's contract and studying their best practices for replication across other vendors.`,

    "Why is MHALA underperforming?": `MHALA's performance (24% housing rate, $78K cost per outcome) indicates several systemic issues:

**Key Factors:**
1. **High-Acuity Clients:** MHALA serves clients with severe mental health needs (avg VI-SPDAT: 8.9 vs system avg: 6.2)
2. **Longer Stabilization Period:** Mental health treatment requires 6-12 months before housing readiness
3. **Limited Housing Options:** Clients need supportive housing, which has limited availability
4. **Staffing Challenges:** High caseworker turnover (40% annual) disrupts continuity of care

**However, concerning patterns:**
- 45% retention rate (lowest in system)
- Declining trend (-8% over 6 months)
- High no-show rate for appointments (31%)

**Recommendations:**
1. Conduct operational audit of MHALA's case management practices
2. Increase supportive housing inventory
3. Implement retention-focused interventions
4. Consider performance improvement plan or contract restructuring`,

    "How can we reduce overall cost per outcome?": `Analysis shows significant opportunity to reduce cost per outcome from current average of $38,875 to projected $28,500 (27% reduction):

**Strategy 1: Reallocate to High Performers**
- Shift 30% of MHALA's contract ($2.1M) to PATH
- Projected impact: +47 additional placements/year
- Cost savings: $890K annually

**Strategy 2: Standardize Best Practices**
- Implement PATH's rapid rehousing model system-wide
- Projected 15% efficiency gain across all vendors
- Cost savings: $1.2M annually

**Strategy 3: Optimize Benefit Enrollment**
- Current avg time to SSI approval: 147 days
- AI-assisted applications reduce to 89 days
- Faster income = faster housing stability
- Projected 20% reduction in shelter costs

**Strategy 4: Predictive Intervention**
- AI identifies clients at risk of housing loss
- Early intervention reduces returns to homelessness by 35%
- Cost avoidance: $780K annually

**Total Projected Savings:** $2.87M annually (18% of total budget)`,
};

// QR Locations with scan data
export const qrLocations = [
    {
        id: 1,
        name: "MLK Park",
        address: "1950 Lemon Ave, Long Beach, CA",
        location: { lat: 33.7701, lng: -118.1937 },
        scans: 156,
        intakes: 117,
        conversionRate: 0.75,
        assignedVendor: "PATH"
    },
    {
        id: 2,
        name: "Beach Shelter",
        address: "1335 Pacific Ave, Long Beach, CA",
        location: { lat: 33.7675, lng: -118.1892 },
        scans: 203,
        intakes: 178,
        conversionRate: 0.88,
        assignedVendor: "HOPICS"
    },
    {
        id: 3,
        name: "Downtown Library",
        address: "101 Pacific Ave, Long Beach, CA",
        location: { lat: 33.7701, lng: -118.1937 },
        scans: 89,
        intakes: 13,
        conversionRate: 0.15,
        assignedVendor: "MHALA"
    },
    {
        id: 4,
        name: "Community Center",
        address: "1301 W 3rd St, Long Beach, CA",
        location: { lat: 33.7675, lng: -118.1892 },
        scans: 124,
        intakes: 98,
        conversionRate: 0.79,
        assignedVendor: "LAMP"
    }
];

// Heat map data points
export const heatmapData = {
    placements: [
        { location: { lat: 33.7701, lng: -118.1937 }, weight: 45 },
        { location: { lat: 33.7838, lng: -118.1141 }, weight: 32 },
        { location: { lat: 33.7675, lng: -118.1892 }, weight: 28 },
        { location: { lat: 33.7489, lng: -118.2651 }, weight: 12 },
    ],
    qrScans: [
        { location: { lat: 33.7701, lng: -118.1937 }, weight: 156 },
        { location: { lat: 33.7675, lng: -118.1892 }, weight: 203 },
        { location: { lat: 33.7838, lng: -118.1141 }, weight: 124 },
        { location: { lat: 33.7489, lng: -118.2651 }, weight: 89 },
    ],
    serviceGaps: [
        { location: { lat: 33.7950, lng: -118.2200 }, weight: 85 },
        { location: { lat: 33.7400, lng: -118.1500 }, weight: 62 },
    ]
};
