"use client"

import { useState, useEffect } from "react"
import { MetricCard } from "@/components/ui/MetricCard"
import { CityMapView } from "@/components/maps/CityMapView"
import AIStrategicAdvisor from "@/components/city/AIStrategicAdvisor"
import { formatCurrency, formatPercent } from "@/lib/utils"
import { BarChart3, Map, MessageCircle, FileText } from 'lucide-react'

interface VendorPerformance {
  id: number
  name: string
  metrics: {
    total_clients: number
    housed_count: number
    housing_rate: number
    avg_exit_income: number
    avg_days_to_housing: number
  }
}

export default function EnhancedCityDashboard() {
  const [vendors, setVendors] = useState<VendorPerformance[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/analytics/vendor-performance`)
      .then(r => r.json())
      .then(data => {
        setVendors(data.vendors)
        setLoading(false)
      })
  }, [])

  const territories = vendors.map(v => ({
    vendor_id: v.id,
    vendor_name: v.name,
    center: { lat: 33.77 + (Math.random() - 0.5) * 0.05, lng: -118.19 + (Math.random() - 0.5) * 0.05 },
    radius: 2000,
    color: v.metrics.housing_rate > 0.3 ? "#10B981" : v.metrics.housing_rate > 0.2 ? "#F59E0B" : "#EF4444",
    performance: {
      housing_rate: v.metrics.housing_rate,
      cost_per_outcome: 50000,
      efficiency_score: v.metrics.housing_rate * 100,
    },
  }))

  const qrLocations = [
    { id: "lb-mlk", name: "MLK Park", lat: 33.7866, lng: -118.1589, scan_count: 89, conversion_rate: 0.75 },
    { id: "lb-beach", name: "Beach Shelter", lat: 33.7701, lng: -118.1937, scan_count: 67, conversion_rate: 0.82 },
  ]

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'map', label: 'Geographic Intelligence', icon: Map },
    { id: 'ai-advisor', label: 'AI Strategic Advisor', icon: MessageCircle },
    { id: 'reports', label: 'Reports', icon: FileText }
  ]

  return (
    <div data-theme="layer8" className="min-h-screen bg-slate-950 text-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-bold tracking-tight">Layer 8 Analytics</h1>
          <p className="text-slate-400 mt-2">City Administrator Dashboard • Vendor Performance Intelligence</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard label="Total Clients" value={vendors.reduce((sum, v) => sum + v.metrics.total_clients, 0)} />
          <MetricCard
            label="Housed This Month"
            value={vendors.reduce((sum, v) => sum + v.metrics.housed_count, 0)}
            trend={{ value: 12, direction: "up" }}
            status="positive"
          />
          <MetricCard
            label="Avg Housing Rate"
            value={formatPercent(vendors.reduce((sum, v) => sum + v.metrics.housing_rate, 0) / (vendors.length || 1))}
            status="neutral"
          />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 gap-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-sm font-semibold transition-all relative flex items-center gap-2 ${
                activeTab === tab.id ? 'text-cyan-400' : 'text-slate-400'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-400 rounded-t-full"></div>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Vendor Comparison Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800">
                <h2 className="text-xl font-semibold">Vendor Performance Comparison</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Vendor</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Clients</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Housed</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Rate</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Avg Days</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendors.map(v => (
                      <tr key={v.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition">
                        <td className="px-6 py-4 text-sm font-medium">{v.name}</td>
                        <td className="px-6 py-4 text-sm text-right text-slate-300">{v.metrics.total_clients}</td>
                        <td className="px-6 py-4 text-sm text-right text-slate-300">{v.metrics.housed_count}</td>
                        <td className="px-6 py-4 text-sm text-right">
                          <span className={
                            v.metrics.housing_rate > 0.3 ? "text-green-400" :
                            v.metrics.housing_rate > 0.2 ? "text-yellow-400" : "text-red-400"
                          }>
                            {formatPercent(v.metrics.housing_rate)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-slate-300">
                          {v.metrics.avg_days_to_housing || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'map' && (
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Vendor Territories & QR Coverage</h2>
            <div className="h-[600px]">
              <CityMapView territories={territories} qrLocations={qrLocations} />
            </div>
          </div>
        )}

        {activeTab === 'ai-advisor' && (
          <AIStrategicAdvisor />
        )}

        {activeTab === 'reports' && (
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-12 text-center">
            <FileText className="text-slate-600 mx-auto mb-4" size={48} />
            <h3 className="text-xl font-bold mb-2">Compliance Reports</h3>
            <p className="text-slate-400 max-w-md mx-auto">
              Automated compliance and performance reports coming soon.
              This will include HUD reporting, quarterly performance summaries, and custom report generation.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
