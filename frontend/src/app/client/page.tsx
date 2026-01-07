"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ClipboardCheck,
    AlertTriangle,
    Clock,
    MapPin,
    Phone,
    ChevronRight,
    ShieldCheck,
    UserCheck
} from 'lucide-react';

export default function ClientPortal() {
    const [activeTab, setActiveTab] = useState<'home' | 'intake' | 'status'>('home');

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        dob: '',
        ssn_last_4: '',
        veteran_status: false,
        disabling_condition: false,
        current_residence: '',
        homeless_start_date: '',
        daily_functioning_score: 5,
        wellness_score: 5,
        social_risk_score: 5,
        immediate_needs: [],
        income_sources: []
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mock QR Location ID - in real app, this comes from URL
    const QR_LOCATION_ID = "qr_demo_123";

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/intake/qr/${QR_LOCATION_ID}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert("Intake Submitted! Case Number Assigned.");
                setActiveTab('home');
            } else {
                alert("Submission failed. Please try again.");
            }
        } catch (error) {
            console.error(error);
            alert("Connection error.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans max-w-md mx-auto relative shadow-2xl border-x border-slate-800">

            {/* Mobile Header */}
            <header className="bg-slate-900/80 backdrop-blur-md p-4 sticky top-0 z-50 border-b border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-cyan" />
                    <span className="font-bold tracking-wide">FirstContact <span className="text-cyan">CLIENT</span></span>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                    <UserCheck className="w-4 h-4 text-slate-400" />
                </div>
            </header>

            <main className="p-4 space-y-6 pb-24">

                {activeTab === 'home' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Greeting */}
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold">Good Morning.</h1>
                            <p className="text-slate-400 text-sm">How can we help you today?</p>
                        </div>

                        {/* QUICK ACTIONS GRID */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setActiveTab('intake')}
                                className="p-4 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex flex-col items-start gap-3 shadow-lg hover:brightness-110 transition-all border border-blue-400/20"
                            >
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <ClipboardCheck className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-left">
                                    <span className="block font-bold">New Intake</span>
                                    <span className="text-xs text-blue-200">Start Services</span>
                                </div>
                            </button>

                            <button
                                onClick={() => setActiveTab('status')}
                                className="p-4 bg-slate-800 rounded-xl flex flex-col items-start gap-3 border border-slate-700 hover:border-cyan/50 hover:bg-slate-800/80 transition-all"
                            >
                                <div className="p-2 bg-slate-700 rounded-lg">
                                    <Clock className="w-6 h-6 text-cyan" />
                                </div>
                                <div className="text-left">
                                    <span className="block font-bold">Status Check</span>
                                    <span className="text-xs text-slate-400">View Appointments</span>
                                </div>
                            </button>
                        </div>

                        {/* URGENT ALERTS (The "Audible" Input) */}
                        <div className="p-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-3">
                            <div className="flex items-center gap-2 text-amber-500">
                                <AlertTriangle className="w-5 h-5" />
                                <h3 className="font-bold">Running Late?</h3>
                            </div>
                            <p className="text-sm text-slate-400">
                                Let us know immediately so we can hold your spot or reschedule your transport.
                            </p>
                            <button className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition-colors text-sm flex items-center justify-center gap-2">
                                Report Delay / Issue
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Upcoming (Mock Data) */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Up Next</h3>
                            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-4">
                                <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-800 rounded-lg border border-slate-700">
                                    <span className="text-xs font-bold text-slate-400">OCT</span>
                                    <span className="text-lg font-bold text-white">24</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">Housing Intake Interview</h4>
                                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                                        <MapPin className="w-3 h-3" />
                                        <span>MHLA - Long Beach Blvd</span>
                                    </div>
                                </div>
                                <div className="ml-auto">
                                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-[10px] font-bold rounded uppercase">Confirmed</span>
                                </div>
                            </div>
                        </div>

                    </motion.div>
                )}

                {/* INTAKE FORM (HUD COMPLIANT) */}
                {activeTab === 'intake' && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <button onClick={() => setActiveTab('home')} className="text-sm text-slate-400 hover:text-white flex items-center gap-1">
                            ← Back to Home
                        </button>

                        <div className="space-y-2">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-cyan" />
                                HUD Standard Intake
                            </h2>
                            <p className="text-xs text-slate-400">
                                Confidential. Compliant with HMIS Data Standards 2024.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase text-slate-500">Full Legal Name</label>
                                <input type="text" name="first_name" onChange={handleInputChange} className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg focus:border-cyan outline-none transition-colors" placeholder="First Name" required />
                                <input type="text" name="last_name" onChange={handleInputChange} className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg focus:border-cyan outline-none transition-colors" placeholder="Last Name" required />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-slate-500">Date of Birth</label>
                                    <input type="date" name="dob" onChange={handleInputChange} className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg focus:border-cyan outline-none transition-colors text-slate-400" required />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-slate-500">SSN (Last 4)</label>
                                    <input type="text" name="ssn_last_4" onChange={handleInputChange} maxLength={4} className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg focus:border-cyan outline-none transition-colors" placeholder="XXXX" />
                                </div>
                            </div>

                            <div className="flex gap-4 p-4 bg-slate-900 border border-slate-800 rounded-xl">
                                <label className="flex items-center gap-2 text-sm text-slate-300">
                                    <input type="checkbox" name="veteran_status" onChange={e => setFormData({ ...formData, veteran_status: e.target.checked })} className="accent-cyan w-4 h-4" />
                                    US Veteran?
                                </label>
                                <label className="flex items-center gap-2 text-sm text-slate-300">
                                    <input type="checkbox" name="disabling_condition" onChange={e => setFormData({ ...formData, disabling_condition: e.target.checked })} className="accent-cyan w-4 h-4" />
                                    Disabling Condition?
                                </label>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase text-slate-500 block">Living Situation (Prior Night)</label>
                                <select name="current_residence" onChange={handleInputChange} className="w-full p-3 bg-slate-950 border border-slate-700 rounded-lg outline-none text-sm">
                                    <option>Select Option...</option>
                                    <option value="Place not meant for habitation">Place not meant for habitation</option>
                                    <option value="Emergency Shelter">Emergency Shelter</option>
                                    <option value="Safe Haven">Safe Haven</option>
                                    <option value="Hotel/Motel (Paid by voucher)">Hotel/Motel (Paid by voucher)</option>
                                    <option value="Staying with Friends (Temporary)">Staying with Friends (Temporary)</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase text-slate-500">Homeless Start Date</label>
                                <input type="date" name="homeless_start_date" onChange={handleInputChange} className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg focus:border-cyan outline-none transition-colors text-slate-400" />
                            </div>

                            {/* VI-SPDAT SELF-ASSESSMENT SUBSET */}
                            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
                                <h3 className="text-sm font-bold text-cyan uppercase tracking-wider border-b border-slate-800 pb-2">Vulnerability Assessment</h3>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-slate-400">
                                        <span>Daily Functioning</span>
                                        <span>{formData.daily_functioning_score}/10</span>
                                    </div>
                                    <input type="range" name="daily_functioning_score" min="0" max="10" value={formData.daily_functioning_score} onChange={handleInputChange} className="w-full accent-cyan" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-slate-400">
                                        <span>Physical/Mental Wellness</span>
                                        <span>{formData.wellness_score}/10</span>
                                    </div>
                                    <input type="range" name="wellness_score" min="0" max="10" value={formData.wellness_score} onChange={handleInputChange} className="w-full accent-cyan" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-slate-400">
                                        <span>Social Risk / Safety</span>
                                        <span>{formData.social_risk_score}/10</span>
                                    </div>
                                    <input type="range" name="social_risk_score" min="0" max="10" value={formData.social_risk_score} onChange={handleInputChange} className="w-full accent-cyan" />
                                </div>
                            </div>

                            <button type="submit" className="w-full py-4 bg-cyan text-slate-950 font-bold rounded-xl hover:bg-cyan/90 transition-colors shadow-[0_0_20px_rgba(0,240,255,0.3)] flex items-center justify-center gap-2">
                                {isSubmitting ? 'Transmitting...' : 'Submit to HUD Database'}
                                {!isSubmitting && <ShieldCheck className="w-4 h-4" />}
                            </button>
                        </form>
                    </motion.div>
                )}

            </main>

            {/* Bottom Nav */}
            <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-900 border-t border-slate-800 p-4 flex justify-around items-center z-50">
                <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-cyan' : 'text-slate-500'}`}>
                    <div className={`w-8 h-1 rounded-full mb-1 ${activeTab === 'home' ? 'bg-cyan box-glow' : 'bg-transparent'}`} />
                    <span className="text-[10px] font-bold uppercase">Home</span>
                </button>
                <button onClick={() => setActiveTab('status')} className={`flex flex-col items-center gap-1 ${activeTab === 'status' ? 'text-cyan' : 'text-slate-500'}`}>
                    <div className={`w-8 h-1 rounded-full mb-1 ${activeTab === 'status' ? 'bg-cyan box-glow' : 'bg-transparent'}`} />
                    <span className="text-[10px] font-bold uppercase">Appointments</span>
                </button>
            </nav>

        </div>
    );
}
