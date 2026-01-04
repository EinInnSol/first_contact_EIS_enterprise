"use client";

import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Check, AlertCircle, Navigation } from 'lucide-react';
import { appointmentSlots } from '../data/demoData';

interface AppointmentOrchestratorStepProps {
    onNext: () => void;
    onInteraction: () => void;
    interactionsCompleted: number;
    requiredInteractions: number;
}

export default function AppointmentOrchestratorStep({ onNext, onInteraction, interactionsCompleted, requiredInteractions }: AppointmentOrchestratorStepProps) {
    const [selectedAppointments, setSelectedAppointments] = useState<Set<number>>(new Set());
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [isOptimized, setIsOptimized] = useState(false);

    const handleSelectAppointment = (id: number) => {
        const newSelected = new Set(selectedAppointments);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
            if (!selectedAppointments.has(id)) {
                onInteraction();
            }
        }
        setSelectedAppointments(newSelected);
    };

    const handleOptimize = () => {
        setIsOptimizing(true);
        setTimeout(() => {
            setIsOptimizing(false);
            setIsOptimized(true);
        }, 2000);
    };

    const canContinue = interactionsCompleted >= requiredInteractions && isOptimized;

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
                <h1 className="text-4xl font-black tracking-tighter">
                    <span className="text-[var(--primary)]">Step 7:</span> Multi-Agency Appointment Orchestrator
                </h1>
                <p className="text-lg text-[var(--text-muted)]">
                    AI-powered scheduling across multiple agencies
                </p>
            </div>

            {/* Instructions */}
            <div className="nexus-card-outlined bg-gradient-to-br from-[var(--primary)]/10 to-purple-500/10 border-[var(--primary)] p-6">
                <h3 className="font-black mb-3 flex items-center gap-2">
                    <Calendar className="text-[var(--primary)]" size={24} />
                    Required Interaction
                </h3>
                <p className="text-sm mb-4">
                    Select <strong>{requiredInteractions} appointments</strong> and click "Optimize Schedule" to see AI-powered coordination in action.
                </p>
                <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-[var(--background)] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[var(--primary)] transition-all duration-300"
                            style={{ width: `${(Math.min(interactionsCompleted, requiredInteractions) / requiredInteractions) * 100}%` }}
                        />
                    </div>
                    <span className="text-sm font-bold">
                        {Math.min(interactionsCompleted, requiredInteractions)}/{requiredInteractions}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Appointment Selection */}
                <div className="space-y-4">
                    <h3 className="text-xl font-black">Required Appointments</h3>

                    {appointmentSlots.map((appt) => {
                        const isSelected = selectedAppointments.has(appt.id);

                        return (
                            <button
                                key={appt.id}
                                onClick={() => handleSelectAppointment(appt.id)}
                                className={`w-full text-left nexus-card-outlined p-5 transition-all ${isSelected
                                        ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                                        : 'hover:border-[var(--primary)]'
                                    } bg-[var(--surface)]`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={20} className="text-[var(--primary)]" />
                                        <span className="font-bold">{appt.agency}</span>
                                    </div>
                                    {isSelected && (
                                        <Check size={20} className="text-[var(--success)]" />
                                    )}
                                </div>

                                <h4 className="font-bold mb-2">{appt.service}</h4>

                                <div className="space-y-1 text-sm text-[var(--text-muted)]">
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} />
                                        <span>{appt.date} at {appt.time} ({appt.duration} min)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={14} />
                                        <span className="line-clamp-1">{appt.address}</span>
                                    </div>
                                </div>
                            </button>
                        );
                    })}

                    {selectedAppointments.size >= requiredInteractions && !isOptimized && (
                        <button
                            onClick={handleOptimize}
                            disabled={isOptimizing}
                            className="w-full nexus-button nexus-button-primary py-4 flex items-center justify-center gap-2"
                        >
                            {isOptimizing ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Optimizing Schedule...
                                </>
                            ) : (
                                <>
                                    <Navigation size={20} />
                                    Optimize Schedule
                                </>
                            )}
                        </button>
                    )}
                </div>

                {/* Optimization Results */}
                <div className="space-y-6">
                    {isOptimized ? (
                        <>
                            <div className="nexus-card-outlined bg-gradient-to-br from-[var(--success)]/10 to-green-500/5 border-[var(--success)] p-6 space-y-4 animate-in fade-in duration-500">
                                <div className="flex items-center gap-2 mb-2">
                                    <Check size={24} className="text-[var(--success)]" />
                                    <h3 className="text-2xl font-black">Schedule Optimized!</h3>
                                </div>

                                <div className="space-y-3">
                                    <div className="p-4 bg-[var(--surface)] rounded-xl">
                                        <div className="text-sm text-[var(--text-muted)] mb-1">Optimized Route</div>
                                        <div className="font-bold">DMV → Mental Health → Social Security</div>
                                        <div className="text-xs text-[var(--text-muted)] mt-2">
                                            Total travel time: 23 minutes (vs. 47 min unoptimized)
                                        </div>
                                    </div>

                                    <div className="p-4 bg-[var(--surface)] rounded-xl">
                                        <div className="text-sm text-[var(--text-muted)] mb-1">Conflict Resolution</div>
                                        <div className="font-bold text-[var(--success)]">No scheduling conflicts detected</div>
                                        <div className="text-xs text-[var(--text-muted)] mt-2">
                                            All appointments fit within available time slots
                                        </div>
                                    </div>

                                    <div className="p-4 bg-[var(--surface)] rounded-xl">
                                        <div className="text-sm text-[var(--text-muted)] mb-1">Transportation</div>
                                        <div className="font-bold">Bus passes provided for all routes</div>
                                        <div className="text-xs text-[var(--text-muted)] mt-2">
                                            Metro Blue Line + Bus 60 (estimated cost: $3.50)
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="nexus-card-outlined bg-[var(--surface)] p-6 space-y-4">
                                <h3 className="text-xl font-black">AI Optimization Benefits</h3>
                                <ul className="space-y-3 text-sm">
                                    <li className="flex items-start gap-2">
                                        <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                        <span><strong>51% reduction</strong> in travel time</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                        <span><strong>Zero conflicts</strong> with existing appointments</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                        <span><strong>Automated transportation</strong> coordination</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                        <span><strong>SMS reminders</strong> sent 24 hours before</span>
                                    </li>
                                </ul>
                            </div>
                        </>
                    ) : (
                        <div className="nexus-card-outlined bg-[var(--surface)] p-12 text-center">
                            <Calendar size={64} className="text-[var(--text-muted)] mx-auto mb-4 opacity-20" />
                            <p className="text-[var(--text-muted)]">
                                Select {requiredInteractions} appointments and click "Optimize Schedule"
                            </p>
                        </div>
                    )}

                    {/* Continue Button */}
                    <button
                        onClick={onNext}
                        disabled={!canContinue}
                        className={`w-full nexus-button py-4 ${canContinue
                                ? 'nexus-button-primary'
                                : 'opacity-50 cursor-not-allowed bg-[var(--surface-hover)] border border-[var(--border-crisp)]'
                            }`}
                    >
                        {canContinue
                            ? 'Continue to Google Maps →'
                            : 'Complete optimization first'
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}
