"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck,
    MapPin,
    QrCode,
    User,
    ChevronRight,
    Zap,
    CheckCircle2,
    Calendar
} from 'lucide-react';
import { NeonButton } from '@/components/ui/NeonButton';
import { GlassPanel } from '@/components/ui/GlassPanel';

export default function ClientIntakePage() {
    const [step, setStep] = useState<'id' | 'form' | 'success'>('id');

    return (
        <div className="min-h-screen bg-start flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">

            {/* Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange/5 rounded-full blur-[120px] pointer-events-none" />

            <header className="mb-12 text-center relative z-10">
                <div className="inline-flex items-center gap-2 mb-4">
                    <div className="p-2 bg-cyan/20 border border-cyan/40 rounded-sm">
                        <Zap className="w-5 h-5 text-cyan" />
                    </div>
                    <span className="text-xs font-mono font-bold text-cyan uppercase tracking-[0.3em]">First Contact EIS</span>
                </div>
                <h1 className="text-3xl font-display font-bold text-white mb-2 uppercase">Your Support Gateway</h1>
                <p className="text-sm text-slate-400 font-medium">Access housing, health, and identity support instantly.</p>
            </header>

            <main className="w-full max-w-sm relative z-10">
                <AnimatePresence mode="wait">
                    {step === 'id' && (
                        <motion.div
                            key="id"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-6"
                        >
                            <GlassPanel className="p-0 border-cyan/40 shadow-[0_0_40px_rgba(0,240,255,0.15)] overflow-hidden">
                                <div className="bg-cyan/10 p-6 text-center border-b border-cyan/30">
                                    <div className="bg-black/40 p-4 rounded-md inline-block mb-4 border border-cyan/20">
                                        <QrCode className="w-48 h-48 text-white" />
                                    </div>
                                    <div className="text-xs font-mono font-bold text-cyan tracking-[0.2em] uppercase">Checking in to: SITE LB-4</div>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div className="flex items-center gap-4 p-3 bg-white/5 border border-white/5 rounded-sm">
                                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                                            <MapPin className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-slate-500 font-bold uppercase">Location</div>
                                            <div className="text-xs font-bold text-white uppercase">Atlantic & 6th, Long Beach</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-3 bg-white/5 border border-white/5 rounded-sm">
                                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                                            <User className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-slate-500 font-bold uppercase">Assigned Vendor</div>
                                            <div className="text-xs font-bold text-white uppercase">Pathways Long Beach</div>
                                        </div>
                                    </div>
                                </div>
                            </GlassPanel>

                            <NeonButton
                                variant="cyan"
                                size="lg"
                                fullWidth
                                glow
                                onClick={() => setStep('form')}
                            >
                                CHECK IN NOW
                                <ChevronRight className="w-5 h-5 ml-2" />
                            </NeonButton>

                            <p className="text-center text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                                No identity documents required for first contact.
                            </p>
                        </motion.div>
                    )}

                    {step === 'form' && (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <GlassPanel className="p-6">
                                <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Quick Information</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Full legal name (or nickname)</label>
                                        <input className="input-neon" placeholder="ENTER NAME" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Phone Number (if any)</label>
                                        <input className="input-neon" placeholder="XXX-XXX-XXXX" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">What do you need today?</label>
                                        <select className="input-neon bg-start-900 appearance-none">
                                            <option>HOUSING ASSISTANCE</option>
                                            <option>HEALTH CARE</option>
                                            <option>IDENTITY DOCUMENTS</option>
                                            <option>FOOD / SUPPLIES</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <NeonButton
                                        variant="cyan"
                                        fullWidth
                                        glow
                                        onClick={() => setStep('success')}
                                    >
                                        SUBMIT INTAKE
                                    </NeonButton>
                                </div>
                            </GlassPanel>

                            <button
                                onClick={() => setStep('id')}
                                className="w-full text-center text-[10px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-[0.2em]"
                            >
                                Back to QR Identity
                            </button>
                        </motion.div>
                    )}

                    {step === 'success' && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-8"
                        >
                            <div className="w-24 h-24 bg-cyan/10 border border-cyan rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(0,240,255,0.2)]">
                                <CheckCircle2 className="w-12 h-12 text-cyan" />
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-2xl font-display font-bold text-white uppercase italic">Intake Confirmed</h2>
                                <p className="text-slate-400 text-sm">A caseworker from <span className="text-cyan">Pathways LB</span> has been notified.</p>
                            </div>

                            <GlassPanel className="p-4 bg-cyan/5">
                                <div className="flex items-center gap-3 mb-2">
                                    <Calendar className="w-4 h-4 text-cyan" />
                                    <span className="text-xs font-bold text-white uppercase tracking-wider">Estimated Contact</span>
                                </div>
                                <div className="text-2xl font-mono font-bold text-cyan">08:42 MIN</div>
                                <p className="text-[10px] text-slate-500 font-medium mt-1">Please remain at Atlantic & 6th site.</p>
                            </GlassPanel>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2 p-3 bg-white/5 border border-white/5 rounded-sm text-left">
                                    <ShieldCheck className="w-4 h-4 text-cyan" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Identity Secured via First Contact EIS</span>
                                </div>
                                <NeonButton
                                    variant="outline"
                                    fullWidth
                                    onClick={() => setStep('id')}
                                >
                                    RETURN TO HOME
                                </NeonButton>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <footer className="mt-12 opacity-40 text-center">
                <p className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-[0.5em]">System Status: Connected / AES-256 Encrypted</p>
            </footer>
        </div>
    );
}
