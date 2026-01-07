"use client";

import React from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Map,
  Users,
  QrCode,
  ChevronRight,
  Zap,
  Globe,
  Database,
  Lock
} from 'lucide-react';
import { NeonButton } from '@/components/ui/NeonButton';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { motion } from 'framer-motion';
import { AgreementOverlay } from '@/components/AgreementOverlay';
import { PresentationOverlay } from '@/components/PresentationOverlay';
import { useState } from 'react';

export default function Home() {
  const [showPresentation, setShowPresentation] = useState(false);

  return (
    <div className="min-h-screen bg-start text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <AgreementOverlay />
      <PresentationOverlay isOpen={showPresentation} onClose={() => setShowPresentation(false)} />

      {/* Background Animated Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-cyan/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-900/10 rounded-full blur-[150px]" />

        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <main className="max-w-6xl w-full z-10 space-y-20">

        {/* Header Section */}
        <header className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-cyan/20 bg-cyan/5 rounded-full">
              <Zap className="w-4 h-4 text-cyan fill-cyan/20" />
              <span className="text-[10px] font-mono font-bold text-cyan uppercase tracking-[0.3em]">Version 2.0 Oracle Active</span>
            </div>

            {/* Premium Briefing Button */}
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0, 240, 255, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPresentation(true)}
              className="mt-4 px-8 py-4 bg-cyan/10 backdrop-blur-md border border-cyan/50 rounded-xl text-cyan font-bold text-sm hover:bg-cyan/20 transition-all flex items-center gap-3 shadow-[0_0_15px_rgba(0,240,255,0.1)] ring-1 ring-cyan/30"
            >
              <Database className="w-5 h-5" />
              <span>Start System Briefing Sequence</span>
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase italic">
              First Contact <span className="text-cyan text-glow">E.I.S.</span>
            </h1>
            <p className="text-slate-400 font-mono text-sm max-w-2xl mx-auto uppercase tracking-widest">
              Autonomous Intelligence & Coordination Layer for Homeless Services Ecosystems
            </p>
          </motion.div>
        </header>

        {/* Portal Portal Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* City Oversight */}
          <Link href="/dashboard/city">
            <GlassPanel className="h-full border-cyan/20 hover:border-cyan/50 transition-all group flex flex-col" hoverEffect>
              <div className="p-4 bg-cyan/10 border border-cyan/30 w-fit rounded-sm mb-6 group-hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all">
                <Globe className="w-8 h-8 text-cyan" />
              </div>
              <h2 className="text-xl font-bold mb-3 uppercase tracking-wider text-white">City Command</h2>
              <p className="text-sm text-slate-400 leading-relaxed font-mono flex-1 mb-8">
                Layer 8 analytics, vendor territories, and real-time strategic intelligence. "God Mode" visibility.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-bold text-cyan uppercase tracking-[0.2em]">
                Initialize Portal <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </GlassPanel>
          </Link>

          {/* Caseworker Hub */}
          <Link href="/dashboard/caseworker">
            <GlassPanel className="h-full border-white/10 hover:border-cyan/50 transition-all group flex flex-col" hoverEffect>
              <div className="p-4 bg-white/5 border border-white/10 w-fit rounded-sm mb-6 group-hover:bg-cyan/10 group-hover:border-cyan/30 transition-all">
                <Users className="w-8 h-8 text-slate-400 group-hover:text-cyan transition-all" />
              </div>
              <h2 className="text-xl font-bold mb-3 uppercase tracking-wider text-white">Operational Cockpit</h2>
              <p className="text-sm text-slate-400 leading-relaxed font-mono flex-1 mb-8">
                Autonomous case management, AI audibles, and one-click compliance reporting for high-speed field ops.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 group-hover:text-cyan uppercase tracking-[0.2em] transition-all">
                Launch Tools <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </GlassPanel>
          </Link>

          {/* Public Intake (Client Portal) */}
          <Link href="/client">
            <GlassPanel className="h-full border-white/10 hover:border-cyan/50 transition-all group flex flex-col" hoverEffect>
              <div className="p-4 bg-white/5 border border-white/10 w-fit rounded-sm mb-6 group-hover:bg-cyan/10 group-hover:border-cyan/30 transition-all">
                <QrCode className="w-8 h-8 text-slate-400 group-hover:text-cyan transition-all" />
              </div>
              <h2 className="text-xl font-bold mb-3 uppercase tracking-wider text-white">The Digital Key</h2>
              <p className="text-sm text-slate-400 leading-relaxed font-mono flex-1 mb-8">
                Instant identity-based intake and geofenced service routing for clients in the physical world.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 group-hover:text-cyan uppercase tracking-[0.2em] transition-all">
                Open Intake <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </GlassPanel>
          </Link>

        </div>

        {/* Security Footer Section */}
        <footer className="pt-12 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-8 items-center opacity-60">
          <div className="flex items-center gap-3">
            <Lock className="w-4 h-4 text-slate-500" />
            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">AES-256 Multi-Tenant Isolation</span>
          </div>
          <div className="flex items-center gap-3 justify-center">
            <Database className="w-4 h-4 text-slate-500" />
            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">Nexus-V2 Core / Distributed Compute</span>
          </div>
          <div className="flex items-center gap-3 justify-end">
            <ShieldAlert className="w-4 h-4 text-slate-500" />
            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">Authenticated City Access Only</span>
          </div>
        </footer>

      </main>
    </div>
  );
}
