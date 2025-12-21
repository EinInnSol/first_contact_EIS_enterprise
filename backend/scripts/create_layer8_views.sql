-- LAYER 8 PERFORMANCE ANALYTICS
-- These views are HIDDEN from vendors and accessible only to City Admins.

-- 1. Vendor Performance Summary (Materialized for High Performance)
CREATE MATERIALIZED VIEW vendor_performance_stats AS
SELECT 
    v.id AS vendor_id,
    v.name AS vendor_name,
    v.organization_id,
    COUNT(c.id) AS total_clients_served,
    COUNT(CASE WHEN c.status = 'housed' THEN 1 END) AS total_housed,
    ROUND(COUNT(CASE WHEN c.status = 'housed' THEN 1 END)::NUMERIC / NULLIF(COUNT(c.id), 0), 4) AS housing_rate,
    AVG(CASE WHEN c.status = 'housed' THEN EXTRACT(DAY FROM (c.updated_at - c.intake_date)) END) AS avg_days_to_housing,
    -- Simulated cost calculation (In real app, join with transactions/contract data)
    SUM(CASE WHEN c.status = 'housed' THEN 1 ELSE 0 END) * 15000 AS estimated_total_outcome_cost
FROM 
    vendors v
LEFT JOIN 
    clients c ON v.id = c.assigned_vendor_id
GROUP BY 
    v.id, v.name, v.organization_id;

-- Index for fast lookup by admin
CREATE INDEX idx_vendor_perf_org ON vendor_performance_stats(organization_id);

-- 2. Daily Scan Conversion (Layer 8 Marketing/Outreach Efficiency)
CREATE VIEW qr_conversion_stats AS
SELECT 
    ql.id AS location_id,
    ql.name AS location_name,
    ql.vendor_id,
    COUNT(qse.id) AS total_scans,
    COUNT(CASE WHEN qse.resulted_in_intake = TRUE THEN 1 END) AS successful_intakes,
    ROUND(COUNT(CASE WHEN qse.resulted_in_intake = TRUE THEN 1 END)::NUMERIC / NULLIF(COUNT(qse.id), 0), 4) AS conversion_rate
FROM 
    qr_locations ql
LEFT JOIN 
    qr_scan_events qse ON ql.id = qse.qr_location_id
GROUP BY 
    ql.id, ql.name, ql.vendor_id;

-- 3. Procedure to refresh materialized views (Scheduled Task)
CREATE OR REPLACE PROCEDURE refresh_layer8_analytics()
LANGUAGE plpgsql
AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY vendor_performance_stats;
    -- Log the refresh
    INSERT INTO system_logs (event, message, created_at) 
    VALUES ('analytics_refresh', 'Successfully refreshed vendor_performance_stats', NOW());
END;
$$;
