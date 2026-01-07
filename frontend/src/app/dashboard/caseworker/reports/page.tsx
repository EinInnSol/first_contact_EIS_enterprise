"use client";

import { FileText, Download } from 'lucide-react';

const reports = [
    { id: 1, name: "Annual Performance Report (APR)", type: "HUD Compliance", lastGenerated: "2025-12-01", status: "Current" },
    { id: 2, name: "System Performance Measures (SPM)", type: "HUD Compliance", lastGenerated: "2025-11-15", status: "Current" },
    { id: 3, name: "Longitudinal System Analysis (LSA)", type: "HUD Compliance", lastGenerated: "2025-10-20", status: "Needs Update" },
    { id: 4, name: "Data Quality Report", type: "Internal", lastGenerated: "2026-01-02", status: "Current" },
];

export default function ComplianceReportsPage() {
    return (
        <div className="min-h-screen bg-[var(--background)] p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-black mb-2">Compliance Reports</h1>
                    <p className="text-[var(--text-muted)]">HUD-required reports and data quality metrics</p>
                </div>

                <div className="grid gap-4">
                    {reports.map((report) => (
                        <div key={report.id} className="nexus-card bg-[var(--surface)] p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <FileText className="text-[var(--primary)]" size={32} />
                                    <div>
                                        <h3 className="font-black text-lg mb-1">{report.name}</h3>
                                        <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
                                            <span>{report.type}</span>
                                            <span>Last generated: {report.lastGenerated}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${report.status === 'Current' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'
                                        }`}>
                                        {report.status}
                                    </span>
                                    <button className="nexus-button bg-[var(--surface-hover)] border border-[var(--border-crisp)] px-4 py-2">
                                        <Download size={16} />
                                    </button>
                                    <button className="nexus-button nexus-button-primary px-6">
                                        Generate New
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
