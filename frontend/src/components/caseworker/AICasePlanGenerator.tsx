"use client";

import React, { useState } from 'react';
import {
    Sparkles,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    ChevronDown,
    ChevronUp,
    Edit3,
    Check,
    Loader2
} from 'lucide-react';

interface Action {
    task: string;
    responsible: string;
    estimated_days: number;
    dependencies: string[];
    notes: string;
}

interface Milestone {
    phase: string;
    title: string;
    goals: string[];
    actions: Action[];
}

interface CasePlan {
    summary: string;
    estimated_days_to_housing: number;
    confidence_score: number;
    milestones: Milestone[];
    key_barriers: string[];
    critical_success_factors: string[];
    resources_needed: string[];
    generated_at: string;
    generated_by: string;
    model: string;
    client_id: string;
    case_number: string;
    client_name: string;
}

interface AICasePlanGeneratorProps {
    clientId: string;
    clientName: string;
    onPlanApproved?: (plan: CasePlan) => void;
}

export default function AICasePlanGenerator({ clientId, clientName, onPlanApproved }: AICasePlanGeneratorProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [casePlan, setCasePlan] = useState<CasePlan | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [expandedMilestones, setExpandedMilestones] = useState<Set<number>>(new Set([0]));

    const handleGenerate = async () => {
        setIsGenerating(true);
        setError(null);

        try {
            // Get auth token from localStorage
            const token = localStorage.getItem('token');

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/clients/${clientId}/case-plan/generate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ detail: 'Failed to generate case plan' }));
                throw new Error(errorData.detail || 'Failed to generate case plan');
            }

            const data = await response.json();
            setCasePlan(data);
            setExpandedMilestones(new Set([0])); // Expand first milestone by default
        } catch (err: any) {
            setError(err.message || 'Failed to generate case plan');
            console.error('Case plan generation error:', err);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleRegenerate = () => {
        setCasePlan(null);
        handleGenerate();
    };

    const handleApprove = () => {
        if (casePlan && onPlanApproved) {
            onPlanApproved(casePlan);
        }
    };

    const toggleMilestone = (index: number) => {
        const newExpanded = new Set(expandedMilestones);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedMilestones(newExpanded);
    };

    const getConfidenceColor = (score: number) => {
        if (score >= 85) return 'text-green-500';
        if (score >= 70) return 'text-yellow-500';
        return 'text-orange-500';
    };

    const getConfidenceLabel = (score: number) => {
        if (score >= 85) return 'High Confidence';
        if (score >= 70) return 'Moderate Confidence';
        return 'Lower Confidence';
    };

    if (!casePlan) {
        return (
            <div className="nexus-card p-8">
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--primary-glow)] mb-4">
                        <Sparkles className="text-[var(--primary)]" size={32} />
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-2">AI Case Plan Generator</h3>
                        <p className="text-[var(--text-muted)] text-sm max-w-md mx-auto">
                            Generate a personalized 90-day case plan for {clientName} using AI.
                            The plan includes milestones, action items, timelines, and resource requirements.
                        </p>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                            <div className="flex items-center gap-2 justify-center">
                                <XCircle size={16} />
                                <span>{error}</span>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="nexus-button nexus-button-primary inline-flex items-center gap-2 px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="animate-spin" size={18} />
                                Generating Plan...
                            </>
                        ) : (
                            <>
                                <Sparkles size={18} />
                                Generate AI Case Plan
                            </>
                        )}
                    </button>

                    {isGenerating && (
                        <p className="text-xs text-[var(--text-muted)] italic">
                            This usually takes 10-15 seconds...
                        </p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Confidence Score */}
            <div className="nexus-card p-6 bg-gradient-to-br from-[var(--primary-glow)] to-transparent border-2 border-[var(--primary)]/20">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-[var(--primary)] flex items-center justify-center">
                            <Sparkles className="text-white" size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">AI-Generated Case Plan</h3>
                            <p className="text-xs text-[var(--text-muted)]">
                                Generated {new Date(casePlan.generated_at).toLocaleDateString()} •
                                Model: {casePlan.model}
                            </p>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className={`text-3xl font-black ${getConfidenceColor(casePlan.confidence_score)}`}>
                            {casePlan.confidence_score}%
                        </div>
                        <div className="text-xs text-[var(--text-muted)] font-bold">
                            {getConfidenceLabel(casePlan.confidence_score)}
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                        <Clock size={16} className="text-[var(--primary)]" />
                        <span className="font-bold">Estimated Time to Housing:</span>
                        <span className="text-[var(--primary)] font-black">{casePlan.estimated_days_to_housing} days</span>
                    </div>
                    <p className="text-sm leading-relaxed">{casePlan.summary}</p>
                </div>
            </div>

            {/* Milestones */}
            <div className="space-y-4">
                <h4 className="font-bold text-lg flex items-center gap-2">
                    <CheckCircle size={20} className="text-[var(--primary)]" />
                    Milestones & Action Items
                </h4>

                {casePlan.milestones.map((milestone, index) => (
                    <div key={index} className="nexus-card overflow-hidden">
                        <button
                            onClick={() => toggleMilestone(index)}
                            className="w-full p-4 flex items-center justify-between hover:bg-[var(--surface-hover)]/50 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[var(--primary-glow)] flex items-center justify-center text-[var(--primary)] font-bold text-sm">
                                    {index + 1}
                                </div>
                                <div className="text-left">
                                    <div className="font-bold text-sm">{milestone.phase}</div>
                                    <div className="text-xs text-[var(--text-muted)]">{milestone.title}</div>
                                </div>
                            </div>
                            {expandedMilestones.has(index) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>

                        {expandedMilestones.has(index) && (
                            <div className="p-4 pt-0 space-y-4 border-t border-[var(--border-crisp)]">
                                {/* Goals */}
                                <div>
                                    <div className="text-xs font-bold text-[var(--text-muted)] uppercase mb-2">Goals</div>
                                    <ul className="space-y-1">
                                        {milestone.goals.map((goal, i) => (
                                            <li key={i} className="text-sm flex items-start gap-2">
                                                <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                                                <span>{goal}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Actions */}
                                <div>
                                    <div className="text-xs font-bold text-[var(--text-muted)] uppercase mb-2">Action Items</div>
                                    <div className="space-y-3">
                                        {milestone.actions.map((action, i) => (
                                            <div key={i} className="p-3 bg-[var(--surface-hover)]/30 rounded-lg border border-[var(--border-crisp)]">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="font-bold text-sm flex-1">{action.task}</div>
                                                    <div className="text-xs bg-[var(--primary-glow)] text-[var(--primary)] px-2 py-1 rounded font-bold">
                                                        {action.estimated_days}d
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                    <div>
                                                        <span className="text-[var(--text-muted)]">Responsible:</span>{' '}
                                                        <span className="font-bold capitalize">{action.responsible}</span>
                                                    </div>
                                                    {action.dependencies.length > 0 && (
                                                        <div>
                                                            <span className="text-[var(--text-muted)]">Needs:</span>{' '}
                                                            <span className="font-bold">{action.dependencies.join(', ')}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                {action.notes && (
                                                    <div className="text-xs text-[var(--text-muted)] mt-2 italic">
                                                        {action.notes}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Barriers & Success Factors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="nexus-card p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <AlertCircle size={16} className="text-orange-500" />
                        <h5 className="font-bold text-sm">Key Barriers</h5>
                    </div>
                    <ul className="space-y-1">
                        {casePlan.key_barriers.map((barrier, i) => (
                            <li key={i} className="text-xs text-[var(--text-muted)] flex items-start gap-2">
                                <span className="text-orange-500">•</span>
                                <span>{barrier}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="nexus-card p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <CheckCircle size={16} className="text-green-500" />
                        <h5 className="font-bold text-sm">Critical Success Factors</h5>
                    </div>
                    <ul className="space-y-1">
                        {casePlan.critical_success_factors.map((factor, i) => (
                            <li key={i} className="text-xs text-[var(--text-muted)] flex items-start gap-2">
                                <span className="text-green-500">•</span>
                                <span>{factor}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Resources Needed */}
            <div className="nexus-card p-4">
                <h5 className="font-bold text-sm mb-3">Resources Needed</h5>
                <div className="flex flex-wrap gap-2">
                    {casePlan.resources_needed.map((resource, i) => (
                        <span
                            key={i}
                            className="px-3 py-1 bg-[var(--primary-glow)] text-[var(--primary)] rounded-full text-xs font-bold"
                        >
                            {resource}
                        </span>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end">
                <button
                    onClick={handleRegenerate}
                    className="px-6 py-3 border border-[var(--border-crisp)] hover:bg-[var(--surface-hover)] rounded-lg font-bold text-sm transition-all flex items-center gap-2"
                >
                    <Sparkles size={16} />
                    Regenerate
                </button>
                <button
                    onClick={() => {/* TODO: Edit mode */}}
                    className="px-6 py-3 border border-[var(--border-crisp)] hover:bg-[var(--surface-hover)] rounded-lg font-bold text-sm transition-all flex items-center gap-2"
                >
                    <Edit3 size={16} />
                    Edit Plan
                </button>
                <button
                    onClick={handleApprove}
                    className="nexus-button nexus-button-primary px-8 py-3 flex items-center gap-2"
                >
                    <Check size={18} />
                    Approve & Assign
                </button>
            </div>
        </div>
    );
}
