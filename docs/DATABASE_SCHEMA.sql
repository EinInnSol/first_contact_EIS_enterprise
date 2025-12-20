-- FIRST CONTACT E.I.S. - DATABASE SCHEMA
-- PostgreSQL 15 with Row-Level Security
-- EVERY table has organization_id - NO EXCEPTIONS

-- ============================================
-- EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- CORE TABLES
-- ============================================

-- Organizations (Tenants = Cities/CoCs)
CREATE TABLE organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    city VARCHAR(100),
    state VARCHAR(2),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Vendors (Service providers within an organization)
CREATE TABLE vendors (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organizations(id),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(50) NOT NULL,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    address TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(organization_id, slug)
);

-- Users (All user types)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id INTEGER NOT NULL REFERENCES organizations(id),
    vendor_id INTEGER REFERENCES vendors(id), -- NULL for city admins
    email VARCHAR(255) NOT NULL,
    password_hash TEXT NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    role VARCHAR(20) NOT NULL CHECK (role IN ('client', 'caseworker', 'vendor_admin', 'city_admin', 'city_council')),
    active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(organization_id, email)
);

-- ============================================
-- QR CODE SYSTEM (Core Innovation)
-- ============================================

-- Vendor Territories
CREATE TABLE vendor_territories (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organizations(id),
    vendor_id INTEGER NOT NULL REFERENCES vendors(id),
    name VARCHAR(100) NOT NULL, -- "East Side", "Downtown"
    description TEXT,
    boundary_geojson JSONB, -- Geographic boundary
    created_at TIMESTAMP DEFAULT NOW()
);

-- QR Locations (Each QR code placed in the field)
CREATE TABLE qr_locations (
    id VARCHAR(50) PRIMARY KEY, -- e.g., "lb-mlk-park"
    organization_id INTEGER NOT NULL REFERENCES organizations(id),
    territory_id INTEGER REFERENCES vendor_territories(id),
    vendor_id INTEGER NOT NULL REFERENCES vendors(id), -- Direct assignment
    name VARCHAR(100) NOT NULL, -- "MLK Park"
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    qr_code_url TEXT, -- Cloud Storage URL
    active BOOLEAN DEFAULT TRUE,
    scan_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- QR Scan Events (Layer 8 data!)
CREATE TABLE qr_scan_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id INTEGER NOT NULL REFERENCES organizations(id),
    qr_location_id VARCHAR(50) NOT NULL REFERENCES qr_locations(id),
    scanned_at TIMESTAMP DEFAULT NOW(),
    device_type VARCHAR(50), -- iOS, Android, Desktop
    user_agent TEXT,
    ip_address INET,
    resulted_in_intake BOOLEAN DEFAULT FALSE,
    client_id UUID, -- If intake completed
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- CLIENT MANAGEMENT
-- ============================================

-- Clients (People receiving services)
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id INTEGER NOT NULL REFERENCES organizations(id),
    assigned_vendor_id INTEGER NOT NULL REFERENCES vendors(id),
    assigned_caseworker_id UUID REFERENCES users(id),
    intake_qr_location_id VARCHAR(50) REFERENCES qr_locations(id),
    
    -- Basic Info
    case_number VARCHAR(20) UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    date_of_birth DATE,
    ssn_encrypted TEXT, -- Encrypted with pgcrypto
    
    -- Contact
    phone VARCHAR(20),
    email VARCHAR(255),
    preferred_contact VARCHAR(20) DEFAULT 'phone',
    
    -- VI-SPDAT Assessment
    vi_spdat_score INTEGER, -- 0-17
    vi_spdat_date DATE,
    acuity_level VARCHAR(20), -- low, moderate, high, severe
    
    -- Status
    status VARCHAR(30) DEFAULT 'intake' CHECK (status IN (
        'intake', 'assessment', 'enrolled', 'housed', 
        'stabilizing', 'exited_positive', 'exited_negative', 'disengaged'
    )),
    housing_type VARCHAR(50), -- current housing situation
    
    -- Outcomes (for Layer 8)
    intake_date DATE DEFAULT CURRENT_DATE,
    housed_date DATE,
    exit_date DATE,
    exit_type VARCHAR(50),
    exit_income_monthly DECIMAL(10, 2), -- Monthly income at exit
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- BENEFIT STACK SYSTEM
-- ============================================

-- Benefit Programs (Reference table)
CREATE TABLE benefit_programs (
    id SERIAL PRIMARY KEY,
    code VARCHAR(30) UNIQUE NOT NULL, -- "calfresh", "ssi", "gr", etc.
    name VARCHAR(100) NOT NULL,
    category VARCHAR(30) NOT NULL, -- income, housing, healthcare, food, other
    typical_amount DECIMAL(10, 2),
    description TEXT,
    eligibility_rules JSONB, -- Rule definitions
    dependencies JSONB, -- Other programs that affect this one
    active BOOLEAN DEFAULT TRUE
);

-- Client Benefit Enrollments
CREATE TABLE client_benefit_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id INTEGER NOT NULL REFERENCES organizations(id),
    client_id UUID NOT NULL REFERENCES clients(id),
    program_id INTEGER NOT NULL REFERENCES benefit_programs(id),
    
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN (
        'pending', 'applied', 'approved', 'denied', 'active', 'expired', 'cancelled'
    )),
    
    monthly_amount DECIMAL(10, 2),
    application_date DATE,
    approval_date DATE,
    start_date DATE,
    end_date DATE,
    
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Benefit Stack Projections (AI-generated)
CREATE TABLE benefit_stack_projections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id INTEGER NOT NULL REFERENCES organizations(id),
    client_id UUID NOT NULL REFERENCES clients(id),
    
    projected_monthly_income DECIMAL(10, 2),
    projected_monthly_expenses DECIMAL(10, 2),
    projected_net_monthly DECIMAL(10, 2),
    
    programs_recommended JSONB, -- Array of program codes
    programs_timeline JSONB, -- When each should be applied for
    
    generated_at TIMESTAMP DEFAULT NOW(),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP
);

