"use client";

import { MapPin, AlertCircle } from 'lucide-react';

const serviceGaps = [
    {
        id: 1,
        area: "West Long Beach",
        severity: "Critical",
        distance: 7.2,
        population: 12400,
        recommendation: "Place new QR code at Bixby Park. Consider expanding PATH territory."
    },
    {
        id: 2,
        area: "North Long Beach (East)",
        severity: "Moderate",
        distance: 5.8,
        population: 8900,
        recommendation: "Add QR location at Michelle Obama Library."
    },
    {
        id: 3,
        area: "Signal Hill Border",
        severity: "Low",
        distance: 4.1,
        population: 3200,
        recommendation: "Monitor. May need coverage if intake increases."
    }
];

export default function ServiceGapsPage() {
    return (
        <div className="min-h-screen bg-[var(--background)] p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-black mb-2">Service Gap Analysis</h1>
                    <p className="text-[var(--text-muted)]">Identify underserved areas and optimize service coverage</p>
                </div>

                <div className="grid gap-6">
                    {serviceGaps.map((gap) => (
                        <div key={gap.id} className="nexus-card bg-[var(--surface)] p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start gap-3">
                                    <MapPin className="text-[var(--primary)] mt-1" size={24} />
                                    <div>
                                        <h3 className="font-black text-xl mb-1">{gap.area}</h3>
                                        <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
                                            <span>Population: {gap.population.toLocaleString()}</span>
                                            <span>Distance to service: {gap.distance} miles</span>
                                        </div>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${gap.severity === 'Critical' ? 'bg-red-500/10 text-red-500' :
                                        gap.severity === 'Moderate' ? 'bg-orange-500/10 text-orange-500' :
                                            'bg-yellow-500/10 text-yellow-500'
                                    }`}>
                                    {gap.severity}
                                </span>
                            </div>

                            <div className="p-4 bg-[var(--background)] rounded-xl">
                                <div className="flex items-start gap-2">
                                    <AlertCircle size={16} className="text-[var(--primary)] mt-0.5" />
                                    <div>
                                        <div className="text-xs text-[var(--text-muted)] mb-1">Recommendation</div>
                                        <div className="text-sm font-bold">{gap.recommendation}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="nexus-card bg-[var(--surface)] p-6 mt-6">
                    <h2 className="text-xl font-black mb-4">Coverage Optimization</h2>
                    <div className="grid grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-[var(--background)] rounded-xl">
                            <div className="text-3xl font-black text-[var(--primary)] mb-2">3</div>
                            <div className="text-sm text-[var(--text-muted)]">Service Gaps Identified</div>
                        </div>
                        <div className="text-center p-4 bg-[var(--background)] rounded-xl">
                            <div className="text-3xl font-black text-[var(--primary)] mb-2">24.5K</div>
                            <div className="text-sm text-[var(--text-muted)]">People in Underserved Areas</div>
                        </div>
                        <div className="text-center p-4 bg-[var(--background)] rounded-xl">
                            <div className="text-3xl font-black text-[var(--primary)] mb-2">87%</div>
                            <div className="text-sm text-[var(--text-muted)]">Current Coverage Rate</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
