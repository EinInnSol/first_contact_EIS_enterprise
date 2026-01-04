"use client";

import React, { useState } from 'react';
import { DollarSign, TrendingUp, Check, Calculator } from 'lucide-react';
import { benefitPrograms } from '../data/demoData';

interface BenefitStackStepProps {
    onNext: () => void;
    onInteraction: () => void;
    interactionsCompleted: number;
    requiredInteractions: number;
}

export default function BenefitStackStep({ onNext, onInteraction }: BenefitStackStepProps) {
    const [calculating, setCalculating] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const handleCalculate = () => {
        setCalculating(true);
        onInteraction(); // Track calculation
        setTimeout(() => {
            setCalculating(false);
            setShowResults(true);
        }, 2000);
    };

    const totalMonthly = benefitPrograms
        .filter(b => b.eligible && b.monthlyAmount > 0)
        .reduce((sum, b) => sum + b.monthlyAmount, 0);

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
                <h1 className="text-4xl font-black tracking-tighter">
                    <span className="text-[var(--primary)]">Layer 3:</span> Benefit Stack Optimizer
                </h1>
                <p className="text-lg text-[var(--text-muted)]">
                    AI calculates optimal benefit combinations and projected income
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Client Info & Calculate */}
                <div className="space-y-6">
                    <div className="nexus-card-outlined bg-[var(--surface)] p-6 space-y-4">
                        <h3 className="text-xl font-black">Client Profile</h3>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-[var(--text-muted)]">Name:</span>
                                <span className="font-bold">Robert Thompson</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[var(--text-muted)]">Age:</span>
                                <span className="font-bold">42</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[var(--text-muted)]">Current Income:</span>
                                <span className="font-bold text-red-500">$0/month</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[var(--text-muted)]">Disability:</span>
                                <span className="font-bold">Yes (Mental Health)</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[var(--text-muted)]">Housing Status:</span>
                                <span className="font-bold">Homeless</span>
                            </div>
                        </div>
                    </div>

                    {!showResults && (
                        <button
                            onClick={handleCalculate}
                            disabled={calculating}
                            className="w-full nexus-button nexus-button-primary py-4 flex items-center justify-center gap-2 shadow-xl shadow-[var(--primary)]/20 disabled:opacity-50"
                        >
                            {calculating ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Calculating Optimal Stack...
                                </>
                            ) : (
                                <>
                                    <Calculator size={20} />
                                    Calculate Benefit Stack
                                </>
                            )}
                        </button>
                    )}

                    <div className="nexus-card-outlined bg-[var(--surface)] p-6 space-y-4">
                        <h3 className="text-xl font-black">How It Works</h3>

                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-2">
                                <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                <span>AI analyzes client eligibility for all programs</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                <span>Optimizes benefit combinations (some programs conflict)</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                <span>Projects monthly income with all benefits</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                <span>Tracks application status and deadlines</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Results */}
                <div className="space-y-6">
                    {showResults ? (
                        <div className="space-y-6 animate-in fade-in duration-500">
                            {/* Total Income */}
                            <div className="nexus-card-outlined bg-gradient-to-br from-[var(--primary)]/10 to-purple-500/10 border-[var(--primary)] p-8 text-center space-y-2">
                                <div className="text-sm font-bold uppercase tracking-widest text-[var(--text-muted)]">
                                    Projected Monthly Income
                                </div>
                                <div className="text-5xl font-black text-[var(--primary)]">
                                    ${totalMonthly.toLocaleString()}
                                </div>
                                <div className="flex items-center justify-center gap-2 text-[var(--success)]">
                                    <TrendingUp size={20} />
                                    <span className="font-bold">From $0 to ${totalMonthly}/mo</span>
                                </div>
                            </div>

                            {/* Benefit Programs */}
                            <div className="nexus-card-outlined bg-[var(--surface)] p-6 space-y-4">
                                <h3 className="text-xl font-black">Recommended Benefits</h3>

                                <div className="space-y-3">
                                    {benefitPrograms.map((benefit) => (
                                        <div
                                            key={benefit.id}
                                            className={`p-4 rounded-xl border-2 ${benefit.eligible
                                                ? 'bg-[var(--success)]/5 border-[var(--success)]/20'
                                                : 'bg-[var(--surface-hover)] border-[var(--border-crisp)] opacity-50'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex-1">
                                                    <h4 className="font-bold">{benefit.name}</h4>
                                                    <p className="text-xs text-[var(--text-muted)] mt-1">
                                                        {benefit.description}
                                                    </p>
                                                </div>
                                                {benefit.monthlyAmount > 0 && (
                                                    <div className="text-right">
                                                        <div className="font-black text-lg text-[var(--primary)]">
                                                            ${benefit.monthlyAmount}
                                                        </div>
                                                        <div className="text-xs text-[var(--text-muted)]">
                                                            /month
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-[var(--text-muted)]">
                                                    Processing: {benefit.processingTime}
                                                </span>
                                                {benefit.eligible && (
                                                    <span className="px-2 py-1 bg-[var(--success)]/10 text-[var(--success)] rounded-full font-bold">
                                                        ✓ Eligible
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-[var(--primary)]/5 border border-[var(--primary)]/20 rounded-xl p-6">
                                <h4 className="font-black mb-3 text-[var(--primary)]">The Impact</h4>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-start gap-2">
                                        <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                        <span>Income enables housing qualification</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                        <span>Reduces time to housing by 40%</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                        <span>Caseworker saves 90 minutes per client</span>
                                    </li>
                                </ul>
                            </div>

                            <button
                                onClick={onNext}
                                className="w-full nexus-button nexus-button-primary py-4"
                            >
                                Next: The Trojan Horse Reveal →
                            </button>
                        </div>
                    ) : (
                        <div className="nexus-card-outlined bg-[var(--surface)] p-8 text-center space-y-4">
                            <DollarSign size={64} className="text-[var(--text-muted)] mx-auto opacity-20" />
                            <p className="text-[var(--text-muted)]">
                                Click "Calculate Benefit Stack" to see AI optimization in action
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