-- ============================================
-- CASE PLANS
-- ============================================

CREATE TABLE case_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id INTEGER NOT NULL REFERENCES organizations(id),
    client_id UUID NOT NULL REFERENCES clients(id),
    caseworker_id UUID NOT NULL REFERENCES users(id),
    
    -- AI-Generated Content
    recommended_pathway VARCHAR(50), -- psh, rrh, sober_living, etc.
    summary TEXT,
    reasoning JSONB, -- Array of reasoning points
    
    -- Actions
    actions JSONB, -- Array of action items with schedules
    
    -- Projections
    projected_stability_days INTEGER,
    projected_exit_income DECIMAL(10, 2),
    confidence_score DECIMAL(3, 2), -- 0.00 to 1.00
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
        'pending', 'approved', 'modified', 'rejected', 'completed'
    )),
    
    approved_at TIMESTAMP,
    modified_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Case Plan Actions (Individual tasks)
CREATE TABLE case_plan_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id INTEGER NOT NULL REFERENCES organizations(id),
    case_plan_id UUID NOT NULL REFERENCES case_plans(id),
    client_id UUID NOT NULL REFERENCES clients(id),
    
    action_type VARCHAR(50) NOT NULL, -- appointment, document, application, etc.
    description TEXT NOT NULL,
    provider_name VARCHAR(100),
    
    scheduled_date DATE,
    scheduled_time TIME,
    
    transport_needed BOOLEAN DEFAULT FALSE,
    transport_arranged BOOLEAN DEFAULT FALSE,
    
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
        'pending', 'scheduled', 'completed', 'cancelled', 'no_show'
    )),
    
    completed_at TIMESTAMP,
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- LAYER 8: VENDOR PERFORMANCE METRICS
-- ============================================

