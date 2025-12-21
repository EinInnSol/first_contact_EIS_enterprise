"use client";

import Link from 'next/link';
import {
  ShieldCheck,
  Map as MapIcon,
  Users,
  UserPlus,
  ChevronRight,
  BrainCircuit,
  LayoutDashboard
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-8 transition-colors duration-300">

      {/* Branding */}
      <div className="flex flex-col items-center mb-16 space-y-4 text-center">
        <div className="w-20 h-20 bg-[var(--primary)] rounded-2xl flex items-center justify-center shadow-2xl shadow-[var(--primary)]/20 animate-pulse">
          <BrainCircuit className="text-white" size={48} />
        </div>
        <div>
          <h1 className="text-4xl font-black tracking-tighter mb-2">FIRST CONTACT E.I.S.</h1>
          <p className="text-[var(--text-muted)] font-medium uppercase tracking-[0.2em] text-sm">Autonomous Human Services Nervous System</p>
        </div>
      </div>

      {/* Portal Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">

        {/* City Oversight */}
        <Link href="/dashboard/city" className="group">
          <div className="nexus-card-outlined h-full flex flex-col p-8 hover:scale-[1.02] transition-all cursor-pointer">
            <div className="p-3 bg-[var(--primary)]/10 text-[var(--primary)] rounded-xl w-fit mb-6">
              <LayoutDashboard size={32} />
            </div>
            <h2 className="text-xl font-bold mb-3 group-hover:text-[var(--primary)] transition-colors">City Oversight</h2>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed flex-1">
              Layer 8 analytics, vendor territories, and real-time ROI tracking for city leadership.
            </p>
            <div className="mt-8 flex items-center gap-2 text-xs font-bold text-[var(--primary)] uppercase tracking-widest">
              Enter Portal <ChevronRight size={14} />
            </div>
          </div>
        </Link>

        {/* Caseworker Dashboard */}
        <Link href="/dashboard/caseworker" className="group">
          <div className="nexus-card h-full flex flex-col p-8 border-2 border-[var(--border-crisp)] hover:border-[var(--primary)]/50 hover:scale-[1.02] transition-all cursor-pointer">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl w-fit mb-6">
              <Users size={32} />
            </div>
            <h2 className="text-xl font-bold mb-3 group-hover:text-blue-500 transition-colors">Caseworker Hub</h2>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed flex-1">
              AI-prioritized client lists, Care Plan generation, and one-click autonomous actions.
            </p>
            <div className="mt-8 flex items-center gap-2 text-xs font-bold text-blue-500 uppercase tracking-widest">
              Launch Tools <ChevronRight size={14} />
            </div>
          </div>
        </Link>

        {/* Public Intake */}
        <Link href="/intake" className="group">
          <div className="nexus-card h-full flex flex-col p-8 border-2 border-[var(--border-crisp)] hover:border-[var(--success)]/50 hover:scale-[1.02] transition-all cursor-pointer">
            <div className="p-3 bg-green-500/10 text-green-500 rounded-xl w-fit mb-6">
              <UserPlus size={32} />
            </div>
            <h2 className="text-xl font-bold mb-3 group-hover:text-green-500 transition-colors">Public Intake</h2>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed flex-1">
              Mobile-first self-onboarding for clients and outreach teams in the field.
            </p>
            <div className="mt-8 flex items-center gap-2 text-xs font-bold text-green-500 uppercase tracking-widest">
              Open Intake <ChevronRight size={14} />
            </div>
          </div>
        </Link>

      </div>

      {/* Footer Info */}
      <div className="mt-24 p-6 bg-[var(--surface-hover)]/30 rounded-2xl border border-[var(--border-crisp)] flex items-center gap-4 max-w-2xl text-center">
        <ShieldCheck size={24} className="text-[var(--text-muted)] shrink-0" />
        <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest leading-loose">
          Secure Multi-Tenant Environment | AI Audibles Active | Layer 8 Data Protection Enabled
        </p>
      </div>

    </div>
  );
}

