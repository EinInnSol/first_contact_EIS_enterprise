"use client";

import React from 'react';
import { AlertTriangle, DollarSign, TrendingDown, Users } from 'lucide-react';

interface IntroStepProps {
    onNext: () => void;
}

export default function IntroStep({ onNext }: IntroStepProps) {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
            {/* Hero */}
            <div className="text-center space-y-4">
                <h1 className="text-5xl font-black tracking-tighter">
                    The <span className="text-[var(--primary)]">$7 Billion</span> Problem
                </h1>
                <p className="text-xl text-[var(--text-muted)] max-w-2xl mx-auto">
                    America spends billions on homeless services. Yet outcomes remain abysmal. Here's why.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="nexus-card-outlined bg-[var(--surface)] p-6 space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                            <DollarSign className="text-red-500" size={24} />
                        </div>
                        <div>
                            <div className="text-3xl font-black">$760,563</div>
                            <div className="text-sm text-[var(--text-muted)] font-bold uppercase tracking-wider">
                                Cost Per Person Housed
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-[var(--text-muted)]">
                        Long Beach, CA spent <strong>$54M</strong> to house <strong>71 people</strong> in 2024.
                    </p>
                </div>

                <div className="nexus-card-outlined bg-[var(--surface)] p-6 space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                            <AlertTriangle className="text-orange-500" size={24} />
                        </div>
                        <div>
                            <div className="text-3xl font-black">400+</div>
                            <div className="text-sm text-[var(--text-muted)] font-bold uppercase tracking-wider">
                                Continuums of Care
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-[var(--text-muted)]">
                        Each CoC manages <strong>$17.5M+</strong> in annual funding with <strong>zero accountability</strong>.
                    </p>
                </div>

                <div className="nexus-card-outlined bg-[var(--surface)] p-6 space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                            <Users className="text-purple-500" size={24} />
                        </div>
                        <div>
                            <div className="text-3xl font-black">2M+</div>
                            <div className="text-sm text-[var(--text-muted)] font-bold uppercase tracking-wider">
                                People Experiencing Homelessness
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-[var(--text-muted)]">
                        Nationwide crisis with <strong>no standardized measurement</strong> of vendor performance.
                    </p>
                </div>

                <div className="nexus-card-outlined bg-[var(--surface)] p-6 space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                            <TrendingDown className="text-red-500" size={24} />
                        </div>
                        <div>
                            <div className="text-3xl font-black">0%</div>
                            <div className="text-sm text-[var(--text-muted)] font-bold uppercase tracking-wider">
                                Real-Time Visibility
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-[var(--text-muted)]">
                        Cities have <strong>no idea</strong> which vendors deliver results until annual reviews.
                    </p>
                </div>
            </div>

            {/* The Problem */}
            <div className="nexus-card-outlined bg-[var(--surface)] p-8 space-y-6">
                <h2 className="text-2xl font-black">Why Does This Happen?</h2>

                <div className="space-y-4">
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-red-500 font-black">1</span>
                        </div>
                        <div>
                            <h3 className="font-bold mb-1">No Visibility</h3>
                            <p className="text-sm text-[var(--text-muted)]">
                                Cities can't see vendor performance in real-time. They rely on self-reported metrics.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-red-500 font-black">2</span>
                        </div>
                        <div>
                            <h3 className="font-bold mb-1">No Standardization</h3>
                            <p className="text-sm text-[var(--text-muted)]">
                                Every vendor uses different systems. Impossible to compare Vendor A vs Vendor B.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-red-500 font-black">3</span>
                        </div>
                        <div>
                            <h3 className="font-bold mb-1">No Accountability</h3>
                            <p className="text-sm text-[var(--text-muted)]">
                                Money flows regardless of outcomes. Contracts renewed based on relationships, not results.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="text-center space-y-4">
                <p className="text-lg font-bold text-[var(--text-muted)]">
                    First Contact E.I.S. changes everything.
                </p>
                <button
                    onClick={onNext}
                    className="nexus-button nexus-button-primary px-8 py-4 text-lg shadow-xl shadow-[var(--primary)]/20"
                >
                    See How It Works →
                </button>
            </div>
        </div>
    );
}
