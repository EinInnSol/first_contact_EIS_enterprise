"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle2, Lock } from 'lucide-react';
import { NeonButton } from '@/components/ui/NeonButton';

export const AgreementOverlay = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [shouldRender, setShouldRender] = useState(true);

    useEffect(() => {
        // Check if the user has already agreed
        const hasAgreed = sessionStorage.getItem('access_agreed');
        if (!hasAgreed) {
            setIsVisible(true);
        } else {
            setShouldRender(false);
        }
    }, []);

    const handleAgree = () => {
        if (agreed) {
            sessionStorage.setItem('access_agreed', 'true');
            setIsVisible(false);
            setTimeout(() => setShouldRender(false), 500); // Wait for animation
        }
    };

    if (!shouldRender) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="w-full max-w-lg bg-slate-900 border border-cyan/30 rounded-lg shadow-[0_0_50px_rgba(0,240,255,0.1)] overflow-hidden relative"
                    >
                        {/* Glossy Header */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan to-transparent opacity-50" />

                        <div className="p-8 space-y-6">

                            {/* Icon Header */}
                            <div className="flex flex-col items-center gap-4 text-center">
                                <div className="w-16 h-16 rounded-full bg-cyan/10 border border-cyan/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                                    <ShieldAlert className="w-8 h-8 text-cyan" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white tracking-wider uppercase">Restricted Access</h2>
                                    <p className="text-slate-400 font-mono text-xs uppercase tracking-widest mt-1">First Contact E.I.S. // Intellectual Property</p>
                                </div>
                            </div>

                            {/* Agreement Text */}
                            <div className="bg-slate-950/50 p-6 border border-white/5 rounded text-sm text-slate-300 leading-relaxed font-mono">
                                <p className="mb-4">
                                    <strong className="text-cyan">WARNING:</strong> You are accessing a proprietary demonstration of the First Contact Ecosystem Intelligence System.
                                </p>
                                <p>
                                    By proceeding, you explicitly acknowledge and agree that:
                                </p>
                                <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
                                    <li>All code, concepts, and designs are confidential trade secrets.</li>
                                    <li>You will not copy, reproduce, or reverse-engineer any part of this system.</li>
                                    <li>Unauthorized distribution or replication of this intellectual property is strictly prohibited.</li>
                                </ul>
                            </div>

                            {/* Checkbox */}
                            <div
                                onClick={() => setAgreed(!agreed)}
                                className="flex items-start gap-3 p-3 rounded cursor-pointer hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 group"
                            >
                                <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-all ${agreed ? 'bg-cyan border-cyan text-black' : 'border-slate-600 bg-transparent text-transparent group-hover:border-slate-500'}`}>
                                    <CheckCircle2 size={14} strokeWidth={3} />
                                </div>
                                <div className="space-y-1">
                                    <span className={`text-sm font-medium transition-colors ${agreed ? 'text-white' : 'text-slate-400'}`}>
                                        I agree to the Non-Disclosure & Anti-Theft terms
                                    </span>
                                </div>
                            </div>

                            {/* Action Button */}
                            <NeonButton
                                variant="cyan"
                                fullWidth
                                glow
                                onClick={handleAgree}
                                disabled={!agreed}
                                className="py-6 tracking-[0.2em] uppercase"
                            >
                                {agreed ? 'Initialize Demo Session' : 'Awaiting Agreement...'}
                            </NeonButton>

                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
