"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    User,
    Calendar,
    MapPin,
    Phone,
    Mail,
    FileText,
    DollarSign,
    Home,
    Activity,
    Sparkles
} from 'lucide-react';
import AICasePlanGenerator from '@/components/caseworker/AICasePlanGenerator';
import BenefitEnrollmentWizard from '@/components/caseworker/BenefitEnrollmentWizard';

interface Client {
    id: string;
    case_number: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    phone: string;
    email: string;
    status: string;
    vi_spdat_score: number;
    acuity_level: string;
    intake_date: string;
    housed_date?: string;
    assigned_vendor_id: number;
}

export default function ClientDetailPage() {
    const params = useParams();
    const router = useRouter();
    const clientId = params.id as string;

    const [client, setClient] = useState<Client | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchClientData();
    }, [clientId]);

    const fetchClientData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/clients/${clientId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch client data');
            }

            const data = await response.json();
            setClient(data);
        } catch (err: any) {
            setError(err.message);
            console.error('Error fetching client:', err);
        } finally {
            setLoading(false);
        }
    };

    const calculateAge = (dateOfBirth: string) => {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const getAcuityColor = (level: string) => {
        switch (level?.toLowerCase()) {
            case 'severe': return 'text-red-500 bg-red-500/10 border-red-500/20';
            case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
            case 'moderate': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            case 'low': return 'text-green-500 bg-green-500/10 border-green-500/20';
            default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
        }
    };

    const handlePlanApproved = (plan: any) => {
        console.log('Plan approved:', plan);
        // TODO: Save plan to database, assign to client, navigate to next step
        alert('Case plan approved! (TODO: Implement save functionality)');
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
                    <p className="text-[var(--text-muted)]">Loading client data...</p>
                </div>
            </div>
        );
    }

    if (error || !client) {
        return (
            <div className="p-8">
                <div className="nexus-card p-8 text-center">
                    <p className="text-red-500 mb-4">Error: {error || 'Client not found'}</p>
                    <button
                        onClick={() => router.back()}
                        className="nexus-button nexus-button-primary"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const clientName = `${client.first_name} ${client.last_name}`;

    return (
        <div className="p-8 max-w-[1600px] mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-[var(--surface-hover)] rounded-lg border border-[var(--border-crisp)] transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold">{clientName}</h1>
                        <p className="text-[var(--text-muted)] text-sm">
                            Case #{client.case_number} • Status: <span className="font-bold capitalize">{client.status}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className={`px-4 py-2 rounded-lg border font-bold text-sm ${getAcuityColor(client.acuity_level)}`}>
                        {client.acuity_level?.toUpperCase()} ACUITY
                    </div>
                    <div className="px-4 py-2 rounded-lg border border-[var(--border-crisp)] bg-[var(--surface)] font-bold text-sm">
                        VI-SPDAT: {client.vi_spdat_score}/17
                    </div>
                </div>
            </div>

            {/* Client Info Card */}
            <div className="nexus-card p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-[var(--primary-glow)]">
                            <User size={20} className="text-[var(--primary)]" />
                        </div>
                        <div>
                            <div className="text-xs text-[var(--text-muted)] font-bold mb-1">Age</div>
                            <div className="font-bold">{calculateAge(client.date_of_birth)} years old</div>
                            <div className="text-xs text-[var(--text-muted)]">
                                DOB: {new Date(client.date_of_birth).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-[var(--primary-glow)]">
                            <Phone size={20} className="text-[var(--primary)]" />
                        </div>
                        <div>
                            <div className="text-xs text-[var(--text-muted)] font-bold mb-1">Contact</div>
                            <div className="font-bold text-sm">{client.phone || 'No phone'}</div>
                            <div className="text-xs text-[var(--text-muted)]">{client.email || 'No email'}</div>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-[var(--primary-glow)]">
                            <Calendar size={20} className="text-[var(--primary)]" />
                        </div>
                        <div>
                            <div className="text-xs text-[var(--text-muted)] font-bold mb-1">Intake Date</div>
                            <div className="font-bold">{new Date(client.intake_date).toLocaleDateString()}</div>
                            <div className="text-xs text-[var(--text-muted)]">
                                {Math.floor((Date.now() - new Date(client.intake_date).getTime()) / (1000 * 60 * 60 * 24))} days ago
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-[var(--primary-glow)]">
                            <Home size={20} className="text-[var(--primary)]" />
                        </div>
                        <div>
                            <div className="text-xs text-[var(--text-muted)] font-bold mb-1">Housing Status</div>
                            <div className="font-bold capitalize">{client.status}</div>
                            {client.housed_date && (
                                <div className="text-xs text-[var(--text-muted)]">
                                    Housed: {new Date(client.housed_date).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[var(--border-crisp)] gap-8">
                {[
                    { id: 'overview', label: 'Overview', icon: Activity },
                    { id: 'case-plan', label: 'Case Plan', icon: Sparkles },
                    { id: 'benefits', label: 'Benefits', icon: DollarSign },
                    { id: 'timeline', label: 'Timeline', icon: Calendar }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`pb-4 text-sm font-semibold transition-all relative flex items-center gap-2 ${
                            activeTab === tab.id ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'
                        }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--primary)] rounded-t-full"></div>
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div>
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <div className="nexus-card p-6">
                            <h3 className="font-bold text-lg mb-4">Client Overview</h3>
                            <p className="text-[var(--text-muted)]">
                                Overview content coming soon. This will include client summary, recent activity, and quick actions.
                            </p>
                        </div>
                    </div>
                )}

                {activeTab === 'case-plan' && (
                    <AICasePlanGenerator
                        clientId={clientId}
                        clientName={clientName}
                        onPlanApproved={handlePlanApproved}
                    />
                )}

                {activeTab === 'benefits' && (
                    <BenefitEnrollmentWizard
                        clientId={clientId}
                        clientName={clientName}
                    />
                )}

                {activeTab === 'timeline' && (
                    <div className="nexus-card p-6">
                        <h3 className="font-bold text-lg mb-4">Client Timeline</h3>
                        <p className="text-[var(--text-muted)]">
                            Timeline view coming soon. This will show all client events and milestones.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
