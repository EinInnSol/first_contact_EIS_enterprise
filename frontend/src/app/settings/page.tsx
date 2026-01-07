"use client";

import { Settings as SettingsIcon, User, Bell, Shield } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="min-h-screen bg-[var(--background)] p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-black mb-2">Settings</h1>
                    <p className="text-[var(--text-muted)]">Manage your account and preferences</p>
                </div>

                <div className="space-y-6">
                    <div className="nexus-card bg-[var(--surface)] p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <User className="text-[var(--primary)]" size={24} />
                            <h2 className="text-xl font-black">Profile</h2>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-2">Name</label>
                                <input type="text" defaultValue="Admin User" className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border-crisp)] rounded-xl" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Email</label>
                                <input type="email" defaultValue="admin@longbeach.gov" className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border-crisp)] rounded-xl" />
                            </div>
                            <button className="nexus-button nexus-button-primary px-6">Save Changes</button>
                        </div>
                    </div>

                    <div className="nexus-card bg-[var(--surface)] p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Bell className="text-[var(--primary)]" size={24} />
                            <h2 className="text-xl font-black">Notifications</h2>
                        </div>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3">
                                <input type="checkbox" defaultChecked className="w-5 h-5" />
                                <span>Email notifications for new intakes</span>
                            </label>
                            <label className="flex items-center gap-3">
                                <input type="checkbox" defaultChecked className="w-5 h-5" />
                                <span>SMS alerts for high-priority cases</span>
                            </label>
                            <label className="flex items-center gap-3">
                                <input type="checkbox" className="w-5 h-5" />
                                <span>Weekly performance reports</span>
                            </label>
                        </div>
                    </div>

                    <div className="nexus-card bg-[var(--surface)] p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Shield className="text-[var(--primary)]" size={24} />
                            <h2 className="text-xl font-black">Security</h2>
                        </div>
                        <button className="nexus-button bg-[var(--surface-hover)] border border-[var(--border-crisp)] px-6">
                            Change Password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
