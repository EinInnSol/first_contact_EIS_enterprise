"use client";

import React, { useState } from 'react';
import { Eye, TrendingDown, TrendingUp, MapPin, AlertTriangle } from 'lucide-react';
import { vendorPerformance } from '../data/demoData';

interface Layer8StepProps {
    onNext: () => void;
}

export default function Layer8Step({ onNext }: Layer8StepProps) {
    const [revealed, setRevealed] = useState(false);

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
                <h1 className="text-4xl font-black tracking-tighter">
                    <span className="text-[var(--primary)]">Layer 8:</span> The Trojan Horse
                </h1>
                <p className="text-lg text-[var(--text-muted)]">
                    What vendors see vs. what cities see
                </p>
            </div>

            {!revealed ? (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="nexus-card-outlined bg-[var(--surface)] p-12 text-center space-y-6">
                        <div className="w-20 h-20 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mx-auto">
                            <Eye size={40} className="text-[var(--primary)]" />
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-3xl font-black">Vendors See Layers 1-7</h2>
                            <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
                                They love the efficiency tools: AI case plans, benefit calculators, appointment scheduling, compliance reports.
                            </p>
                            <p className="text-xl font-bold text-[var(--primary)]">
                                They adopt voluntarily because it saves them hours every day.
                            </p>
                        </div>

                        <div className="pt-6 border-t border-[var(--border-crisp)]">
                            <p className="text-2xl font-black mb-4">But they don't know Layer 8 exists...</p>
                            <button
                                onClick={() => setRevealed(true)}
                                className="nexus-button nexus-button-primary px-12 py-4 text-lg shadow-xl shadow-[var(--primary)]/30"
                            >
                                Reveal Layer 8 →
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6 animate-in fade-in zoom-in duration-700">
                    {/* Dramatic Reveal */}
                    <div className="text-center space-y-3 py-8">
                        <h2 className="text-4xl font-black text-[var(--primary)]">
                            Now Let Me Show You What Cities See...
                        </h2>
                        <p className="text-xl text-[var(--text-muted)]">
                            The accountability dashboard vendors can't access
                        </p>
                    </div>

                    {/* Vendor Performance Comparison */}
                    <div className="nexus-card-outlined bg-[var(--surface)] p-6 space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-black">Vendor Performance Comparison</h3>
                            <button className="nexus-button bg-[var(--surface-hover)] border border-[var(--border-crisp)] px-4 py-2 text-sm">
                                Export Report
                            </button>
                        </div>

                        <div className="space-y-4">
                            {vendorPerformance.map((vendor) => {
                                const isTopPerformer = vendor.score >= 85;
                                const isUnderperforming = vendor.score < 50;

                                return (
                                    <div
                                        key={vendor.id}
                                        className={`p-5 rounded-xl border-2 ${isTopPerformer ? 'bg-[var(--success)]/5 border-[var(--success)]/30' :
                                                isUnderperforming ? 'bg-red-500/5 border-red-500/30' :
                                                    'bg-[var(--surface-hover)] border-[var(--border-crisp)]'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-4">
                                                <div>
                                                    <h4 className="text-xl font-black">{vendor.name}</h4>
                                                    <p className="text-sm text-[var(--text-muted)]">{vendor.territory}</p>
                                                </div>
                                                {isTopPerformer && (
                                                    <span className="px-3 py-1 bg-[var(--success)]/10 text-[var(--success)] rounded-full text-xs font-bold">
                                                        ⭐ TOP PERFORMER
                                                    </span>
                                                )}
                                                {isUnderperforming && (
                                                    <span className="px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-xs font-bold flex items-center gap-1">
                                                        <AlertTriangle size={12} />
                                                        UNDERPERFORMING
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <div className="text-3xl font-black text-[var(--primary)]">{vendor.score}</div>
                                                <div className="text-xs text-[var(--text-muted)]">Score</div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-4 gap-4 mb-4">
                                            <div>
                                                <div className="text-xs text-[var(--text-muted)] mb-1">Housing Rate</div>
                                                <div className="text-lg font-black">{(vendor.housingRate * 100).toFixed(0)}%</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-[var(--text-muted)] mb-1">Cost/Outcome</div>
                                                <div className="text-lg font-black">${(vendor.costPerOutcome / 1000).toFixed(0)}K</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-[var(--text-muted)] mb-1">Retention</div>
                                                <div className="text-lg font-black">{(vendor.retention6mo * 100).toFixed(0)}%</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-[var(--text-muted)] mb-1">Trend</div>
                                                <div className={`text-lg font-black flex items-center gap-1 ${vendor.trend > 0 ? 'text-[var(--success)]' : 'text-red-500'
                                                    }`}>
                                                    {vendor.trend > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                                    {vendor.trend > 0 ? '+' : ''}{vendor.trend}%
                                                </div>
                                            </div>
                                        </div>

                                        {/* Performance Bar */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-[var(--text-muted)]">Overall Performance</span>
                                                <span className="font-bold">{vendor.score}/100</span>
                                            </div>
                                            <div className="w-full h-2 bg-[var(--background)] rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${isTopPerformer ? 'bg-[var(--success)]' :
                                                            isUnderperforming ? 'bg-red-500' :
                                                                'bg-orange-500'
                                                        }`}
                                                    style={{ width: `${vendor.score}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* AI Recommendation */}
                    <div className="nexus-card-outlined bg-gradient-to-br from-[var(--primary)]/10 to-purple-500/10 border-[var(--primary)] p-6 space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-[var(--primary)]/20 flex items-center justify-center flex-shrink-0">
                                <span className="text-xl">💡</span>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-black text-lg mb-2 text-[var(--primary)]">AI Strategic Recommendation</h4>
                                <p className="text-sm mb-4">
                                    "Reallocating 30% of MHALA's contract ($2.1M) to PATH would result in approximately <strong>47 additional housing placements</strong> annually at the same total cost."
                                </p>
                                <div className="flex gap-3">
                                    <button className="nexus-button nexus-button-primary px-4 py-2 text-sm">
                                        View Full Analysis
                                    </button>
                                    <button className="nexus-button bg-[var(--surface-hover)] border border-[var(--border-crisp)] px-4 py-2 text-sm">
                                        Schedule Review
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* The Key Insight */}
                    <div className="nexus-card-outlined bg-[var(--surface)] p-8 space-y-4">
                        <h3 className="text-2xl font-black text-center">The Key Insight</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="text-center p-6 bg-[var(--background)] rounded-xl">
                                <h4 className="font-black mb-2">Vendors See:</h4>
                                <p className="text-[var(--text-muted)]">"This software saves me 3 hours per day!"</p>
                            </div>
                            <div className="text-center p-6 bg-[var(--primary)]/5 rounded-xl border border-[var(--primary)]/20">
                                <h4 className="font-black mb-2 text-[var(--primary)]">Cities See:</h4>
                                <p className="text-[var(--text-muted)]">"I know exactly which vendors waste money!"</p>
                            </div>
                        </div>
                        <p className="text-center text-lg font-bold pt-4">
                            By the time cities reveal Layer 8, vendors are already dependent on the tools.
                        </p>
                    </div>

                    <button
                        onClick={onNext}
                        className="w-full nexus-button nexus-button-primary py-4 text-lg"
                    >
                        Next: AI Strategic Advisor →
                    </button>
                </div>
            )}
        </div>
    );
}
