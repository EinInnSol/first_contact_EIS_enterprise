-- GCP Cloud SQL Performance Indexes
-- Optimized for Cloud SQL PostgreSQL 15

-- Analytics query optimization (Layer 8)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_clients_vendor_status_dates
    ON clients(assigned_vendor_id, status, intake_date, housed_date)
    WHERE status IN ('housed', 'exited_positive');

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_clients_org_intake_date
    ON clients(organization_id, intake_date DESC)
    INCLUDE (status, assigned_vendor_id);

-- QR analytics optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_qr_scans_location_conversion
    ON qr_scan_events(qr_location_id, resulted_in_intake, scanned_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_qr_locations_vendor_active
    ON qr_locations(vendor_id, active)
    WHERE active = true;

-- Audit log queries (Cloud Logging integration)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_timestamp_action
    ON audit_logs(created_at DESC, action)
    INCLUDE (user_id, organization_id);

-- User authentication lookups
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email_active
    ON users(email, active)
    WHERE active = true;

-- Vendor performance aggregation
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_clients_exit_metrics
    ON clients(assigned_vendor_id, exit_date, exit_income_monthly)
    WHERE exit_date IS NOT NULL;

ANALYZE;  -- Update statistics for query planner

SELECT 'GCP Cloud SQL indexes created successfully!' as status;
