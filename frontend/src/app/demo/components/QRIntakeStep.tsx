"use client";

import React, { useState } from 'react';
import { QrCode, MapPin, Check, Smartphone, User } from 'lucide-react';

interface QRIntakeStepProps {
    onNext: () => void;
    onInteraction: () => void;
    interactionsCompleted: number;
    requiredInteractions: number;
}

export default function QRIntakeStep({ onNext, onInteraction }: QRIntakeStepProps) {
    const [stage, setStage] = useState<'scan' | 'form' | 'complete'>('scan');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        age: '',
    });

    const handleScan = () => {
        setTimeout(() => setStage('form'), 1000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStage('complete');
        onInteraction(); // Track form submission
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
                <h1 className="text-4xl font-black tracking-tighter">
                    <span className="text-[var(--primary)]">Layer 1:</span> QR Code Intake
                </h1>
                <p className="text-lg text-[var(--text-muted)]">
                    Instant client intake with automatic vendor assignment
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Mobile Simulation */}
                <div className="flex justify-center">
                    <div className="w-[320px] h-[640px] bg-[var(--background)] border-8 border-[var(--surface)] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col">
                        {/* Phone Header */}
                        <div className="bg-[var(--surface)] px-6 py-4 border-b border-[var(--border-crisp)]">
                            <div className="flex items-center gap-2">
                                <Smartphone size={20} className="text-[var(--primary)]" />
                                <span className="font-bold text-sm">First Contact Mobile</span>
                            </div>
                        </div>

                        {/* Phone Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {stage === 'scan' && (
                                <div className="space-y-6 animate-in fade-in duration-500">
                                    <div className="text-center space-y-3">
                                        <h2 className="text-xl font-black">Scan QR Code</h2>
                                        <p className="text-sm text-[var(--text-muted)]">
                                            Point your camera at the QR code
                                        </p>
                                    </div>

                                    <div className="bg-[var(--surface)] p-8 rounded-2xl border-2 border-dashed border-[var(--border-crisp)] flex items-center justify-center">
                                        <QrCode size={120} className="text-[var(--primary)]" />
                                    </div>

                                    <button
                                        onClick={handleScan}
                                        className="w-full nexus-button nexus-button-primary py-3"
                                    >
                                        Simulate Scan
                                    </button>

                                    <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                                        <MapPin size={14} />
                                        <span>Location: MLK Park, Long Beach</span>
                                    </div>
                                </div>
                            )}

                            {stage === 'form' && (
                                <div className="space-y-4 animate-in fade-in duration-500">
                                    <div className="text-center space-y-2">
                                        <div className="w-12 h-12 rounded-full bg-[var(--success)]/10 flex items-center justify-center mx-auto">
                                            <Check className="text-[var(--success)]" size={24} />
                                        </div>
                                        <h2 className="text-lg font-black">QR Code Scanned!</h2>
                                        <p className="text-xs text-[var(--text-muted)]">
                                            Auto-assigned to PATH
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-3">
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-widest block mb-1">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border-crisp)] rounded-lg text-sm"
                                                placeholder="John"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-widest block mb-1">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border-crisp)] rounded-lg text-sm"
                                                placeholder="Doe"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-widest block mb-1">
                                                Age
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.age}
                                                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                                className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border-crisp)] rounded-lg text-sm"
                                                placeholder="42"
                                                required
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full nexus-button nexus-button-primary py-3 text-sm"
                                        >
                                            Complete Intake
                                        </button>
                                    </form>
                                </div>
                            )}

                            {stage === 'complete' && (
                                <div className="space-y-6 animate-in fade-in duration-500 text-center">
                                    <div className="w-20 h-20 rounded-full bg-[var(--success)]/10 flex items-center justify-center mx-auto">
                                        <Check className="text-[var(--success)]" size={40} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black mb-2">Intake Complete!</h2>
                                        <p className="text-sm text-[var(--text-muted)]">
                                            Client assigned to PATH caseworker
                                        </p>
                                    </div>

                                    <div className="bg-[var(--surface)] p-4 rounded-xl space-y-2 text-left">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[var(--text-muted)]">Location:</span>
                                            <span className="font-bold">MLK Park</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[var(--text-muted)]">Vendor:</span>
                                            <span className="font-bold">PATH</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[var(--text-muted)]">Time:</span>
                                            <span className="font-bold">47 seconds</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Features */}
                <div className="space-y-6">
                    <div className="nexus-card-outlined bg-[var(--surface)] p-6 space-y-4">
                        <h3 className="text-xl font-black">How It Works</h3>

                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
                                    <span className="text-[var(--primary)] font-black text-sm">1</span>
                                </div>
                                <div>
                                    <h4 className="font-bold mb-1">QR Code Scan</h4>
                                    <p className="text-sm text-[var(--text-muted)]">
                                        Client scans QR code at any service location (shelter, library, park)
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
                                    <span className="text-[var(--primary)] font-black text-sm">2</span>
                                </div>
                                <div>
                                    <h4 className="font-bold mb-1">Auto-Assignment</h4>
                                    <p className="text-sm text-[var(--text-muted)]">
                                        System automatically assigns client to vendor based on QR location
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
                                    <span className="text-[var(--primary)] font-black text-sm">3</span>
                                </div>
                                <div>
                                    <h4 className="font-bold mb-1">Fuzzy Matching</h4>
                                    <p className="text-sm text-[var(--text-muted)]">
                                        AI detects duplicates even with typos or name variations
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
                                    <span className="text-[var(--primary)] font-black text-sm">4</span>
                                </div>
                                <div>
                                    <h4 className="font-bold mb-1">Instant Access</h4>
                                    <p className="text-sm text-[var(--text-muted)]">
                                        Caseworker notified immediately, client in system within 60 seconds
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[var(--primary)]/5 border border-[var(--primary)]/20 rounded-xl p-6">
                        <h4 className="font-black mb-2 text-[var(--primary)]">The Impact</h4>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                <span><strong>No paperwork</strong> - digital from the start</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                <span><strong>No duplication</strong> - AI prevents double-counting</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                <span><strong>Instant assignment</strong> - no waiting for callbacks</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                <span><strong>Layer 8 data</strong> - cities see QR effectiveness</span>
                            </li>
                        </ul>
                    </div>

                    <button
                        onClick={onNext}
                        className="w-full nexus-button nexus-button-primary py-4"
                    >
                        Next: AI Case Plans →
                    </button>
                </div>
            </div>
        </div>
    );
}
