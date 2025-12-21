"use client";

import React, { useState } from 'react';
import {
    ShieldCheck,
    Lock,
    Mail,
    Building2,
    BrainCircuit,
    ArrowRight,
    Eye,
    EyeOff
} from 'lucide-react';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate auth
        setTimeout(() => {
            window.location.href = '/dashboard/city'; // Redirect after login
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[var(--primary-glow)] via-transparent to-transparent">

            <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-700">

                {/* Logo & Header */}
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-[var(--primary)] rounded-2xl flex items-center justify-center shadow-2xl shadow-[var(--primary)]/20">
                        <BrainCircuit className="text-white" size={36} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter">Enter The Nexus</h1>
                        <p className="text-[var(--text-muted)] text-sm mt-1 uppercase tracking-widest font-bold">First Contact E.I.S.</p>
                    </div>
                </div>

                {/* Login Card */}
                <div className="nexus-card-outlined bg-[var(--surface)] p-8 shadow-2xl relative overflow-hidden">
                    {/* Decorative Pulse */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-50"></div>

                    <form onSubmit={handleLogin} className="space-y-6">

                        {/* Organization Slug */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-widest flex items-center gap-2">
                                <Building2 size={12} />
                                Organization ID
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="e.g. city-of-long-beach"
                                    className="w-full pl-4 pr-12 py-3.5 bg-[var(--background)] border border-[var(--border-crisp)] rounded-xl outline-none focus:border-[var(--primary)] transition-all font-medium"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-[10px] font-bold">.nexus</div>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-widest flex items-center gap-2">
                                <Mail size={12} />
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="maria.garcia@vendor.org"
                                className="w-full px-4 py-3.5 bg-[var(--background)] border border-[var(--border-crisp)] rounded-xl outline-none focus:border-[var(--primary)] transition-all font-medium"
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-widest flex items-center gap-2">
                                    <Lock size={12} />
                                    Password
                                </label>
                                <button type="button" className="text-[10px] font-bold text-[var(--primary)] hover:underline">Forgot?</button>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3.5 bg-[var(--background)] border border-[var(--border-crisp)] rounded-xl outline-none focus:border-[var(--primary)] transition-all font-medium"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full nexus-button nexus-button-primary flex items-center justify-center gap-2 py-4 shadow-xl shadow-[var(--primary)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Secure Login
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer info */}
                <div className="flex flex-col items-center space-y-4 pt-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-[var(--surface-hover)]/30 rounded-full border border-[var(--border-crisp)]">
                        <ShieldCheck size={14} className="text-[var(--success)]" />
                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Pilot Protection Enabled</span>
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)] font-medium text-center leading-relaxed">
                        By logging in, you agree to the Nexus Coordination Terms of Service.<br />
                        Layer 8 Monitoring active in this environment.
                    </p>
                </div>

            </div>
        </div>
    );
}
