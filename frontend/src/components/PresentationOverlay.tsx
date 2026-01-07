"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    ChevronRight,
    ChevronLeft,
    BrainCircuit,
    Network,
    Target,
    ShieldCheck,
    Zap
} from 'lucide-react';
import { NeonButton } from '@/components/ui/NeonButton';

const SLIDES = [
    {
        id: 1,
        title: "The Fragmentation Crisis",
        icon: Network,
        content: "Homeless services are dangerously siloed. Medical, housing, and legal support operate in isolation. In the gaps between them, human potential is lost.",
        graphic: "disconnected"
    },
    {
        id: 2,
        title: "Enter The Orchestrator",
        icon: BrainCircuit,
        content: "First Contact E.I.S. is not a database—it's an Ecosystem Intelligence System. It unifies every vendor, shelter, and service agency into a single, reactive neural grid.",
        graphic: "network"
    },
    {
        id: 3,
        title: "Neural Case Generation",
        icon: Zap,
        content: "The AI doesn't just list shelters. It generates unique, stability-focused pathways tailored to the individual. Detox + Job Training + Housing. A unique formula for every human life.",
        graphic: "ai"
    },
    {
        id: 4,
        title: "Stability, Solved",
        icon: ShieldCheck,
        content: "The goal isn't just a bed for the night. It's permanent stability. The system adapts the case plan in real-time, monitoring outcomes until true independence is achieved.",
        graphic: "shield"
    }
];

interface PresentationOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export const PresentationOverlay = ({ isOpen, onClose }: PresentationOverlayProps) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        if (currentSlide < SLIDES.length - 1) {
            setCurrentSlide(prev => prev + 1);
        } else {
            onClose(); // Close on finish
            setCurrentSlide(0); // Reset for next time
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(prev => prev - 1);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 rounded-full border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors z-50"
                    >
                        <X size={24} />
                    </button>

                    {/* Main Container */}
                    <motion.div
                        className="w-full max-w-5xl aspect-video bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden relative flex shadow-2xl"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                    >

                        {/* Left Content Column */}
                        <div className="w-1/2 p-12 flex flex-col justify-center relative z-10 border-r border-white/5">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentSlide}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-6"
                                >
                                    {/* Slide Indicator */}
                                    <div className="flex items-center gap-2 mb-8">
                                        {SLIDES.map((_, idx) => (
                                            <div
                                                key={idx}
                                                className={`h-1 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-cyan shadow-[0_0_10px_rgba(0,240,255,0.5)]' : 'w-2 bg-slate-700'}`}
                                            />
                                        ))}
                                    </div>

                                    {/* Title Section */}
                                    <div className="inline-flex items-center gap-3 text-cyan mb-2">
                                        {React.createElement(SLIDES[currentSlide].icon, { className: "w-6 h-6" })}
                                        <span className="text-xs font-mono font-bold uppercase tracking-widest">System Architecture // Component {currentSlide + 1}</span>
                                    </div>

                                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                                        {SLIDES[currentSlide].title}
                                    </h2>

                                    <p className="text-lg text-slate-400 leading-relaxed font-light">
                                        {SLIDES[currentSlide].content}
                                    </p>

                                </motion.div>
                            </AnimatePresence>

                            {/* Navigation Footer (Left Side) */}
                            <div className="mt-auto pt-12 flex items-center gap-4">
                                <button
                                    onClick={prevSlide}
                                    disabled={currentSlide === 0}
                                    className="p-3 rounded-full border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                <NeonButton
                                    onClick={nextSlide}
                                    variant="cyan"
                                    className="flex-1"
                                    glow
                                >
                                    {currentSlide === SLIDES.length - 1 ? 'Complete Briefing' : 'Next Sequence'} <ChevronRight className="ml-2 w-4 h-4" />
                                </NeonButton>
                            </div>
                        </div>

                        {/* Right Visual Column (Animated Graphic Area) */}
                        <div className="w-1/2 bg-slate-950 relative overflow-hidden flex items-center justify-center">
                            {/* Background Grid */}
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentSlide}
                                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                    exit={{ opacity: 0, scale: 1.1, rotate: 10 }}
                                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                    className="relative z-10"
                                >
                                    {/* Dynamic Icon Rendering based on slide content acting as a 'graphic' */}
                                    <div className="w-64 h-64 rounded-full border-2 border-cyan/20 bg-cyan/5 flex items-center justify-center relative group">
                                        {/* Spinning Rings */}
                                        <div className="absolute inset-0 rounded-full border border-cyan/10 border-t-cyan/50 animate-spin-slow" />
                                        <div className="absolute inset-4 rounded-full border border-cyan/10 border-b-cyan/50 animate-spin-reverse-slower" />

                                        {/* Central Icon */}
                                        {React.createElement(SLIDES[currentSlide].icon, {
                                            className: "w-32 h-32 text-cyan drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]"
                                        })}

                                        {/* Decorative Particles */}
                                        <div className="absolute top-0 right-0 w-2 h-2 bg-white rounded-full animate-ping" />
                                        <div className="absolute bottom-10 left-10 w-1 h-1 bg-cyan rounded-full animate-pulse" />
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
