-- FIRST CONTACT E.I.S. - DATABASE SCHEMA
-- PostgreSQL 15+ with Row-Level Security
-- CRITICAL: Every table has organization_id for multi-tenant isolation

-- ============================================
-- EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- CORE TABLES
-- ============================================

-- Organizations (Tenants = Cities)
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

-- Enable RLS on vendors
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON vendors
    FOR ALL USING (organization_id = current_setting('app.organization_id', true)::INTEGER);

-- Users (All user types)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Enable RLS on users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON users
    FOR ALL USING (organization_id = current_setting('app.organization_id', true)::INTEGER);

-- ============================================
-- QR CODE SYSTEM (Core Innovation)
-- ============================================

-- QR Locations (Each QR code placed in the field)
CREATE TABLE qr_locations (
    id VARCHAR(50) PRIMARY KEY, -- e.g., "lb-mlk-park"
    organization_id INTEGER NOT NULL REFERENCES organizations(id),
    vendor_id INTEGER NOT NULL REFERENCES vendors(id), -- Direct assignment
    name VARCHAR(100) NOT NULL, -- "MLK Park"
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    location_type VARCHAR(50), -- park, library, shelter, etc.
    qr_code_url TEXT, -- Cloud Storage URL
    active BOOLEAN DEFAULT TRUE,
    scan_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on qr_locations
ALTER TABLE qr_locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON qr_locations
    FOR ALL USING (organization_id = current_setting('app.organization_id', true)::INTEGER);

-- QR Scan Events (Layer 8 analytics data!)
CREATE TABLE qr_scan_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Enable RLS on qr_scan_events
ALTER TABLE qr_scan_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON qr_scan_events
    FOR ALL USING (organization_id = current_setting('app.organization_id', true)::INTEGER);

-- ============================================
-- CLIENT MANAGEMENT
-- ============================================

-- Clients (People receiving services)
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Enable RLS on clients
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON clients
    FOR ALL USING (organization_id = current_setting('app.organization_id', true)::INTEGER);

-- ============================================
-- LAYER 8: VENDOR PERFORMANCE METRICS
-- ============================================

-- Vendor Performance (Aggregated metrics - city-only access!)
CREATE TABLE vendor_performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Enable RLS on vendor_performance_metrics
ALTER TABLE vendor_performance_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON vendor_performance_metrics
    FOR ALL USING (organization_id = current_setting('app.organization_id', true)::INTEGER);

-- ============================================
-- FORCE RLS FOR TABLE OWNERS
-- (Required because app user owns tables)
-- ============================================
ALTER TABLE vendors FORCE ROW LEVEL SECURITY;
ALTER TABLE users FORCE ROW LEVEL SECURITY;
ALTER TABLE clients FORCE ROW LEVEL SECURITY;
ALTER TABLE qr_locations FORCE ROW LEVEL SECURITY;
ALTER TABLE qr_scan_events FORCE ROW LEVEL SECURITY;
ALTER TABLE vendor_performance_metrics FORCE ROW LEVEL SECURITY;

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_vendors_org ON vendors(organization_id);
CREATE INDEX idx_users_org ON users(organization_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_vendor ON users(vendor_id);
CREATE INDEX idx_clients_org ON clients(organization_id);
CREATE INDEX idx_clients_vendor ON clients(assigned_vendor_id);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_case_number ON clients(case_number);
CREATE INDEX idx_qr_locations_org ON qr_locations(organization_id);
CREATE INDEX idx_qr_locations_vendor ON qr_locations(vendor_id);
CREATE INDEX idx_qr_scan_events_org ON qr_scan_events(organization_id);
CREATE INDEX idx_qr_scan_events_location ON qr_scan_events(qr_location_id);
CREATE INDEX idx_vendor_metrics_org_vendor ON vendor_performance_metrics(organization_id, vendor_id);

-- ============================================
-- SEED DATA: Long Beach Demo
-- ============================================

-- Organization
INSERT INTO organizations (id, name, slug, city, state) VALUES
(1, 'Long Beach Homeless Services', 'long-beach', 'Long Beach', 'CA');

-- Vendors
INSERT INTO vendors (id, organization_id, name, slug, contact_email) VALUES
(1, 1, 'PATH (People Assisting The Homeless)', 'path', 'contact@pathpartners.org'),
(2, 1, 'Long Beach Rescue Mission', 'lbrm', 'contact@lbrm.org'),
(3, 1, 'CityNet', 'citynet', 'contact@citynet.org'),
(4, 1, 'Mental Health America of LA', 'mhala', 'contact@mhala.org');

-- QR Locations (assigned to vendors)
INSERT INTO qr_locations (id, organization_id, vendor_id, name, address, latitude, longitude, location_type) VALUES
('lb-mlk-park', 1, 1, 'MLK Park', '1950 Lemon Ave, Long Beach, CA', 33.7866, -118.1589, 'park'),
('lb-downtown-library', 1, 2, 'Downtown Library', '101 Pacific Ave, Long Beach, CA', 33.7688, -118.1935, 'library'),
('lb-lincoln-park', 1, 3, 'Lincoln Park', '2285 E Pacific Coast Hwy, Long Beach, CA', 33.7701, -118.1550, 'park'),
('lb-multi-service', 1, 4, 'Multi-Service Center', '1301 W 12th St, Long Beach, CA', 33.7858, -118.2005, 'service_center');

-- Reset sequences
SELECT setval('organizations_id_seq', 1, true);
SELECT setval('vendors_id_seq', 4, true);