-- Vendor Performance (Aggregated metrics - city-only access!)
CREATE TABLE vendor_performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id INTEGER NOT NULL REFERENCES organizations(id),
    vendor_id INTEGER NOT NULL REFERENCES vendors(id),
    
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    -- Client Counts
    total_clients INTEGER DEFAULT 0,
    new_intakes INTEGER DEFAULT 0,
    active_clients INTEGER DEFAULT 0,
    
    -- Outcomes
    housed_count INTEGER DEFAULT 0,
    positive_exits INTEGER DEFAULT 0,
    negative_exits INTEGER DEFAULT 0,
    disengaged_count INTEGER DEFAULT 0,
    
    -- Financial
    avg_cost_per_client DECIMAL(10, 2),
    avg_exit_income DECIMAL(10, 2),
    
    -- Efficiency
    avg_days_to_housing DECIMAL(5, 1),
    avg_days_to_stability DECIMAL(5, 1),
    no_show_rate DECIMAL(4, 3),
    
    -- Retention
    retention_6mo DECIMAL(4, 3),
    retention_12mo DECIMAL(4, 3),
    
    calculated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(organization_id, vendor_id, period_start, period_end)
);

-- ============================================
-- COMPLIANCE REPORTING
-- ============================================

CREATE TABLE compliance_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id INTEGER NOT NULL REFERENCES organizations(id),
    
    report_type VARCHAR(50) NOT NULL, -- hud_apr, hmis_export, grant_report
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    due_date DATE,
    
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN (
        'draft', 'ready', 'reviewed', 'sent', 'accepted'
    )),
    
    report_data JSONB, -- The actual report content
    file_url TEXT, -- Generated PDF/CSV
    
    generated_at TIMESTAMP DEFAULT NOW(),
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP,
    sent_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- ROW-LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tenant tables
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_territories ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_scan_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_benefit_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE benefit_stack_projections ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_plan_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_reports ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (using app.organization_id session variable)
CREATE POLICY tenant_isolation ON vendors
    FOR ALL USING (organization_id = current_setting('app.organization_id')::INTEGER);

CREATE POLICY tenant_isolation ON users
    FOR ALL USING (organization_id = current_setting('app.organization_id')::INTEGER);

CREATE POLICY tenant_isolation ON vendor_territories
    FOR ALL USING (organization_id = current_setting('app.organization_id')::INTEGER);

CREATE POLICY tenant_isolation ON qr_locations
    FOR ALL USING (organization_id = current_setting('app.organization_id')::INTEGER);

CREATE POLICY tenant_isolation ON qr_scan_events
    FOR ALL USING (organization_id = current_setting('app.organization_id')::INTEGER);

CREATE POLICY tenant_isolation ON clients
    FOR ALL USING (organization_id = current_setting('app.organization_id')::INTEGER);

CREATE POLICY tenant_isolation ON client_benefit_enrollments
    FOR ALL USING (organization_id = current_setting('app.organization_id')::INTEGER);

CREATE POLICY tenant_isolation ON benefit_stack_projections
    FOR ALL USING (organization_id = current_setting('app.organization_id')::INTEGER);

CREATE POLICY tenant_isolation ON case_plans
    FOR ALL USING (organization_id = current_setting('app.organization_id')::INTEGER);

CREATE POLICY tenant_isolation ON case_plan_actions
    FOR ALL USING (organization_id = current_setting('app.organization_id')::INTEGER);

CREATE POLICY tenant_isolation ON vendor_performance_metrics
    FOR ALL USING (organization_id = current_setting('app.organization_id')::INTEGER);

CREATE POLICY tenant_isolation ON compliance_reports
    FOR ALL USING (organization_id = current_setting('app.organization_id')::INTEGER);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_vendors_org ON vendors(organization_id);
