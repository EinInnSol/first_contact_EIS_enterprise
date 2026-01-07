"use client";

import { BarChart3, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

const vendors = [
    { name: "PATH", score: 94, housingRate: 73, cost: 21000, retention: 82, trend: 5, color: "text-green-500" },
    { name: "HOPICS", score: 87, housingRate: 68, cost: 24500, retention: 76, trend: 2, color: "text-blue-500" },
    { name: "LAMP", score: 72, housingRate: 54, cost: 32000, retention: 61, trend: -1, color: "text-orange-500" },
    { name: "MHALA", score: 34, housingRate: 24, cost: 78000, retention: 45, trend: -8, color: "text-red-500" },
];

export default function VendorAnalyticsPage() {
    return (
        <div className="min-h-screen bg-[var(--background)] p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-black mb-2">Vendor Performance Analytics</h1>
                    <p className="text-[var(--text-muted)]">Comprehensive vendor comparison and performance metrics</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {vendors.map((vendor) => (
                        <div key={vendor.name} className="nexus-card bg-[var(--surface)] p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-black text-xl">{vendor.name}</h3>
                                <span className={`text-2xl font-black ${vendor.color}`}>{vendor.score}</span>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <div className="text-xs text-[var(--text-muted)] mb-1">Housing Rate</div>
                                    <div className="font-bold">{vendor.housingRate}%</div>
                                </div>

                                <div>
                                    <div className="text-xs text-[var(--text-muted)] mb-1">Cost/Outcome</div>
                                    <div className="font-bold">${(vendor.cost / 1000).toFixed(0)}K</div>
                                </div>

                                <div>
                                    <div className="text-xs text-[var(--text-muted)] mb-1">Retention (6mo)</div>
                                    <div className="font-bold">{vendor.retention}%</div>
                                </div>

                                <div>
                                    <div className="text-xs text-[var(--text-muted)] mb-1">Trend</div>
                                    <div className={`font-bold flex items-center gap-1 ${vendor.trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {vendor.trend > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                        {vendor.trend > 0 ? '+' : ''}{vendor.trend}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="nexus-card bg-[var(--surface)] p-6 mb-6">
                    <h2 className="text-xl font-black mb-4">Key Insights</h2>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                            <TrendingUp className="text-green-500 mt-1" size={20} />
                            <div>
                                <div className="font-bold mb-1">PATH Leading Performance</div>
                                <div className="text-sm text-[var(--text-muted)]">73% housing rate at $21K cost-per-outcome. Best-in-class retention at 82%.</div>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                            <AlertTriangle className="text-red-500 mt-1" size={20} />
                            <div>
                                <div className="font-bold mb-1">MHALA Underperforming</div>
                                <div className="text-sm text-[var(--text-muted)]">24% housing rate at $78K cost-per-outcome. Declining trend (-8%) requires intervention.</div>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                            <BarChart3 className="text-blue-500 mt-1" size={20} />
                            <div>
                                <div className="font-bold mb-1">Reallocation Opportunity</div>
                                <div className="text-sm text-[var(--text-muted)]">Shifting 30% of MHALA's contract to PATH could yield 47 additional placements annually.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
