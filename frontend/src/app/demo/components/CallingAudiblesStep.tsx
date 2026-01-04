"use client";

import React, { useState } from 'react';
import { Sparkles, Check, AlertTriangle, Calendar, MapPin } from 'lucide-react';
import { aiRecommendations } from '../data/demoData';

interface CallingAudiblesStepProps {
    onNext: () => void;
    onInteraction: () => void;
    interactionsCompleted: number;
    requiredInteractions: number;
}

export default function CallingAudiblesStep({ onNext, onInteraction, interactionsCompleted, requiredInteractions }: CallingAudiblesStepProps) {
    const [reviewedRecommendations, setReviewedRecommendations] = useState<Set<number>>(new Set());
    const [selectedRecommendation, setSelectedRecommendation] = useState<number | null>(null);

    const handleReviewRecommendation = (id: number) => {
        setSelectedRecommendation(id);
        if (!reviewedRecommendations.has(id)) {
            setReviewedRecommendations(new Set([...reviewedRecommendations, id]));
            onInteraction();
        }
    };

    const canContinue = interactionsCompleted >= requiredInteractions;

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-red-500 bg-red-500/10 border-red-500/20';
            case 'medium': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
            case 'low': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'appointment': return <Calendar size={20} />;
            case 'resource': return <MapPin size={20} />;
            case 'intervention': return <AlertTriangle size={20} />;
            default: return <Sparkles size={20} />;
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
                <h1 className="text-4xl font-black tracking-tighter">
                    <span className="text-[var(--primary)]">Step 5:</span> Calling Audibles - AI Recommendations
                </h1>
                <p className="text-lg text-[var(--text-muted)]">
                    Real-time AI suggestions to optimize client outcomes
                </p>
            </div>

            {/* Instructions */}
            <div className="nexus-card-outlined bg-gradient-to-br from-[var(--primary)]/10 to-purple-500/10 border-[var(--primary)] p-6">
                <h3 className="font-black mb-3 flex items-center gap-2">
                    <Sparkles className="text-[var(--primary)]" size={24} />
                    Required Interaction
                </h3>
                <p className="text-sm mb-4">
                    Review <strong>{requiredInteractions} AI recommendations</strong> by clicking on each card to see details and potential impact.
                </p>
                <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-[var(--background)] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[var(--primary)] transition-all duration-300"
                            style={{ width: `${(interactionsCompleted / requiredInteractions) * 100}%` }}
                        />
                    </div>
                    <span className="text-sm font-bold">
                        {interactionsCompleted}/{requiredInteractions}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recommendations List */}
                <div className="space-y-4">
                    <h3 className="text-xl font-black">Active Recommendations</h3>

                    {aiRecommendations.map((rec) => {
                        const isReviewed = reviewedRecommendations.has(rec.id);
                        const isSelected = selectedRecommendation === rec.id;

                        return (
                            <button
                                key={rec.id}
                                onClick={() => handleReviewRecommendation(rec.id)}
                                className={`w-full text-left nexus-card-outlined p-5 transition-all ${isSelected ? 'border-[var(--primary)] bg-[var(--primary)]/5' :
                                        isReviewed ? 'border-[var(--success)] bg-[var(--success)]/5' :
                                            'hover:border-[var(--primary)]'
                                    } bg-[var(--surface)]`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="text-[var(--primary)]">
                                            {getTypeIcon(rec.type)}
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getPriorityColor(rec.priority)}`}>
                                            {rec.priority.toUpperCase()}
                                        </span>
                                    </div>
                                    {isReviewed && (
                                        <Check size={20} className="text-[var(--success)]" />
                                    )}
                                </div>

                                <h4 className="font-bold mb-2">{rec.title}</h4>
                                <p className="text-sm text-[var(--text-muted)] line-clamp-2">
                                    {rec.description}
                                </p>
                            </button>
                        );
                    })}
                </div>

                {/* Selected Recommendation Details */}
                <div className="space-y-6">
                    {selectedRecommendation !== null ? (
                        <>
                            {(() => {
                                const rec = aiRecommendations.find(r => r.id === selectedRecommendation)!;
                                return (
                                    <div className="nexus-card-outlined bg-[var(--surface)] p-6 space-y-6 animate-in fade-in duration-300">
                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="text-[var(--primary)]">
                                                    {getTypeIcon(rec.type)}
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getPriorityColor(rec.priority)}`}>
                                                    {rec.priority.toUpperCase()} PRIORITY
                                                </span>
                                            </div>
                                            <h3 className="text-2xl font-black mb-2">{rec.title}</h3>
                                            <p className="text-[var(--text-muted)]">{rec.description}</p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="p-4 bg-[var(--background)] rounded-xl">
                                                <h4 className="font-bold mb-2 text-sm uppercase tracking-wider text-[var(--text-muted)]">
                                                    Expected Impact
                                                </h4>
                                                <p className="text-sm">{rec.impact}</p>
                                            </div>

                                            <div className="p-4 bg-[var(--primary)]/5 border border-[var(--primary)]/20 rounded-xl">
                                                <h4 className="font-bold mb-2 text-sm uppercase tracking-wider text-[var(--primary)]">
                                                    Recommended Action
                                                </h4>
                                                <p className="text-sm font-bold">{rec.action}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <button className="flex-1 nexus-button nexus-button-primary py-3">
                                                Approve & Execute
                                            </button>
                                            <button className="flex-1 nexus-button bg-[var(--surface-hover)] border border-[var(--border-crisp)] py-3">
                                                Dismiss
                                            </button>
                                        </div>
                                    </div>
                                );
                            })()}
                        </>
                    ) : (
                        <div className="nexus-card-outlined bg-[var(--surface)] p-12 text-center">
                            <Sparkles size={64} className="text-[var(--text-muted)] mx-auto mb-4 opacity-20" />
                            <p className="text-[var(--text-muted)]">
                                Click on a recommendation to see details
                            </p>
                        </div>
                    )}

                    {/* What This Shows */}
                    <div className="nexus-card-outlined bg-[var(--surface)] p-6 space-y-4">
                        <h3 className="text-xl font-black">How "Calling Audibles" Works</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                <span><strong>Real-time analysis</strong> - AI monitors client progress continuously</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                <span><strong>Proactive suggestions</strong> - Identifies issues before they become problems</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                <span><strong>Human approval</strong> - Caseworker reviews and approves all actions</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                <span><strong>Impact prediction</strong> - Shows expected outcomes of each action</span>
                            </li>
                        </ul>
                    </div>

                    {/* Continue Button */}
                    <button
                        onClick={onNext}
                        disabled={!canContinue}
                        className={`w-full nexus-button py-4 ${canContinue
                                ? 'nexus-button-primary'
                                : 'opacity-50 cursor-not-allowed bg-[var(--surface-hover)] border border-[var(--border-crisp)]'
                            }`}
                    >
                        {canContinue
                            ? 'Continue to Benefit Optimizer →'
                            : `Review ${requiredInteractions - interactionsCompleted} more recommendations`
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}
