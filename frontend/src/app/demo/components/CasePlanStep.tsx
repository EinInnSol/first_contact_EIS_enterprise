"use client";

import React, { useState } from 'react';
import { Sparkles, Clock, Check, FileText, User } from 'lucide-react';
import { aiCasePlan } from '../data/demoData';

interface CasePlanStepProps {
    onNext: () => void;
    onInteraction: () => void;
    interactionsCompleted: number;
    requiredInteractions: number;
}

export default function CasePlanStep({ onNext, onInteraction, interactionsCompleted, requiredInteractions }: CasePlanStepProps) {
    const [stage, setStage] = useState<'select' | 'generating' | 'review'>('select');
    const [progress, setProgress] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = () => {
        setIsGenerating(true);
        onInteraction(); // Track generation
        setProgress(0);

        // Simulate AI generation with progress
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setStage('review'), 500);
                    return 100;
                }
                return prev + 2;
            });
        }, 50);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
                <h1 className="text-4xl font-black tracking-tighter">
                    <span className="text-[var(--primary)]">Layer 2:</span> AI Case Plan Generator
                </h1>
                <p className="text-lg text-[var(--text-muted)]">
                    90-day housing plans in 60 seconds instead of 2-4 hours
                </p>
            </div>

            {stage === 'select' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
                    {/* Client Selection */}
                    <div className="space-y-6">
                        <div className="nexus-card-outlined bg-[var(--surface)] p-6 space-y-4">
                            <h3 className="text-xl font-black flex items-center gap-2">
                                <User size={24} className="text-[var(--primary)]" />
                                Select Client
                            </h3>

                            <div className="bg-[var(--background)] border-2 border-[var(--primary)] rounded-xl p-4 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-lg">Robert Thompson</h4>
                                        <p className="text-sm text-[var(--text-muted)]">Age 42, Male</p>
                                    </div>
                                    <div className="px-3 py-1 bg-orange-500/10 text-orange-500 rounded-full text-xs font-bold">
                                        VI-SPDAT: 8
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <span className="text-[var(--text-muted)]">Vendor:</span>
                                        <span className="font-bold ml-2">PATH</span>
                                    </div>
                                    <div>
                                        <span className="text-[var(--text-muted)]">Intake:</span>
                                        <span className="font-bold ml-2">Dec 15</span>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-[var(--border-crisp)]">
                                    <p className="text-xs text-[var(--text-muted)] mb-2">Primary Barriers:</p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-2 py-1 bg-[var(--surface-hover)] rounded-md text-xs">Chronic homelessness</span>
                                        <span className="px-2 py-1 bg-[var(--surface-hover)] rounded-md text-xs">Mental health</span>
                                        <span className="px-2 py-1 bg-[var(--surface-hover)] rounded-md text-xs">No income</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleGenerate}
                            className="w-full nexus-button nexus-button-primary py-4 flex items-center justify-center gap-2 shadow-xl shadow-[var(--primary)]/20"
                        >
                            <Sparkles size={20} />
                            Generate AI Case Plan
                        </button>
                    </div>

                    {/* The Old Way */}
                    <div className="nexus-card-outlined bg-[var(--surface)] p-6 space-y-4">
                        <h3 className="text-xl font-black text-red-500">The Old Way</h3>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Clock size={20} className="text-red-500 mt-1 flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold mb-1">2-4 Hours Per Client</h4>
                                    <p className="text-sm text-[var(--text-muted)]">
                                        Caseworkers manually research programs, write plans, coordinate services
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <FileText size={20} className="text-red-500 mt-1 flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold mb-1">Inconsistent Quality</h4>
                                    <p className="text-sm text-[var(--text-muted)]">
                                        Plans vary wildly based on caseworker experience and workload
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <User size={20} className="text-red-500 mt-1 flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold mb-1">Burnout</h4>
                                    <p className="text-sm text-[var(--text-muted)]">
                                        High turnover from administrative burden instead of client care
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-[var(--border-crisp)]">
                            <h4 className="font-black mb-2 text-[var(--primary)]">The New Way</h4>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-start gap-2">
                                    <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                    <span><strong>60 seconds</strong> - AI generates comprehensive plan</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                    <span><strong>Consistent quality</strong> - best practices every time</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                    <span><strong>Human approval</strong> - caseworker reviews and approves</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {stage === 'generating' && (
                <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
                    <div className="nexus-card-outlined bg-[var(--surface)] p-8 space-y-6">
                        <div className="text-center space-y-3">
                            <div className="w-16 h-16 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mx-auto">
                                <Sparkles size={32} className="text-[var(--primary)] animate-pulse" />
                            </div>
                            <h3 className="text-2xl font-black">AI Generating Plan...</h3>
                            <p className="text-[var(--text-muted)]">
                                Analyzing client profile, researching programs, creating personalized roadmap
                            </p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-bold">
                                <span>Progress</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full h-3 bg-[var(--background)] rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-[var(--primary)] to-purple-500 transition-all duration-300 ease-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className={`flex items-center gap-2 ${progress > 20 ? 'text-[var(--success)]' : 'text-[var(--text-muted)]'}`}>
                                {progress > 20 ? <Check size={16} /> : <div className="w-4 h-4 border-2 border-current rounded-full" />}
                                <span>Analyzing client barriers</span>
                            </div>
                            <div className={`flex items-center gap-2 ${progress > 40 ? 'text-[var(--success)]' : 'text-[var(--text-muted)]'}`}>
                                {progress > 40 ? <Check size={16} /> : <div className="w-4 h-4 border-2 border-current rounded-full" />}
                                <span>Researching benefit programs</span>
                            </div>
                            <div className={`flex items-center gap-2 ${progress > 60 ? 'text-[var(--success)]' : 'text-[var(--text-muted)]'}`}>
                                {progress > 60 ? <Check size={16} /> : <div className="w-4 h-4 border-2 border-current rounded-full" />}
                                <span>Creating 90-day timeline</span>
                            </div>
                            <div className={`flex items-center gap-2 ${progress > 80 ? 'text-[var(--success)]' : 'text-[var(--text-muted)]'}`}>
                                {progress > 80 ? <Check size={16} /> : <div className="w-4 h-4 border-2 border-current rounded-full" />}
                                <span>Optimizing service coordination</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {stage === 'review' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-[var(--success)]/10 flex items-center justify-center">
                                <Check className="text-[var(--success)]" size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black">Plan Generated in 12 seconds</h3>
                                <p className="text-sm text-[var(--text-muted)]">Ready for caseworker review</p>
                            </div>
                        </div>
                    </div>

                    <div className="nexus-card-outlined bg-[var(--surface)] p-6 max-h-[500px] overflow-y-auto">
                        <div className="prose prose-invert max-w-none">
                            <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                {aiCasePlan}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button className="flex-1 nexus-button bg-[var(--surface-hover)] border border-[var(--border-crisp)] py-3">
                            Request Changes
                        </button>
                        <button
                            onClick={onNext}
                            className="flex-1 nexus-button nexus-button-primary py-3 flex items-center justify-center gap-2"
                        >
                            <Check size={20} />
                            Approve Plan & Continue
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
