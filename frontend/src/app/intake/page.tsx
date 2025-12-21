"use client";

import React, { useState } from 'react';
import {
    CheckCircle2,
    MapPin,
    ChevronRight,
    Upload,
    Heart,
    Calendar,
    Phone,
    ArrowRight,
    ShieldCheck
} from 'lucide-react';

export default function MobileIntake() {
    const [step, setStep] = useState(1);
    const totalSteps = 4;

    const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));

    return (
        <div className="min-h-screen bg-[var(--background)] flex flex-col max-w-[500px] mx-auto border-x border-[var(--border-crisp)] shadow-2xl">

            {/* Header */}
            <header className="p-6 bg-[var(--surface)] border-b border-[var(--border-crisp)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center">
                        <Heart className="text-white" size={18} />
                    </div>
                    <span className="font-bold text-lg tracking-tight">First Contact</span>
                </div>
                <div className="text-xs font-bold text-[var(--text-muted)] tracking-widest uppercase">
                    Step {step} of {totalSteps}
                </div>
            </header>

            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-[var(--surface-hover)]">
                <div
                    className="h-full bg-[var(--primary)] transition-all duration-500 ease-out"
                    style={{ width: `${(step / totalSteps) * 100}%` }}
                ></div>
            </div>

            {/* Form Content */}
            <main className="flex-1 p-8 space-y-8 overflow-y-auto">

                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <div>
                            <h2 className="text-3xl font-black tracking-tight mb-2">Welcome.</h2>
                            <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                                Let's get you connected to the right support services today. This takes about 3 minutes.
                            </p>
                        </div>

                        <div className="nexus-card-outlined p-4 bg-[var(--primary-glow)] border-dashed">
                            <div className="flex gap-4 items-start">
                                <MapPin className="text-[var(--primary)] shrink-0" size={24} />
                                <div className="text-xs text-[var(--text-muted)] font-medium">
                                    Location identified: <br />
                                    <span className="text-[var(--text-main)] font-black">LONG BEACH - LINCOLN PARK</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-widest">Full Name</label>
                                <input type="text" placeholder="Enter your name" className="w-full p-4 bg-[var(--surface)] border border-[var(--border-crisp)] rounded-xl outline-none focus:border-[var(--primary)]" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-widest">Phone Number (Optional)</label>
                                <input type="tel" placeholder="(562) 000-0000" className="w-full p-4 bg-[var(--surface)] border border-[var(--border-crisp)] rounded-xl outline-none focus:border-[var(--primary)]" />
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <div>
                            <h2 className="text-2xl font-black tracking-tight mb-2">Current Needs.</h2>
                            <p className="text-[var(--text-muted)] text-sm leading-relaxed">Select what you need help with right now.</p>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {[
                                { label: 'Emergency Shelter', icon: '🏠' },
                                { label: 'Food & Groceries', icon: '🍱' },
                                { label: 'Medical Support', icon: '🏥' },
                                { label: 'Transport / Bus Pass', icon: '🚌' },
                                { label: 'Identity Documents', icon: '🆔' },
                            ].map((item) => (
                                <button key={item.label} className="flex items-center justify-between p-4 bg-[var(--surface)] border border-[var(--border-crisp)] rounded-xl hover:border-[var(--primary)] hover:bg-[var(--primary-glow)] transition-all">
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl">{item.icon}</span>
                                        <span className="font-bold text-sm">{item.label}</span>
                                    </div>
                                    <ChevronRight size={18} className="text-[var(--text-muted)]" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <div>
                            <h2 className="text-2xl font-black tracking-tight mb-2">Verification.</h2>
                            <p className="text-[var(--text-muted)] text-sm leading-relaxed">Upload a photo of any ID or document you have. (Skip if none)</p>
                        </div>

                        <div className="nexus-card border-dashed border-2 flex flex-col items-center justify-center py-12 gap-4 cursor-pointer hover:bg-[var(--surface-hover)]">
                            <div className="w-16 h-16 bg-[var(--surface-hover)] rounded-full flex items-center justify-center text-[var(--text-muted)]">
                                <Upload size={32} />
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-sm">Tap to Take Photo</div>
                                <div className="text-[10px] text-[var(--text-muted)] uppercase mt-1 font-bold">Max size 10MB</div>
                            </div>
                        </div>

                        <div className="p-4 bg-[var(--surface-hover)]/50 rounded-xl flex items-center gap-3">
                            <ShieldCheck className="text-[var(--success)]" size={20} />
                            <div className="text-[10px] text-[var(--text-muted)] font-medium">
                                Your data is stored securely and only visible to authorized case coordination staff.
                            </div>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-8 flex flex-col items-center justify-center py-8 animate-in zoom-in fade-in duration-700">
                        <div className="w-24 h-24 bg-[var(--success)] rounded-full flex items-center justify-center text-white shadow-2xl shadow-green-500/20">
                            <CheckCircle2 size={48} />
                        </div>

                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-black tracking-tight">Got it.</h2>
                            <p className="text-[var(--text-muted)] px-8 text-sm">
                                The Brain is matching you with a caseworker right now.
                            </p>
                        </div>

                        <div className="nexus-card-outlined w-full p-6 text-center space-y-4">
                            <div className="text-xs font-bold text-[var(--primary)] tracking-widest uppercase mb-2">Automated Next Step</div>
                            <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--border-crisp)]">
                                <div className="font-black text-lg mb-1">Appointment Reserved</div>
                                <div className="text-[var(--text-muted)] text-xs flex items-center justify-center gap-2">
                                    <Calendar size={14} /> Today at 2:30 PM
                                </div>
                                <div className="text-[var(--text-muted)] text-xs flex items-center justify-center gap-2 mt-1">
                                    <Phone size={14} /> SMS Confirmation Sent
                                </div>
                            </div>
                            <p className="text-[10px] text-[var(--text-muted)] italic leading-relaxed">
                                "We've identified an immediate opening at the Downtown Center. A transport van has been alerted of your location."
                            </p>
                        </div>
                    </div>
                )}

            </main>

            {/* Footer Navigation */}
            <footer className="p-8 border-t border-[var(--border-crisp)] bg-[var(--surface)]">
                {step < totalSteps ? (
                    <button
                        onClick={nextStep}
                        className="w-full nexus-button nexus-button-primary flex items-center justify-center gap-2 py-5 text-lg shadow-xl shadow-[var(--primary)]/20"
                    >
                        Continue
                        <ArrowRight size={20} />
                    </button>
                ) : (
                    <button className="w-full nexus-button border border-[var(--border-crisp)] py-5 text-[var(--text-muted)] font-bold">
                        Close Intake
                    </button>
                )}
            </footer>

        </div>
    );
}
