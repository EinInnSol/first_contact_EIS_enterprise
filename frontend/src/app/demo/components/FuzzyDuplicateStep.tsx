"use client";

import React, { useState } from 'react';
import { Users, AlertTriangle, Check, X } from 'lucide-react';

interface FuzzyDuplicateStepProps {
    onNext: () => void;
    onInteraction: () => void;
    interactionsCompleted: number;
    requiredInteractions: number;
}

const potentialDuplicates = [
    {
        id: 1,
        name: "Robert Thompson",
        matchScore: 95,
        reason: "Exact name match, similar age (42 vs 43)",
        existingRecord: {
            name: "Robert Thompson",
            age: 43,
            lastSeen: "2025-11-20",
            vendor: "LAMP",
            status: "Active"
        },
        isDuplicate: true
    },
    {
        id: 2,
        name: "Bob Thompson",
        matchScore: 78,
        reason: "Similar name (nickname), same age",
        existingRecord: {
            name: "Bob Thompson",
            age: 42,
            lastSeen: "2025-10-15",
            vendor: "PATH",
            status: "Inactive"
        },
        isDuplicate: false
    },
    {
        id: 3,
        name: "Robert Thomson",
        matchScore: 85,
        reason: "Name spelling variation, similar age",
        existingRecord: {
            name: "Robert Thomson",
            age: 44,
            lastSeen: "2025-09-08",
            vendor: "MHALA",
            status: "Housed"
        },
        isDuplicate: false
    }
];

