"use client";

import React, { useState } from 'react';
import {
  Users,
  Map as MapIcon,
  Layout,
  TrendingUp,
  AlertCircle,
  Bell,
  Search,
  Settings,
  Sun,
  Moon,
  ChevronRight,
  MoreVertical
} from 'lucide-react';

export default function CityDashboard() {
  const [theme, setTheme] = useState('dark');
  const [activeLayers, setActiveLayers] = useState(['territories', 'scans']);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const toggleLayer = (layer: string) => {
    setActiveLayers(prev =>
      prev.includes(layer) ? prev.filter(l => l !== layer) : [...prev, layer]
    );
  };

  return (
    <div className="min-h-screen flex transition-colors duration-300">
      {/* Sidebar - Nexus Navigation */}
      <aside className="w-64 border-r border-[var(--border-crisp)] bg-[var(--surface)] flex flex-col">
        <div className="p-6 border-b border-[var(--border-crisp)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">F</span>
            </div>
            <span className="font-bold text-lg tracking-tight">First Contact</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {[
            { icon: Layout, label: 'Dashboard', active: true },
            { icon: Users, label: 'Vendors', active: false },
            { icon: AlertCircle, label: 'Audibles', active: false },
            { icon: TrendingUp, label: 'Analytics', active: false },
            { icon: MapIcon, label: 'Territories', active: false },
          ].map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${item.active
                  ? 'bg-[var(--primary-glow)] text-[var(--primary)] border border-[var(--primary)]/20'
                  : 'text-[var(--text-muted)] hover:bg-[var(--surface-hover)]'
                }`}
            >
              <item.icon size={20} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[var(--border-crisp)]">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-[var(--text-muted)] hover:bg-[var(--surface-hover)] rounded-lg transition-all">
            <Settings size={20} />
            <span className="font-medium text-sm">Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-[var(--border-crisp)] bg-[var(--surface)] flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[var(--text-muted)]">Oversight</span>
            <ChevronRight size={14} className="text-[var(--text-muted)]" />
            <span className="font-semibold">City Dashboard</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
              <input
                type="text"
                placeholder="Search analytics..."
                className="pl-10 pr-4 py-2 bg-[var(--background)] border border-[var(--border-crisp)] rounded-full text-sm outline-none focus:border-[var(--primary)] transition-all w-64"
              />
            </div>

            <button onClick={toggleTheme} className="p-2 text-[var(--text-muted)] hover:bg-[var(--surface-hover)] rounded-full transition-all">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button className="p-2 text-[var(--text-muted)] hover:bg-[var(--surface-hover)] rounded-full transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--danger)] rounded-full border-2 border-[var(--surface)]"></span>
            </button>
            <div className="w-8 h-8 bg-[var(--surface-hover)] rounded-full overflow-hidden border border-[var(--border-crisp)]">
              <img src="/api/placeholder/32/32" alt="Avatar" />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-[var(--background)]">
          <div className="max-w-7xl mx-auto space-y-8">

            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Layer 8 Efficiency', value: '87.4%', change: '+2.1%', up: true },
                { label: 'Avg Cost/Outcome', value: '$12,450', change: '-$402', up: false },
                { label: 'Active Intakes', value: '1,245', change: '+48', up: true },
                { label: 'Time Saved (AI)', value: '3,840h', change: '92%', up: true },
              ].map((stat) => (
                <div key={stat.label} className="nexus-card">
                  <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">{stat.label}</div>
                  <div className="flex items-end justify-between">
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className={`text-xs font-bold px-2 py-1 rounded ${stat.up ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                      }`}>
                      {stat.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Central Area: Map & Audibles */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Tactical Map Card */}
              <div className="lg:col-span-2 nexus-card-outlined h-[500px] flex flex-col p-2 relative overflow-hidden">
                <div className="absolute top-6 left-6 z-10 flex gap-2">
                  {['territories', 'scans', 'heatmaps'].map(layer => (
                    <button
                      key={layer}
                      onClick={() => toggleLayer(layer)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${activeLayers.includes(layer)
                          ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                          : 'bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border-crisp)]'
                        }`}
                    >
                      {layer.charAt(0).toUpperCase() + layer.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Mock Map Background */}
                <div className="flex-1 bg-slate-900 rounded-lg relative overflow-hidden">
                  <div className="absolute inset-0 opacity-40 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/-118.1937,33.7701,11,0/1200x800?access_token=pk.xxx')] bg-cover"></div>
                  {/* Territories & Pins would go here */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white/20 font-bold text-4xl transform -rotate-45">TACTICAL OVERLAY</div>
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between border-t border-[var(--border-crisp)] mt-2">
                  <div className="text-sm font-semibold">Active Monitoring: 12 Vendors</div>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                      <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span> Housed
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                      <span className="w-2 h-2 rounded-full bg-[var(--warning)]"></span> Intakes
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Audibles (To-Do List) */}
              <div className="nexus-card flex flex-col p-0 overflow-hidden h-[500px]">
                <div className="p-6 border-b border-[var(--border-crisp)] flex items-center justify-between bg-[var(--surface-hover)]/30">
                  <h3 className="font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full animate-pulse bg-[var(--primary)]"></span>
                    AI Audibles
                  </h3>
                  <div className="text-[var(--text-muted)]"><MoreVertical size={16} /></div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {[
                    { type: 'SWAP', label: 'Approve Appointment Swap', client: 'Sarah Jenkins', priority: 'High', time: '2m ago' },
                    { type: 'CARE', label: 'Generate Care Plan', client: 'Michael Chen', priority: 'Medium', time: '15m ago' },
                    { type: 'ALERT', label: 'Outreach Dispatch', client: 'Downtown Sector', priority: 'Urgent', time: '1h ago' },
                    { type: 'BENEFIT', label: 'Review Benefit Eligibility', client: 'Robert T.', priority: 'Low', time: '3h ago' },
                  ].map((task, i) => (
                    <div key={i} className="group p-4 rounded-xl border border-[var(--border-crisp)] hover:border-[var(--primary)]/30 hover:bg-[var(--primary-glow)] transition-all cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${task.priority === 'Urgent' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                            task.priority === 'High' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                              'bg-blue-500/10 text-blue-500 border-blue-500/20'
                          }`}>
                          {task.priority.toUpperCase()}
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)]">{task.time}</span>
                      </div>
                      <div className="font-semibold text-sm group-hover:text-[var(--primary)] transition-colors">{task.label}</div>
                      <div className="text-xs text-[var(--text-muted)] mt-1">{task.client}</div>
                      <button className="mt-3 w-full py-2 bg-[var(--surface)] border border-[var(--border-crisp)] group-hover:border-[var(--primary)]/50 rounded-lg text-xs font-bold transition-all">
                        Review Audible
                      </button>
                    </div>
                  ))}
                </div>

                <button className="m-4 py-3 bg-[var(--primary)] text-white font-bold rounded-lg text-sm shadow-lg shadow-[var(--primary)]/20 hover:scale-[1.02] transition-all">
                  View All Actions
                </button>
              </div>

            </div>

            {/* Bottom Insight Row */}
            <div className="nexus-card bg-gradient-to-r from-[var(--primary)]/5 to-transparent border-l-4 border-l-[var(--primary)]">
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-[var(--primary)]/10 rounded-xl text-[var(--primary)]">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1 italic">Layer 8 Insight: ROI Opportunity</h4>
                  <p className="text-[var(--text-muted)] text-sm max-w-3xl leading-relaxed">
                    Vendor 'Pathways LB' is currently delivering outcomes at **34% lower cost** than the city average while maintaining an 82% retention rate.
                    AI Suggestion: Reallocate 15% of underperforming 'Sector B' funds to expand Pathways capacity. Estimated impact: +45 housing placements annually.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
