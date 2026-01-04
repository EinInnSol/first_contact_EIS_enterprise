"use client";

import React, { useState } from 'react';
import { TrendingUp, AlertTriangle, Check, BarChart3 } from 'lucide-react';

interface PredictiveAnalyticsStepProps {
    onNext: () => void;
    onInteraction: () => void;
    interactionsCompleted: number;
    requiredInteractions: number;
}

const predictions = [
    {
        id: 1,
        type: 'capacity',
        title: "Shelter Capacity Crisis - 14 Days",
        severity: 'high',
        prediction: "PATH shelter will reach 100% capacity in 14 days based on current intake rate (12.3 clients/day vs 8.1 exits/day)",
        recommendation: "Increase rapid rehousing placements by 40% or open overflow capacity",
        confidence: 94,
        impact: "Without intervention: 47 clients will be turned away"
    },
    {
        id: 2,
        type: 'bottleneck',
        title: "SSI Application Bottleneck",
        severity: 'medium',
        prediction: "SSI application processing time increasing 23% month-over-month. Current backlog: 156 applications",
        recommendation: "Hire 2 additional benefits specialists or implement AI-assisted application prep",
        confidence: 87,
        impact: "Reduces average housing placement time by 31 days"
    },
    {
        id: 3,
        type: 'trend',
        title: "Mental Health Service Gap",
        severity: 'medium',
        prediction: "Clients with mental health needs wait 47 days for first appointment (vs 12 day target)",
        recommendation: "Partner with additional mental health providers or expand telehealth options",
        confidence: 91,
        impact: "Improves housing stability outcomes by 28%"
    }
];

export default function PredictiveAnalyticsStep({ onNext, onInteraction, interactionsCompleted, requiredInteractions }: PredictiveAnalyticsStepProps) {
    const [isRunning, setIsRunning] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [reviewedPredictions, setReviewedPredictions] = useState<Set<number>>(new Set());

    const handleRunPrediction = () => {
        setIsRunning(true);
        setTimeout(() => {
            setIsRunning(false);
            setShowResults(true);
            onInteraction();
        }, 3000);
    };

    const handleReviewPrediction = (id: number) => {
        if (!reviewedPredictions.has(id)) {
            setReviewedPredictions(new Set([...reviewedPredictions, id]));
            onInteraction();
        }
    };

    const canContinue = interactionsCompleted >= requiredInteractions;

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'high': return 'text-red-500 bg-red-500/10 border-red-500/20';
            case 'medium': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
            case 'low': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
                <h1 className="text-4xl font-black tracking-tighter">
                    <span className="text-[var(--primary)]">Step 11:</span> Predictive Analytics
                </h1>
                <p className="text-lg text-[var(--text-muted)]">
                    AI-powered forecasting and early warning system
                </p>
            </div>

            {/* Instructions */}
            <div className="nexus-card-outlined bg-gradient-to-br from-[var(--primary)]/10 to-purple-500/10 border-[var(--primary)] p-6">
                <h3 className="font-black mb-3 flex items-center gap-2">
                    <BarChart3 className="text-[var(--primary)]" size={24} />
                    Required Interaction
                </h3>
                <p className="text-sm mb-4">
                    Click "Run Prediction" and then review each forecast to see how AI predicts system bottlenecks.
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

            {!showResults ? (
                <div className="nexus-card-outlined bg-[var(--surface)] p-12 text-center space-y-6">
                    <BarChart3 size={80} className="text-[var(--primary)] mx-auto opacity-20" />
                    <div>
                        <h3 className="text-2xl font-black mb-2">Ready to Analyze System Data</h3>
                        <p className="text-[var(--text-muted)] mb-6">
                            AI will analyze 12,847 client records, 4 vendor performance histories, and 6 months of trend data to predict future bottlenecks.
                        </p>
                        <button
                            onClick={handleRunPrediction}
                            disabled={isRunning}
                            className="nexus-button nexus-button-primary px-12 py-4 text-lg flex items-center justify-center gap-2 mx-auto"
                        >
                            {isRunning ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Analyzing data...
                                </>
                            ) : (
                                <>
                                    <TrendingUp size={20} />
                                    Run Prediction
                                </>
                            )}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-6 animate-in fade-in duration-500">
                    {/* Analysis Complete */}
                    <div className="nexus-card-outlined bg-gradient-to-br from-[var(--success)]/10 to-green-500/5 border-[var(--success)] p-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Check size={24} className="text-[var(--success)]" />
                            <h3 className="text-2xl font-black">Analysis Complete</h3>
                        </div>
                        <p className="text-sm">
                            Identified <strong>3 critical predictions</strong> requiring attention. Review each forecast below.
                        </p>
                    </div>

                    {/* Predictions */}
                    <div className="grid grid-cols-1 gap-6">
                        {predictions.map((pred) => {
                            const isReviewed = reviewedPredictions.has(pred.id);

                            return (
                                <button
                                    key={pred.id}
                                    onClick={() => handleReviewPrediction(pred.id)}
                                    className={`text-left nexus-card-outlined p-6 transition-all ${isReviewed
                                            ? 'border-[var(--success)] bg-[var(--success)]/5'
                                            : 'hover:border-[var(--primary)]'
                                        } bg-[var(--surface)]`}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle size={20} className={pred.severity === 'high' ? 'text-red-500' : 'text-orange-500'} />
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getSeverityColor(pred.severity)}`}>
                                                {pred.severity.toUpperCase()} PRIORITY
                                            </span>
                                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--primary)]/10 text-[var(--primary)]">
                                                {pred.confidence}% CONFIDENCE
                                            </span>
                                        </div>
                                        {isReviewed && (
                                            <Check size={24} className="text-[var(--success)]" />
                                        )}
                                    </div>

                                    <h4 className="text-xl font-black mb-3">{pred.title}</h4>

                                    <div className="space-y-4">
                                        <div className="p-4 bg-[var(--background)] rounded-xl">
                                            <h5 className="font-bold mb-2 text-sm uppercase tracking-wider text-[var(--text-muted)]">
                                                Prediction
                                            </h5>
                                            <p className="text-sm">{pred.prediction}</p>
                                        </div>

                                        <div className="p-4 bg-[var(--primary)]/5 border border-[var(--primary)]/20 rounded-xl">
                                            <h5 className="font-bold mb-2 text-sm uppercase tracking-wider text-[var(--primary)]">
                                                Recommended Action
                                            </h5>
                                            <p className="text-sm font-bold">{pred.recommendation}</p>
                                        </div>

                                        <div className="p-4 bg-[var(--success)]/5 border border-[var(--success)]/20 rounded-xl">
                                            <h5 className="font-bold mb-2 text-sm uppercase tracking-wider text-[var(--success)]">
                                                Expected Impact
                                            </h5>
                                            <p className="text-sm font-bold">{pred.impact}</p>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* What This Shows */}
                    <div className="nexus-card-outlined bg-[var(--surface)] p-6 space-y-4">
                        <h3 className="text-xl font-black">Predictive Analytics Benefits</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                <span><strong>Early warning system</strong> - Identifies problems weeks before they occur</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                <span><strong>Resource optimization</strong> - Allocate staff and funding proactively</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                <span><strong>Trend analysis</strong> - Understand long-term patterns in service delivery</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                <span><strong>Data-driven decisions</strong> - Replace gut feelings with statistical forecasts</span>
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
                            ? 'Continue to Geospatial Intelligence →'
                            : `Review ${requiredInteractions - interactionsCompleted} more predictions`
                        }
                    </button>
                </div>
            )}
        </div>
    );
}