export default function FuzzyDuplicateStep({ onNext, onInteraction, interactionsCompleted, requiredInteractions }: FuzzyDuplicateStepProps) {
    const [isChecking, setIsChecking] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [reviewedMatches, setReviewedMatches] = useState<Set<number>>(new Set());

    const handleCheckDuplicates = () => {
        setIsChecking(true);
        setTimeout(() => {
            setIsChecking(false);
            setShowResults(true);
            onInteraction();
        }, 2000);
    };

    const handleReviewMatch = (id: number) => {
        if (!reviewedMatches.has(id)) {
            setReviewedMatches(new Set([...reviewedMatches, id]));
            onInteraction();
        }
    };

    const canContinue = interactionsCompleted >= requiredInteractions;

    const getMatchColor = (score: number) => {
        if (score >= 90) return 'text-red-500 bg-red-500/10 border-red-500/20';
        if (score >= 75) return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
                <h1 className="text-4xl font-black tracking-tighter">
                    <span className="text-[var(--primary)]">Step 3:</span> Fuzzy Duplicate Detection
                </h1>
                <p className="text-lg text-[var(--text-muted)]">
                    SmartClientMatcher prevents double-counting and fraud
                </p>
            </div>

            {/* Instructions */}
            <div className="nexus-card-outlined bg-gradient-to-br from-[var(--primary)]/10 to-purple-500/10 border-[var(--primary)] p-6">
                <h3 className="font-black mb-3 flex items-center gap-2">
                    <Users className="text-[var(--primary)]" size={24} />
                    Required Interaction
                </h3>
                <p className="text-sm mb-4">
                    Click "Check for Duplicates" and then review each potential match to see how the AI detects duplicates.
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
                {/* New Client Info */}
                <div className="space-y-6">
                    <div className="nexus-card-outlined bg-[var(--surface)] p-6 space-y-4">
                        <h3 className="text-xl font-black">New Intake</h3>
                        <div className="space-y-3">
                            <div>
                                <div className="text-sm text-[var(--text-muted)]">Name</div>
                                <div className="font-bold text-lg">Robert Thompson</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm text-[var(--text-muted)]">Age</div>
                                    <div className="font-bold">42</div>
                                </div>
                                <div>
                                    <div className="text-sm text-[var(--text-muted)]">Gender</div>
                                    <div className="font-bold">Male</div>
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-[var(--text-muted)]">Intake Location</div>
                                <div className="font-bold">MLK Park, Long Beach</div>
                            </div>
                        </div>
                    </div>

                    {!showResults ? (
                        <button
                            onClick={handleCheckDuplicates}
                            disabled={isChecking}
                            className="w-full nexus-button nexus-button-primary py-4 flex items-center justify-center gap-2"
                        >
                            {isChecking ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Scanning 12,847 records...
                                </>
                            ) : (
                                <>
                                    <Users size={20} />
                                    Check for Duplicates
                                </>
                            )}
                        </button>
                    ) : (
                        <div className="nexus-card-outlined bg-gradient-to-br from-[var(--success)]/10 to-green-500/5 border-[var(--success)] p-6 space-y-3 animate-in fade-in duration-500">
                            <div className="flex items-center gap-2">
                                <Check size={24} className="text-[var(--success)]" />
                                <h3 className="text-xl font-black">Scan Complete</h3>
                            </div>
                            <p className="text-sm">
                                Found <strong>3 potential matches</strong> in the system. Review each match to determine if this is a duplicate record.
                            </p>
                        </div>
                    )}

                    <div className="nexus-card-outlined bg-[var(--surface)] p-6 space-y-4">
                        <h3 className="text-xl font-black">How It Works</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                <span><strong>Fuzzy matching</strong> - Catches spelling variations and nicknames</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                <span><strong>Multi-factor analysis</strong> - Name, age, location, physical description</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                <span><strong>Confidence scoring</strong> - AI assigns match probability</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                <span><strong>Human review</strong> - Caseworker makes final decision</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Potential Matches */}
                <div className="space-y-4">
                    <h3 className="text-xl font-black">Potential Matches</h3>

                    {showResults ? (
                        <>
                            {potentialDuplicates.map((match) => {
                                const isReviewed = reviewedMatches.has(match.id);

                                return (
                                    <button
                                        key={match.id}
                                        onClick={() => handleReviewMatch(match.id)}
                                        className={`w-full text-left nexus-card-outlined p-5 transition-all ${isReviewed
                                                ? 'border-[var(--success)] bg-[var(--success)]/5'
                                                : 'hover:border-[var(--primary)]'
                                            } bg-[var(--surface)]`}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getMatchColor(match.matchScore)}`}>
                                                {match.matchScore}% MATCH
                                            </span>
                                            {isReviewed && (
                                                <Check size={20} className="text-[var(--success)]" />
                                            )}
                                        </div>

                                        <h4 className="font-bold mb-2">{match.existingRecord.name}</h4>
                                        <p className="text-sm text-[var(--text-muted)] mb-3">{match.reason}</p>

                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div>
                                                <div className="text-[var(--text-muted)]">Age</div>
                                                <div className="font-bold">{match.existingRecord.age}</div>
                                            </div>
                                            <div>
                                                <div className="text-[var(--text-muted)]">Status</div>
                                                <div className="font-bold">{match.existingRecord.status}</div>
                                            </div>
                                            <div>
                                                <div className="text-[var(--text-muted)]">Last Seen</div>
                                                <div className="font-bold">{match.existingRecord.lastSeen}</div>
                                            </div>
                                            <div>
                                                <div className="text-[var(--text-muted)]">Vendor</div>
                                                <div className="font-bold">{match.existingRecord.vendor}</div>
                                            </div>
                                        </div>

                                        {isReviewed && (
                                            <div className="mt-4 pt-4 border-t border-[var(--border-crisp)]">
                                                <div className="flex gap-2">
                                                    {match.isDuplicate ? (
                                                        <div className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 text-red-500 rounded-lg text-sm font-bold">
                                                            <X size={16} />
                                                            Duplicate - Merge Records
                                                        </div>
                                                    ) : (
                                                        <div className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[var(--success)]/10 text-[var(--success)] rounded-lg text-sm font-bold">
                                                            <Check size={16} />
                                                            Different Person
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </>
                    ) : (
                        <div className="nexus-card-outlined bg-[var(--surface)] p-12 text-center">
                            <AlertTriangle size={64} className="text-[var(--text-muted)] mx-auto mb-4 opacity-20" />
                            <p className="text-[var(--text-muted)]">
                                Click "Check for Duplicates" to scan the system
                            </p>
                        </div>
                    )}

                    {showResults && (
                        <button
                            onClick={onNext}
                            disabled={!canContinue}
                            className={`w-full nexus-button py-4 mt-4 ${canContinue
                                    ? 'nexus-button-primary'
                                    : 'opacity-50 cursor-not-allowed bg-[var(--surface-hover)] border border-[var(--border-crisp)]'
                                }`}
                        >
                            {canContinue
                                ? 'Continue to AI Case Plans →'
                                : `Review ${requiredInteractions - interactionsCompleted} more matches`
                            }
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
