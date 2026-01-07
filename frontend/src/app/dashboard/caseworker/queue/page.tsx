"use client";

import { Clock, User, MapPin } from 'lucide-react';

const intakeQueue = [
    { id: 1, name: "Sarah Martinez", location: "MLK Park", time: "2 min ago", priority: "High", viSpdat: 8 },
    { id: 2, name: "Michael Chen", location: "Beach Shelter", time: "5 min ago", priority: "Medium", viSpdat: 6 },
    { id: 3, name: "Jennifer Williams", location: "Downtown Library", time: "12 min ago", priority: "High", viSpdat: 9 },
    { id: 4, name: "Robert Davis", location: "Atlantic & 6th", time: "18 min ago", priority: "Low", viSpdat: 4 },
];

export default function IntakeQueuePage() {
    return (
        <div className="min-h-screen bg-[var(--background)] p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-black mb-2">Intake Queue</h1>
                    <p className="text-[var(--text-muted)]">New client check-ins awaiting assignment</p>
                </div>

                <div className="grid gap-4">
                    {intakeQueue.map((client) => (
                        <div key={client.id} className="nexus-card bg-[var(--surface)] p-6 hover:border-[var(--primary)] transition-all cursor-pointer">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
                                        <User className="text-[var(--primary)]" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-lg mb-1">{client.name}</h3>
                                        <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
                                            <span className="flex items-center gap-1">
                                                <MapPin size={14} />
                                                {client.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock size={14} />
                                                {client.time}
                                            </span>
                                            <span>VI-SPDAT: {client.viSpdat}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${client.priority === 'High' ? 'bg-red-500/10 text-red-500' :
                                            client.priority === 'Medium' ? 'bg-orange-500/10 text-orange-500' :
                                                'bg-blue-500/10 text-blue-500'
                                        }`}>
                                        {client.priority} Priority
                                    </span>
                                    <button className="nexus-button nexus-button-primary px-6">
                                        Assign to Me
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {intakeQueue.length === 0 && (
                    <div className="text-center py-12">
                        <User size={64} className="mx-auto mb-4 text-[var(--text-muted)] opacity-20" />
                        <p className="text-[var(--text-muted)]">No pending intakes</p>
                    </div>
                )}
            </div>
        </div>
    );
}
