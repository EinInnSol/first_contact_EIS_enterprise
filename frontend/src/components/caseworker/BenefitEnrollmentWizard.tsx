"use client";

import React, { useState, useEffect } from 'react';
import {
    DollarSign,
    CheckCircle,
    Clock,
    AlertTriangle,
    ChevronRight,
    Loader2,
    TrendingUp,
    FileText,
    Calendar,
    Sparkles
} from 'lucide-react';

interface BenefitProgram {
    code: string;
    name: string;
    category: string;
    amount: number;
    timeline: string;
    eligible: boolean;
    barriers: string[];
    priority: number;
    application_steps: string[];
}

interface BenefitProjection {
    total_monthly_income: number;
    eligible_programs: BenefitProgram[];
    recommended_sequence: string[];
    timeline_total: string;
    notes: string[];
}

interface BenefitEnrollmentWizardProps {
    clientId: string;
    clientName: string;
}

export default function BenefitEnrollmentWizard({ clientId, clientName }: BenefitEnrollmentWizardProps) {
    const [loading, setLoading] = useState(true);
    const [projection, setProjection] = useState<BenefitProjection | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [enrollmentStatus, setEnrollmentStatus] = useState<{[key: string]: 'pending' | 'in_progress' | 'completed'}>({});

    useEffect(() => {
        fetchBenefitProjection();
    }, [clientId]);

    const fetchBenefitProjection = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1/clients/${clientId}/benefits/projection`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch benefit projection');
            }

            const data = await response.json();
            setProjection(data);

            // Initialize enrollment status
            const initialStatus: {[key: string]: 'pending' | 'in_progress' | 'completed'} = {};
            data.eligible_programs.forEach((program: BenefitProgram) => {
                initialStatus[program.code] = 'pending';
            });
            setEnrollmentStatus(initialStatus);

        } catch (err: any) {
            setError(err.message);
            console.error('Error fetching benefit projection:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStartEnrollment = (programCode: string) => {
        setEnrollmentStatus(prev => ({
            ...prev,
            [programCode]: 'in_progress'
        }));
    };

    const handleCompleteEnrollment = async (programCode: string) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1/clients/${clientId}/benefits/apply`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        benefit_code: programCode,
                        status: 'applied'
                    })
                }
            );

            setEnrollmentStatus(prev => ({
                ...prev,
                [programCode]: 'completed'
            }));

        } catch (err) {
            console.error('Error marking benefit applied:', err);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="text-green-500" size={20} />;
            case 'in_progress':
                return <Clock className="text-yellow-500" size={20} />;
            default:
                return <div className="w-5 h-5 rounded-full border-2 border-[var(--border-crisp)]"></div>;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'border-green-500 bg-green-500/10';
            case 'in_progress':
                return 'border-yellow-500 bg-yellow-500/10';
            default:
                return 'border-[var(--border-crisp)]';
        }
    };

    if (loading) {
        return (
            <div className="nexus-card p-12 text-center">
                <Loader2 className="animate-spin text-[var(--primary)] mx-auto mb-4" size={32} />
                <p className="text-[var(--text-muted)]">Calculating optimal benefit stack...</p>
            </div>
        );
    }

    if (error || !projection) {
        return (
            <div className="nexus-card p-8 text-center">
                <AlertTriangle className="text-red-500 mx-auto mb-4" size={32} />
                <p className="text-red-500 mb-4">Error: {error || 'Failed to load benefit projection'}</p>
                <button
                    onClick={fetchBenefitProjection}
                    className="nexus-button nexus-button-primary"
                >
                    Retry
                </button>
            </div>
        );
    }

    const sortedPrograms = [...projection.eligible_programs].sort((a, b) => {
        const aIndex = projection.recommended_sequence.indexOf(a.code);
        const bIndex = projection.recommended_sequence.indexOf(b.code);
        return aIndex - bIndex;
    });

    return (
        <div className="space-y-6">
            {/* Header with Total Projection */}
            <div className="nexus-card p-6 bg-gradient-to-br from-green-500/10 to-transparent border-2 border-green-500/20">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                            <DollarSign className="text-white" size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Optimized Benefit Stack</h3>
                            <p className="text-xs text-[var(--text-muted)]">
                                AI-calculated maximum monthly income for {clientName}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-black text-green-500">
                            ${projection.total_monthly_income.toLocaleString()}
                        </div>
                        <div className="text-xs text-[var(--text-muted)] font-bold">
                            /month
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                    <Clock size={16} className="text-[var(--primary)]" />
                    <span className="font-bold">Total Timeline:</span>
                    <span className="text-[var(--primary)] font-black">{projection.timeline_total}</span>
                </div>

                {projection.notes.length > 0 && (
                    <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <div className="flex items-start gap-2">
                            <Sparkles size={16} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                            <div className="text-xs space-y-1">
                                {projection.notes.map((note, i) => (
                                    <p key={i} className="text-[var(--text-muted)]">{note}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Application Sequence */}
            <div>
                <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <TrendingUp size={20} className="text-[var(--primary)]" />
                    Recommended Application Sequence
                </h4>
                <p className="text-sm text-[var(--text-muted)] mb-6">
                    Apply for benefits in this order to maximize income and minimize delays.
                    Some benefits enable or affect others.
                </p>

                <div className="space-y-4">
                    {sortedPrograms.map((program, index) => {
                        const status = enrollmentStatus[program.code] || 'pending';
                        const isEligible = program.eligible;

                        return (
                            <div
                                key={program.code}
                                className={`nexus-card overflow-hidden border-2 transition-all ${getStatusColor(status)}`}
                            >
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-start gap-3 flex-1">
                                            <div className="mt-1">
                                                {getStatusIcon(status)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="px-2 py-0.5 bg-[var(--primary-glow)] text-[var(--primary)] rounded text-xs font-bold">
                                                        Step {index + 1}
                                                    </div>
                                                    <h5 className="font-bold">{program.name}</h5>
                                                </div>
                                                <div className="flex items-center gap-4 text-xs text-[var(--text-muted)] mb-2">
                                                    <span className="flex items-center gap-1">
                                                        <DollarSign size={12} />
                                                        ${program.amount}/month
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={12} />
                                                        {program.timeline}
                                                    </span>
                                                    <span className="px-2 py-0.5 bg-[var(--surface-hover)] rounded font-bold capitalize">
                                                        {program.category}
                                                    </span>
                                                </div>

                                                {!isEligible && program.barriers.length > 0 && (
                                                    <div className="p-2 bg-orange-500/10 border border-orange-500/20 rounded text-xs mt-2">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <AlertTriangle size={12} className="text-orange-500" />
                                                            <span className="font-bold text-orange-500">Barriers:</span>
                                                        </div>
                                                        <ul className="list-disc list-inside space-y-0.5 text-[var(--text-muted)]">
                                                            {program.barriers.map((barrier, i) => (
                                                                <li key={i}>{barrier}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {isEligible && status === 'pending' && (
                                                    <div className="mt-3">
                                                        <button
                                                            onClick={() => handleStartEnrollment(program.code)}
                                                            className="nexus-button nexus-button-primary text-xs px-4 py-2"
                                                        >
                                                            <FileText size={14} />
                                                            Start Application
                                                        </button>
                                                    </div>
                                                )}

                                                {status === 'in_progress' && (
                                                    <div className="mt-3 space-y-3">
                                                        <div>
                                                            <div className="text-xs font-bold mb-2">Application Steps:</div>
                                                            <ul className="space-y-2">
                                                                {program.application_steps?.map((step, i) => (
                                                                    <li key={i} className="flex items-start gap-2 text-xs">
                                                                        <CheckCircle size={12} className="text-green-500 mt-0.5 flex-shrink-0" />
                                                                        <span className="text-[var(--text-muted)]">{step}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleCompleteEnrollment(program.code)}
                                                                className="nexus-button nexus-button-primary text-xs px-4 py-2"
                                                            >
                                                                <CheckCircle size={14} />
                                                                Mark as Applied
                                                            </button>
                                                            <button
                                                                onClick={() => setEnrollmentStatus(prev => ({...prev, [program.code]: 'pending'}))}
                                                                className="px-4 py-2 border border-[var(--border-crisp)] hover:bg-[var(--surface-hover)] rounded-lg text-xs font-bold transition-all"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                {status === 'completed' && (
                                                    <div className="mt-3 p-2 bg-green-500/10 border border-green-500/20 rounded text-xs flex items-center gap-2">
                                                        <CheckCircle size={14} className="text-green-500" />
                                                        <span className="font-bold text-green-500">Application submitted</span>
                                                        <span className="text-[var(--text-muted)]">• Awaiting approval</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className="text-xl font-black text-green-500">
                                                +${program.amount}
                                            </div>
                                            <div className="text-xs text-[var(--text-muted)]">/month</div>
                                        </div>
                                    </div>
                                </div>

                                {index < sortedPrograms.length - 1 && (
                                    <div className="flex justify-center py-2 border-t border-[var(--border-crisp)] bg-[var(--surface-hover)]/30">
                                        <ChevronRight size={16} className="text-[var(--text-muted)] rotate-90" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Summary */}
            <div className="nexus-card p-6 bg-[var(--surface-hover)]/30">
                <h5 className="font-bold mb-4">Enrollment Progress</h5>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-2xl font-black text-[var(--text-muted)]">
                            {Object.values(enrollmentStatus).filter(s => s === 'pending').length}
                        </div>
                        <div className="text-xs text-[var(--text-muted)]">Pending</div>
                    </div>
                    <div>
                        <div className="text-2xl font-black text-yellow-500">
                            {Object.values(enrollmentStatus).filter(s => s === 'in_progress').length}
                        </div>
                        <div className="text-xs text-[var(--text-muted)]">In Progress</div>
                    </div>
                    <div>
                        <div className="text-2xl font-black text-green-500">
                            {Object.values(enrollmentStatus).filter(s => s === 'completed').length}
                        </div>
                        <div className="text-xs text-[var(--text-muted)]">Completed</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
