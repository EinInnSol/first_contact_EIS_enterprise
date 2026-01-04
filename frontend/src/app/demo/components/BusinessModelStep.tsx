"use client";

import React from 'react';
import { Rocket, DollarSign, Users, TrendingUp, Check, ArrowRight } from 'lucide-react';

interface BusinessModelStepProps {
    onRestart: () => void;
}

export default function BusinessModelStep({ onRestart }: BusinessModelStepProps) {
    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
                <h1 className="text-4xl font-black tracking-tighter">
                    The <span className="text-[var(--primary)]">Trojan Horse</span> Business Model
                </h1>
                <p className="text-lg text-[var(--text-muted)]">
                    How we change 400+ cities and build a $115M+ ARR business
                </p>
            </div>

            {/* The Strategy */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="nexus-card-outlined bg-[var(--surface)] p-6 space-y-4">
                    <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
                        <span className="text-2xl">🎁</span>
                    </div>
                    <h3 className="text-xl font-black">Phase 1: SEED</h3>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                            <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                            <span>Give vendors <strong>free</strong> AI tools</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                            <span>They adopt for efficiency gains</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                            <span>Layer 8 data accumulates silently</span>
                        </li>
                    </ul>
                    <div className="pt-3 border-t border-[var(--border-crisp)] text-sm text-[var(--text-muted)]">
                        <strong>Cost:</strong> $0 revenue, building proof
                    </div>
                </div>

                <div className="nexus-card-outlined bg-[var(--surface)] p-6 space-y-4">
                    <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
                        <span className="text-2xl">👁️</span>
                    </div>
                    <h3 className="text-xl font-black">Phase 2: REVEAL</h3>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                            <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                            <span>Show cities Layer 8 dashboard</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                            <span>Cities see vendor performance data</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                            <span>"We've been overpaying for years!"</span>
                        </li>
                    </ul>
                    <div className="pt-3 border-t border-[var(--border-crisp)] text-sm text-[var(--text-muted)]">
                        <strong>Result:</strong> Cities demand this data
                    </div>
                </div>

                <div className="nexus-card-outlined bg-gradient-to-br from-[var(--primary)]/10 to-purple-500/10 border-[var(--primary)] p-6 space-y-4">
                    <div className="w-12 h-12 rounded-full bg-[var(--primary)]/20 flex items-center justify-center">
                        <span className="text-2xl">💰</span>
                    </div>
                    <h3 className="text-xl font-black text-[var(--primary)]">Phase 3: MANDATE</h3>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                            <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                            <span>Cities write into contracts</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                            <span>Vendors can't refuse (contractual)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                            <span>Platform becomes infrastructure</span>
                        </li>
                    </ul>
                    <div className="pt-3 border-t border-[var(--primary)]/20 text-sm font-bold text-[var(--primary)]">
                        Revenue: $1,200/vendor/month
                    </div>
                </div>
            </div>

            {/* Market Size */}
            <div className="nexus-card-outlined bg-[var(--surface)] p-8 space-y-6">
                <h2 className="text-3xl font-black text-center">The Market Opportunity</h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center p-6 bg-[var(--background)] rounded-xl">
                        <div className="text-4xl font-black text-[var(--primary)] mb-2">400+</div>
                        <div className="text-sm text-[var(--text-muted)]">Continuums of Care</div>
                    </div>
                    <div className="text-center p-6 bg-[var(--background)] rounded-xl">
                        <div className="text-4xl font-black text-[var(--primary)] mb-2">20</div>
                        <div className="text-sm text-[var(--text-muted)]">Avg Vendors per CoC</div>
                    </div>
                    <div className="text-center p-6 bg-[var(--background)] rounded-xl">
                        <div className="text-4xl font-black text-[var(--primary)] mb-2">8,000+</div>
                        <div className="text-sm text-[var(--text-muted)]">Total Vendors</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-[var(--primary)]/10 to-purple-500/10 rounded-xl border border-[var(--primary)]">
                        <div className="text-4xl font-black text-[var(--primary)] mb-2">$115M+</div>
                        <div className="text-sm font-bold">ARR at Scale</div>
                    </div>
                </div>

                <div className="text-center pt-4">
                    <p className="text-lg font-bold mb-2">Revenue Calculation:</p>
                    <p className="text-[var(--text-muted)]">
                        8,000 vendors × $1,200/month = <span className="text-[var(--primary)] font-black">$9.6M/month</span> = <span className="text-[var(--primary)] font-black">$115.2M/year</span>
                    </p>
                </div>
            </div>

            {/* The Impact */}
            <div className="nexus-card-outlined bg-[var(--surface)] p-8 space-y-6">
                <h2 className="text-3xl font-black text-center">The Impact</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <h3 className="font-black text-lg flex items-center gap-2">
                            <Users className="text-[var(--primary)]" size={24} />
                            For People Experiencing Homelessness
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                <span>Faster housing placements (AI optimization)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                <span>Better outcomes (data-driven decisions)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                <span>Coordinated services (no more falling through cracks)</span>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-black text-lg flex items-center gap-2">
                            <DollarSign className="text-[var(--primary)]" size={24} />
                            For Cities & Taxpayers
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                <span>Real-time accountability (no more annual reviews)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                <span>Data-driven budget allocation</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                <span>Projected $2B+ in waste reduction</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="nexus-card-outlined bg-gradient-to-br from-[var(--primary)]/10 to-purple-500/10 border-[var(--primary)] p-12 text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-[var(--primary)]/20 flex items-center justify-center mx-auto">
                    <Rocket className="text-[var(--primary)]" size={40} />
                </div>

                <div className="space-y-3">
                    <h2 className="text-4xl font-black">Ready to Change the System?</h2>
                    <p className="text-xl text-[var(--text-muted)] max-w-2xl mx-auto">
                        First Contact E.I.S. brings accountability to $7 billion in homeless services funding.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <button
                        onClick={onRestart}
                        className="nexus-button bg-[var(--surface-hover)] border border-[var(--border-crisp)] px-8 py-4 text-lg"
                    >
                        Restart Demo
                    </button>
                    <a
                        href="mailto:contact@firstcontacteis.com"
                        className="nexus-button nexus-button-primary px-8 py-4 text-lg flex items-center justify-center gap-2 shadow-xl shadow-[var(--primary)]/20"
                    >
                        Schedule a Pilot
                        <ArrowRight size={20} />
                    </a>
                </div>

                <p className="text-sm text-[var(--text-muted)] pt-4">
                    Pilot with Long Beach CoC • Prove 20%+ improvement • Scale nationwide
                </p>
            </div>
        </div>
    );
}
