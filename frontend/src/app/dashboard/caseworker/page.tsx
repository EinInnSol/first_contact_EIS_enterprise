"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/ui/Sidebar';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { NeonButton } from '@/components/ui/NeonButton';
import {
    Users,
    Calendar,
    Search,
    Plus,
    MoreHorizontal,
    Clock,
    Sparkles,
    ArrowRight,
    ClipboardCheck,
    Zap
} from 'lucide-react';

export default function CaseworkerDashboard() {
    const router = useRouter();
    const clients = [
        { id: '1', name: 'John Doe', status: 'In Review', priority: 'High', lastAction: '2h ago', assigned: 'Housing Plan' },
        { id: '2', name: 'James Smith', status: 'Housed', priority: 'Low', lastAction: '1d ago', assigned: 'Stabilization' },
        { id: '3', name: 'Mary Johnson', status: 'Intake', priority: 'Medium', lastAction: '5m ago', assigned: 'ID Collection' },
        { id: '4', name: 'Robert Wilson', status: 'Pending', priority: 'High', lastAction: '1h ago', assigned: 'Mental Health Eval' },
        { id: '5', name: 'Patricia Brown', status: 'Active', priority: 'Medium', lastAction: '3h ago', assigned: 'Grant Application' },
    ];

    return (
        <div className="flex min-h-screen bg-start">
            <Sidebar role="caseworker" />

            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="h-16 border-b border-glass-border flex items-center justify-between px-8 bg-start-900/50 backdrop-blur-sm">
                    <div className="flex flex-col">
                        <h1 className="text-lg font-display font-bold uppercase tracking-widest text-white">OPERATIONAL COCKPIT</h1>
                        <span className="text-[10px] text-slate-500 font-mono">CASEWORKER ID: LB-ORCHESTRATOR-402</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan transition-colors" />
                            <input
                                type="text"
                                placeholder="PROBE CLIENT DATABASE..."
                                className="bg-black/40 border border-glass-border rounded-sm pl-10 pr-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan w-64 transition-all"
                            />
                        </div>
                        <NeonButton variant="cyan" size="sm" glow onClick={() => router.push('/intake')}>
                            <Plus className="w-4 h-4 mr-2" />
                            NEW INTAKE
                        </NeonButton>
                    </div>
                </header>

                {/* Dashboard Grid */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="grid grid-cols-12 gap-8">

                        {/* Left: Caseload Table */}
                        <div className="col-span-12 xl:col-span-8 space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="flex gap-4">
                                    <div className="px-4 py-1 bg-cyan text-black font-mono font-bold text-[10px] uppercase skew-x-[-15deg]">
                                        <span className="inline-block skew-x-[15deg]">ACTIVE CASELOAD (24)</span>
                                    </div>
                                    <div className="px-4 py-1 bg-white/5 border border-white/10 text-white font-mono font-bold text-[10px] uppercase skew-x-[-15deg] hover:bg-white/10 transition-all cursor-pointer">
                                        <span className="inline-block skew-x-[15deg]">FLAGGED (3)</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-slate-500" />
                                    <span className="text-[10px] text-slate-500 font-mono">LAST SCAN: JUST NOW</span>
                                </div>
                            </div>

                            <GlassPanel className="p-0 border-white/5">
                                <table className="table-neon">
                                    <thead>
                                        <tr>
                                            <th>Client Name</th>
                                            <th>Status</th>
                                            <th>Core Focus</th>
                                            <th>Last Sync</th>
                                            <th className="text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {clients.map((client) => (
                                            <tr key={client.id}>
                                                <td className="font-bold text-white">{client.name}</td>
                                                <td>
                                                    <span className={`badge ${client.status === 'Housed' ? 'badge-cyan' :
                                                        client.status === 'Intake' ? 'badge-orange' : 'badge-outline'
                                                        }`}>
                                                        {client.status}
                                                    </span>
                                                </td>
                                                <td className="text-slate-400 font-mono text-xs">{client.assigned}</td>
                                                <td className="text-slate-500 text-xs">{client.lastAction}</td>
                                                <td className="text-right">
                                                    <button className="p-2 hover:bg-cyan/10 rounded-sm transition-colors text-slate-400 hover:text-cyan">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </GlassPanel>

                            {/* HUD / Compliance Section */}
                            <div className="grid grid-cols-2 gap-6">
                                <GlassPanel className="p-6 border-cyan/20">
                                    <div className="flex items-center gap-3 mb-6">
                                        <ClipboardCheck className="w-5 h-5 text-cyan" />
                                        <h3 className="text-sm font-bold uppercase tracking-widest">Compliance Engine</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-xs font-mono">
                                            <span className="text-slate-400">HUD APR Progress (Q4)</span>
                                            <span className="text-cyan">88%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-white/5 rounded-full">
                                            <div className="h-full bg-cyan shadow-[0_0_10px_#00F0FF]" style={{ width: '88%' }} />
                                        </div>
                                        <div className="flex gap-2 pt-2">
                                            <NeonButton variant="outline" size="sm" fullWidth className="text-[10px]" onClick={() => router.push('/dashboard/caseworker/reports')}>
                                                Audit Data Quality
                                            </NeonButton>
                                            <NeonButton variant="cyan" size="sm" fullWidth className="text-[10px]" onClick={() => router.push('/dashboard/caseworker/reports')}>
                                                Generate HUD Report
                                            </NeonButton>
                                        </div>
                                    </div>
                                </GlassPanel>

                                <GlassPanel className="p-6 border-slate-700">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Calendar className="w-5 h-5 text-slate-400" />
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Upcoming Sessions</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {[
                                            { time: '14:30', name: 'Identity Workshop', type: 'Bureau' },
                                            { time: '16:00', name: 'Housing Search', type: 'Site A' },
                                        ].map((session, i) => (
                                            <div key={i} className="flex items-center justify-between p-2 bg-white/5 border border-white/5 rounded-sm">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs font-mono text-cyan">{session.time}</span>
                                                    <span className="text-xs text-white">{session.name}</span>
                                                </div>
                                                <span className="text-[10px] text-slate-500 font-mono uppercase">{session.type}</span>
                                            </div>
                                        ))}
                                    </div>
                                </GlassPanel>
                            </div>
                        </div>

                        {/* Right: AI "Audible" Panel */}
                        <div className="col-span-12 xl:col-span-4 space-y-6">
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-cyan fill-cyan" />
                                <h3 className="text-xs font-bold uppercase tracking-widest text-cyan">AI Orchestrator (Live Feed)</h3>
                            </div>

                            <div className="space-y-4">
                                <GlassPanel className="border-cyan/40 shadow-[0_0_20px_rgba(0,240,255,0.05)]">
                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-sm bg-cyan/20 border border-cyan flex items-center justify-center shrink-0">
                                            <Sparkles className="w-4 h-4 text-cyan animate-pulse" />
                                        </div>
                                        <div className="space-y-3">
                                            <div className="text-[10px] font-bold text-cyan uppercase tracking-widest">Recommended Audible</div>
                                            <p className="text-xs text-slate-300 leading-relaxed font-mono">
                                                "Client <span className="text-white">John Doe</span> missed transport to DMV. Reassigning 14:00 slot to <span className="text-white">Robert Wilson</span> for ID collection. Optimizing path..."
                                            </p>
                                            <div className="flex gap-2">
                                                <NeonButton variant="cyan" size="sm" className="h-8 text-[10px]" glow>
                                                    APPROVE & NOTIFY
                                                </NeonButton>
                                                <NeonButton variant="outline" size="sm" className="h-8 text-[10px]">
                                                    DISMISS
                                                </NeonButton>
                                            </div>
                                        </div>
                                    </div>
                                </GlassPanel>

                                <GlassPanel className="border-orange/30">
                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-sm bg-orange/20 border border-orange flex items-center justify-center shrink-0">
                                            <Zap className="w-4 h-4 text-orange" />
                                        </div>
                                        <div className="space-y-3">
                                            <div className="text-[10px] font-bold text-orange uppercase tracking-widest">Efficiency Insight</div>
                                            <p className="text-xs text-slate-300 leading-relaxed font-mono">
                                                "Your average 'Time to Document' for Sector LB is 4 days above target. AI has drafted 5 missing SSA-1099 requests automatically."
                                            </p>
                                            <button className="flex items-center gap-2 text-[10px] font-bold text-white hover:text-cyan transition-colors uppercase tracking-widest">
                                                Review drafted requests
                                                <ArrowRight className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </GlassPanel>

                                {/* Automation Log */}
                                <GlassPanel className="p-4 bg-start-900 shadow-inner">
                                    <div className="text-[9px] font-bold text-slate-600 mb-3 uppercase tracking-[0.2em]">Automated Intelligence Log</div>
                                    <div className="space-y-2 font-mono text-[9px]">
                                        <div className="flex gap-2">
                                            <span className="text-cyan">[11:42]</span>
                                            <span className="text-slate-400">Syncing HMIS data for Org 402... </span>
                                            <span className="text-cyan">OK</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="text-cyan">[11:40]</span>
                                            <span className="text-slate-400">Verifying SSN for Client Wilson... </span>
                                            <span className="text-orange">FLAGGED</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="text-cyan">[11:38]</span>
                                            <span className="text-slate-400">Optimizing tomorrow's route for Team A... </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="text-cyan">[11:35]</span>
                                            <span className="text-slate-400">Scanning geofence: Sector LB-4... </span>
                                        </div>
                                    </div>
                                </GlassPanel>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
