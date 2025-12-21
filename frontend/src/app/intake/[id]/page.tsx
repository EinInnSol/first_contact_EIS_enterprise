"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { MapPin, CheckCircle, Shield, ArrowRight } from 'lucide-react';
import { intakeApi } from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

export default function IntakePage() {
    const params = useParams();
    const qrId = params.id as string;

    const [step, setStep] = useState<'scan' | 'form' | 'success'>('scan');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        email: ''
    });
    const [result, setResult] = useState<any>(null);

    // Simulate scanning effect on load
    useEffect(() => {
        const recordScan = async () => {
            try {
                await intakeApi.recordScan(qrId);
                setTimeout(() => setStep('form'), 1500); // Fake scan delay for UX
            } catch (e) {
                console.error("Scan error", e);
                // Ensure we show form even if scan tracking fails
                setStep('form');
            }
        };
        recordScan();
    }, [qrId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await intakeApi.scanQr(qrId, formData);
            setResult(response.data);
            setStep('success');
        } catch (error) {
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 bg-hero-gradient">

            {/* Step 1: Scanning Animation */}
            {step === 'scan' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center text-white"
                >
                    <div className="w-24 h-24 rounded-full bg-primary-500/20 flex items-center justify-center mx-auto mb-6 animate-pulse">
                        <MapPin className="w-10 h-10 text-primary-400" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Locating Services...</h2>
                    <p className="text-slate-400">Connecting to First Contact Network</p>
                </motion.div>
            )}

            {/* Step 2: Intake Form */}
            {step === 'form' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    <Card variant="glass" className="border-t-4 border-t-primary-500">
                        <CardHeader className="text-center pb-2">
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Get Help Now</h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                Fill out this quick form to get connected with a caseworker immediately.
                            </p>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">First Name</label>
                                        <input
                                            required
                                            className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 p-2.5 outline-none focus:ring-2 focus:ring-primary-500"
                                            value={formData.first_name}
                                            onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Last Name</label>
                                        <input
                                            required
                                            className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 p-2.5 outline-none focus:ring-2 focus:ring-primary-500"
                                            value={formData.last_name}
                                            onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 p-2.5 outline-none focus:ring-2 focus:ring-primary-500"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="(555) 555-5555"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-12 text-lg mt-4"
                                    isLoading={loading}
                                    icon={<ArrowRight className="w-5 h-5" />}
                                >
                                    Connect Me
                                </Button>

                                <p className="text-xs text-center text-slate-400 mt-4 flex items-center justify-center gap-1">
                                    <Shield className="w-3 h-3" />
                                    Your information is secure and private.
                                </p>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Step 3: Success */}
            {step === 'success' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md text-center"
                >
                    <Card variant="glass" className="bg-emerald-50/90 dark:bg-emerald-900/20 border-emerald-200">
                        <CardContent className="pt-10 pb-10">
                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-10 h-10 text-emerald-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-2">You're Connected!</h2>
                            <p className="text-emerald-800 dark:text-emerald-200 mb-6">
                                {result?.message}
                            </p>

                            <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4 mb-6">
                                <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Assigned Vendor</p>
                                <p className="text-lg font-semibold text-slate-900 dark:text-white">{result?.assigned_vendor}</p>
                            </div>

                            <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4">
                                <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Your Case Number</p>
                                <p className="text-2xl font-mono font-bold text-primary-600">{result?.case_number}</p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </div>
    );
}