CREATE INDEX idx_users_org ON users(organization_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_clients_org ON clients(organization_id);
CREATE INDEX idx_clients_vendor ON clients(assigned_vendor_id);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_case_number ON clients(case_number);
CREATE INDEX idx_qr_locations_org ON qr_locations(organization_id);
CREATE INDEX idx_qr_scan_events_org ON qr_scan_events(organization_id);
CREATE INDEX idx_qr_scan_events_location ON qr_scan_events(qr_location_id);
CREATE INDEX idx_case_plans_client ON case_plans(client_id);
CREATE INDEX idx_vendor_metrics_org_vendor ON vendor_performance_metrics(organization_id, vendor_id);

-- ============================================
-- SEED DATA: Benefit Programs
-- ============================================

INSERT INTO benefit_programs (code, name, category, typical_amount, description, eligibility_rules, dependencies) VALUES
-- Income Sources
('ssi', 'Supplemental Security Income', 'income', 1183.00, 'Federal disability income', 
 '{"requires": ["disability_documentation"], "excludes": ["ssdi_over_limit"]}', 
 '{"enables": ["ihss"]}'),
 
('ssdi', 'Social Security Disability Insurance', 'income', 1500.00, 'Disability insurance from work history',
 '{"requires": ["disability_documentation", "work_credits"]}', NULL),
 
('gr', 'General Relief', 'income', 221.00, 'County cash assistance',
 '{"requires": ["no_dependents", "low_income"], "excludes": ["ssi", "ssdi"]}',
 '{"modified_by": {"gr_housing_subsidy": {"reduces_by": 100}}}'),
 
('calworks', 'CalWORKs', 'income', 750.00, 'Cash aid for families',
 '{"requires": ["has_children"]}', NULL),

-- Housing Assistance
('gr_housing_subsidy', 'GR Housing Subsidy', 'housing', 575.00, 'Rental assistance for GR recipients',
 '{"requires": ["gr_recipient", "housed"]}',
 '{"affects": {"gr": {"reduces_by": 100}}}'),
 
('section8', 'Section 8 Voucher', 'housing', 1200.00, 'Federal rental assistance',
 '{"requires": ["on_waitlist"], "waitlist_years": 3}', NULL),
 
('vash', 'VASH Voucher', 'housing', 1200.00, 'VA rental assistance for homeless veterans',
 '{"requires": ["veteran", "homeless"]}', NULL),
 
('rrh', 'Rapid Rehousing', 'housing', 800.00, 'Temporary rental subsidy',
 '{"requires": ["homeless", "employable"], "duration_months": 12}', NULL),

-- Healthcare
('medi_cal', 'Medi-Cal', 'healthcare', 0.00, 'California Medicaid',
 '{"requires": ["low_income"]}', NULL),
 
('ihss', 'In-Home Supportive Services', 'healthcare', 1200.00, 'Pays caregiver for disabled individuals',
 '{"requires": ["ssi_or_medi_cal", "needs_daily_assistance"]}', NULL),

-- Food
('calfresh', 'CalFresh', 'food', 234.00, 'California food stamps (SNAP)',
 '{"requires": ["low_income"]}', NULL),

-- Utilities
('liheap', 'LIHEAP', 'utilities', 500.00, 'One-time utility assistance',
 '{"requires": ["low_income"], "frequency": "annual"}', NULL),
 
('care', 'CARE/FERA', 'utilities', 50.00, 'Reduced utility rates',
 '{"requires": ["low_income"]}', NULL),
 
('lifeline', 'Lifeline', 'phone', 15.00, 'Free/reduced phone service',
 '{"requires": ["low_income"]}', NULL);

-- ============================================
-- SEED DATA: Demo Organization (Long Beach)
-- ============================================

INSERT INTO organizations (id, name, slug, city, state) VALUES
(1, 'Long Beach Homeless Services', 'longbeach', 'Long Beach', 'CA');

INSERT INTO vendors (id, organization_id, name, slug) VALUES
(101, 1, 'PATH (People Assisting The Homeless)', 'path'),
(102, 1, 'Long Beach Rescue Mission', 'lbrm'),
(103, 1, 'CityNet', 'citynet'),
(104, 1, 'Mental Health America of LA', 'mhala');

INSERT INTO qr_locations (id, organization_id, vendor_id, name, address, latitude, longitude) VALUES
('lb-mlk-park', 1, 101, 'MLK Park', '1950 Lemon Ave, Long Beach, CA', 33.7866, -118.1589),
('lb-beach-shelter', 1, 102, 'Beach Blvd Shelter', '123 Beach Blvd, Long Beach, CA', 33.7701, -118.1937),
('lb-transit', 1, 103, 'Transit Center', '1234 Long Beach Blvd, Long Beach, CA', 33.7683, -118.1892),
('lb-library', 1, 104, 'Main Library', '101 Pacific Ave, Long Beach, CA', 33.7688, -118.1935);

-- Reset sequence for organizations
SELECT setval('organizations_id_seq', 1, true);
SELECT setval('vendors_id_seq', 104, true);
