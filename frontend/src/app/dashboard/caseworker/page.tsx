"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Users,
    Calendar,
    CheckCircle,
    Clock,
    UserPlus,
    ArrowRight,
    TrendingUp,
    Filter,
    MoreHorizontal
} from 'lucide-react';

export default function CaseworkerDashboard() {
    const [activeTab, setActiveTab] = useState('list');
    const router = useRouter();

    return (
        <div className="p-8 space-y-8 max-w-[1600px] mx-auto">

            {/* Welcome & Priority Section */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Welcome back, Maria</h1>
                    <p className="text-[var(--text-muted)]">You have 4 high-priority clients requiring intervention today.</p>
                </div>
                <button className="nexus-button nexus-button-primary flex items-center gap-2">
                    <UserPlus size={18} />
                    New Intake
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Left: AI Priority List */}
                <div className="lg:col-span-3 space-y-6">

                    {/* Tabs */}
                    <div className="flex border-b border-[var(--border-crisp)] gap-8">
                        {['Client List', 'Active Pathways', 'Pending Approvals'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab.toLowerCase())}
                                className={`pb-4 text-sm font-semibold transition-all relative ${activeTab === tab.toLowerCase() ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'
                                    }`}
                            >
                                {tab}
                                {activeTab === tab.toLowerCase() && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--primary)] rounded-t-full"></div>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Client Table / Grid */}
                    <div className="nexus-card p-0 overflow-hidden">
                        <div className="p-4 border-b border-[var(--border-crisp)] flex items-center justify-between bg-[var(--surface-hover)]/30">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={14} />
                                    <input type="text" placeholder="Filter clients..." className="pl-9 pr-4 py-1.5 bg-[var(--background)] border border-[var(--border-crisp)] rounded-lg text-xs outline-none focus:border-[var(--primary)]" />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-[var(--surface-hover)] rounded-lg border border-[var(--border-crisp)]"><TrendingUp size={16} /></button>
                                <button className="p-2 hover:bg-[var(--surface-hover)] rounded-lg border border-[var(--border-crisp)]"><MoreHorizontal size={16} /></button>
                            </div>
                        </div>

                        <div className="divide-y divide-[var(--border-crisp)]">
                            {[
                                { id: 'demo-1', name: 'Robert Thompson', status: 'In Review', urgency: 14, task: 'Finalize Care Plan', color: 'red' },
                                { id: 'demo-2', name: 'Maria Garcia', status: 'Housed', urgency: 2, task: '30-Day Follow-up', color: 'green' },
                                { id: 'demo-3', name: 'Jennifer Wu', status: 'Intake', urgency: 9, task: 'Verify Identity Docs', color: 'blue' },
                                { id: 'demo-4', name: 'Marcus Miller', status: 'Pending Benefits', urgency: 12, task: 'Approve GR Application', color: 'orange' },
                                { id: 'demo-5', name: 'James Wilson', status: 'Active Support', urgency: 5, task: 'Schedule Transport', color: 'blue' },
                            ].sort((a, b) => b.urgency - a.urgency).map((client, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between p-5 hover:bg-[var(--surface-hover)]/50 transition-all cursor-pointer group"
                                    onClick={() => router.push(`/dashboard/caseworker/client/${client.id}`)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full bg-${client.color}-500/10 flex items-center justify-center text-${client.color}-500 font-bold border border-${client.color}-500/20`}>
                                            {client.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm tracking-tight">{client.name}</div>
                                            <div className="text-[10px] text-[var(--text-muted)] font-medium uppercase tracking-widest">{client.status}</div>
                                        </div>
                                    </div>

                                    <div className="hidden md:flex flex-col items-center">
                                        <div className="text-[10px] text-[var(--text-muted)] uppercase font-bold mb-1">Urgency Score</div>
                                        <div className={`text-lg font-black ${client.urgency > 10 ? 'text-red-500' : 'text-[var(--text-muted)]'}`}>
                                            {client.urgency}/15
                                        </div>
                                    </div>

                                    <div className="hidden lg:block">
                                        <div className="text-[10px] text-[var(--text-muted)] uppercase font-bold mb-1">Next Action</div>
                                        <div className="flex items-center gap-2 text-xs font-semibold">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]"></div>
                                            {client.task}
                                        </div>
                                    </div>

                                    <button className="flex items-center gap-2 text-[var(--primary)] font-bold text-xs px-4 py-2 hover:bg-[var(--primary-glow)] rounded-lg transition-all">
                                        View Case
                                        <ArrowRight size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 bg-[var(--surface-hover)]/30 text-center">
                            <button className="text-xs font-bold text-[var(--primary)] hover:underline">View All 42 Clients</button>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar: AI Best Next Steps */}
                <div className="space-y-8 text-sm">

                    <div className="nexus-card-outlined p-0 overflow-hidden border-2">
                        <div className="p-6 border-b border-[var(--signature-outline)] bg-[var(--signature-outline)]/5">
                            <h3 className="font-black text-[var(--signature-outline)] uppercase tracking-tighter flex items-center gap-2 transition-all">
                                <CheckCircle size={18} />
                                Best Next Steps
                            </h3>
                            <p className="text-[10px] text-[var(--text-muted)] mt-1 font-bold uppercase tracking-widest">AI COORDINATED (90% DONE)</p>
                        </div>

                        <div className="p-6 space-y-6">
                            {[
                                { label: 'Confirm Appointment Swap', desc: 'Robert T. for Maria G. (2pm Today)', type: 'URGENT' },
                                { label: 'Authorize GR Housing Plan', desc: 'Marcus M. (Approved by Rules Engine)', type: 'REQUIRES AUTH' },
                                { label: 'Send Transport SMS', desc: 'Jennifer W. (Van arriving in 45m)', type: 'AUTO' },
                            ].map((step, i) => (
                                <div key={i} className="relative pl-6 border-l-2 border-[var(--border-crisp)] hover:border-[var(--primary)] transition-all py-1">
                                    <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-[var(--surface)] border-2 border-[var(--border-crisp)]"></div>
                                    <div className="text-[10px] font-black text-[var(--primary)] tracking-widest mb-1">{step.type}</div>
                                    <div className="font-bold leading-none mb-1 text-[var(--text-main)]">{step.label}</div>
                                    <div className="text-xs text-[var(--text-muted)]">{step.desc}</div>
                                    <button className="mt-3 text-[10px] font-bold text-[var(--primary)] py-1.5 px-3 bg-[var(--primary-glow)] rounded w-full hover:bg-[var(--primary)] hover:text-white transition-all">
                                        Execute Now
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 border-t border-[var(--border-crisp)] bg-[var(--surface-hover)]/30 text-center">
                            <span className="text-[10px] text-[var(--text-muted)] font-bold">4 MORE SUGGESTIONS</span>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="nexus-card">
                        <h4 className="font-bold mb-4 flex items-center gap-2">
                            <Clock size={16} className="text-[var(--primary)]" />
                            Efficiency Target
                        </h4>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs font-bold mb-1">
                                    <span>Weekly Goal</span>
                                    <span>78%</span>
                                </div>
                                <div className="h-2 bg-[var(--background)] rounded-full overflow-hidden border border-[var(--border-crisp)]">
                                    <div className="h-full bg-[var(--primary)] w-[78%] transition-all shadow-[0_0_8px_var(--primary-glow)]"></div>
                                </div>
                            </div>
                            <p className="text-[10px] text-[var(--text-muted)] leading-relaxed italic">
                                AI has handled **12.5 hrs** of coord work for you this week. Keep focused on the 10% high-value interventions.
                            </p>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
