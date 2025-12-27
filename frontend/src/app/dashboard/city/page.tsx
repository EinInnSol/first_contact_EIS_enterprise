"use client";

import React from 'react';
import { Sidebar } from '@/components/ui/Sidebar';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { NeonButton } from '@/components/ui/NeonButton';
import { StrategicMap } from '@/components/dashboard/StrategicMap';
import {
  TrendingUp,
  Users,
  Home,
  AlertCircle,
  Download,
  Filter
} from 'lucide-react';

export default function CityDashboard() {
  return (
    <div className="flex min-h-screen bg-start selection:bg-cyan/30">
      {/* Sidebar Navigation */}
      <Sidebar role="city" />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* Top Intelligence Bar */}
        <header className="h-16 border-b border-glass-border flex items-center justify-between px-8 bg-start-900/50 backdrop-blur-sm z-30">
          <div className="flex flex-col">
            <h1 className="text-lg font-display font-bold uppercase tracking-widest text-white">STRATEGIC COMMAND</h1>
            <span className="text-[10px] text-slate-500 font-mono">SECTOR: LONG BEACH / REGION II</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-orange/10 border border-orange/30 rounded-full">
              <AlertCircle className="w-3 h-3 text-orange" />
              <span className="text-[10px] font-bold text-orange uppercase tracking-wider">3 Urgent Alerts</span>
            </div>
            <div className="h-8 w-[1px] bg-glass-border mx-2" />
            <NeonButton variant="outline" size="sm">
              <Download className="w-3 h-3 mr-2" />
              Export Intelligence
            </NeonButton>
            <NeonButton variant="cyan" size="sm" glow>
              <Filter className="w-3 h-3 mr-2" />
              Active Filters
            </NeonButton>
          </div>
        </header>

        {/* Dynamic Map & Overlays Container */}
        <section className="flex-1 relative">

          {/* THE MAP (Centered Hero) */}
          <div className="absolute inset-0">
            <StrategicMap />
          </div>

          {/* LEFT OVERLAY: Performance Feed */}
          <div className="absolute top-6 left-6 w-80 z-20 space-y-4">
            <GlassPanel className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-cyan">Vendor Performance</h3>
                <TrendingUp className="w-4 h-4 text-cyan" />
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Pathways LB', rate: '84%', trend: '+5%' },
                  { name: 'Urban Outreach', rate: '72%', trend: '-2%' },
                  { name: 'Project Home', rate: '68%', trend: '+12%' },
                ].map((vendor) => (
                  <div key={vendor.name} className="flex flex-col gap-1 p-2 bg-white/5 border border-white/10 rounded-sm hover:bg-white/10 transition-colors">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-slate-300">{vendor.name}</span>
                      <span className="text-xs font-mono font-bold text-white">{vendor.rate}</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan shadow-[0_0_5px_#00F0FF]"
                        style={{ width: vendor.rate }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <NeonButton fullWidth variant="outline" size="sm">
                  Full Analytics Report
                </NeonButton>
              </div>
            </GlassPanel>

            <GlassPanel className="p-4 border-orange/30 bg-orange/5">
              <div className="flex items-center gap-2 mb-2 text-orange">
                <ShieldAlert className="w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-widest">Predictive Bottleneck</h3>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                <span className="text-orange font-bold">WARNING:</span> Shelter capacity in Sector B-4 projected to hit 100% in 12 days.
              </p>
              <NeonButton fullWidth variant="orange" size="sm">
                View Advisory Actions
              </NeonButton>
            </GlassPanel>
          </div>

          {/* RIGHT OVERLAY: Rapid Intelligence */}
          <div className="absolute top-6 right-6 w-80 z-20 space-y-4 text-right">
            <div className="flex flex-col gap-3">
              <GlassPanel className="p-4">
                <div className="flex items-center justify-end gap-2 mb-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Housed</span>
                  <Home className="w-3 h-3 text-cyan" />
                </div>
                <div className="text-3xl font-mono font-bold text-white">1,248</div>
                <div className="text-[10px] font-bold text-cyan flex justify-end items-center gap-1 mt-1">
                  <span>+14% MONTHLY GROWTH</span>
                </div>
              </GlassPanel>

              <GlassPanel className="p-4">
                <div className="flex items-center justify-end gap-2 mb-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Intake</span>
                  <Users className="w-3 h-3 text-cyan" />
                </div>
                <div className="text-3xl font-mono font-bold text-white">4,812</div>
                <div className="text-[10px] font-bold text-orange flex justify-end items-center gap-1 mt-1">
                  <span>STABLE VELOCITY</span>
                </div>
              </GlassPanel>
            </div>

            <GlassPanel className="p-4 !text-left border-cyan/40 shadow-[0_0_20px_rgba(0,240,255,0.1)]">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-cyan fill-cyan/20" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-cyan">AI Strategic Advice</h3>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300 mb-4 italic">
                "Based on current trends, reallocating 15% of the Sector II outreach budget to the 'Identity Document Automation' grant could reduce housing delay by 8 days."
              </p>
              <NeonButton fullWidth size="sm" glow>
                Ask Strategic Question
              </NeonButton>
            </GlassPanel>
          </div>

          {/* BOTTOM BAR: Coordinate Display */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
            <div className="bg-start-900/80 backdrop-blur-xl border border-white/10 px-6 py-2 rounded-full flex gap-8 items-center shadow-2xl">
              <div className="flex flex-col items-center">
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">System Status</span>
                <span className="text-[10px] font-mono text-cyan font-bold tracking-widest">OPERATIONAL</span>
              </div>
              <div className="h-6 w-[1px] bg-white/10" />
              <div className="flex flex-col items-center">
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Data Latency</span>
                <span className="text-[10px] font-mono text-white font-bold tracking-widest">42MS</span>
              </div>
              <div className="h-6 w-[1px] bg-white/10" />
              <div className="flex flex-col items-center">
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">AI Engine</span>
                <span className="text-[10px] font-mono text-white font-bold tracking-widest">CLAUDE-3.5 V-SONNET</span>
              </div>
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}

// Sub-component icon imports
function ShieldAlert(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  );
}

function Zap(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
