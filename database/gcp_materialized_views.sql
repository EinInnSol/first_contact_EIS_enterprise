-- Materialized View for Vendor Performance (Layer 8)
-- GCP Cloud SQL optimized with CONCURRENTLY option

CREATE MATERIALIZED VIEW IF NOT EXISTS vendor_performance_mv AS
SELECT
    v.id as vendor_id,
    v.organization_id,
    v.name as vendor_name,
    v.slug as vendor_slug,

    -- Client counts
    COUNT(c.id) as total_clients,
    COUNT(CASE WHEN c.status = 'housed' THEN 1 END) as housed_count,
    COUNT(CASE WHEN c.status IN ('exited_positive', 'housed') THEN 1 END) as positive_outcomes,
    COUNT(CASE WHEN c.status = 'exited_negative' THEN 1 END) as negative_outcomes,
    COUNT(CASE WHEN c.status = 'disengaged' THEN 1 END) as disengaged_count,

    -- Performance metrics
    AVG(CASE
        WHEN c.housed_date IS NOT NULL AND c.intake_date IS NOT NULL
        THEN EXTRACT(day FROM c.housed_date - c.intake_date)
    END) as avg_days_to_housing,

    AVG(c.exit_income_monthly) as avg_exit_income,

    -- Rates (calculated as floats for faster queries)
    CASE
        WHEN COUNT(c.id) > 0
        THEN COUNT(CASE WHEN c.status = 'housed' THEN 1 END)::float / COUNT(c.id)::float
        ELSE 0
    END as housing_rate,

    -- Timestamp for cache invalidation
    NOW() as calculated_at,
    MAX(c.updated_at) as last_client_update

FROM vendors v
LEFT JOIN clients c ON c.assigned_vendor_id = v.id
WHERE v.active = true
GROUP BY v.id, v.organization_id, v.name, v.slug;

-- Unique index required for CONCURRENTLY refresh
CREATE UNIQUE INDEX IF NOT EXISTS idx_vendor_perf_mv_vendor_id
    ON vendor_performance_mv(vendor_id);

CREATE INDEX IF NOT EXISTS idx_vendor_perf_mv_org
    ON vendor_performance_mv(organization_id);

-- Initial population
REFRESH MATERIALIZED VIEW CONCURRENTLY vendor_performance_mv;

SELECT 'Materialized view created and populated!' as status;
