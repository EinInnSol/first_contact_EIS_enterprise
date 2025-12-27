import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    BarChart3,
    Users,
    Map as MapIcon,
    Settings,
    ShieldAlert,
    Zap,
    ClipboardList,
    LogOut
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface SidebarItem {
    name: string;
    href: string;
    icon: React.ElementType;
}

const cityAdminItems: SidebarItem[] = [
    { name: 'Strategic Overview', href: '/dashboard/city', icon: MapIcon },
    { name: 'Vendor Analytics', href: '/dashboard/city/vendors', icon: BarChart3 },
    { name: 'Service Gaps', href: '/dashboard/city/gaps', icon: ShieldAlert },
    { name: 'AI Strategic Advisor', href: '/dashboard/city/advisor', icon: Zap },
];

const caseworkerItems: SidebarItem[] = [
    { name: 'Active Caseload', href: '/dashboard/caseworker', icon: Users },
    { name: 'Intake Queue', href: '/dashboard/caseworker/queue', icon: ClipboardList },
    { name: 'Compliance Reports', href: '/dashboard/caseworker/reports', icon: Zap },
];

export const Sidebar: React.FC<{ role: 'city' | 'caseworker' }> = ({ role }) => {
    const pathname = usePathname();
    const items = role === 'city' ? cityAdminItems : caseworkerItems;

    return (
        <aside className="w-64 bg-start-900 border-r border-glass-border flex flex-col h-screen sticky top-0">
            <div className="p-6 border-b border-glass-border">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-8 h-8 rounded-sm bg-cyan/20 border border-cyan flex items-center justify-center group-hover:shadow-[0_0_10px_rgba(0,240,255,0.5)] transition-all">
                        <ShieldAlert className="w-5 h-5 text-cyan" />
                    </div>
                    <span className="font-display font-bold text-white tracking-widest text-lg uppercase">First Contact</span>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 px-2">
                    {role === 'city' ? 'Intelligence Layer' : 'Operational Center'}
                </div>

                {items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-200 group",
                                isActive
                                    ? "bg-cyan/10 text-cyan border border-cyan/30 shadow-[0_0_15px_rgba(0,240,255,0.1)]"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <item.icon className={cn(
                                "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
                                isActive ? "text-cyan" : "text-slate-500 group-hover:text-cyan"
                            )} />
                            <span className="text-sm font-medium">{item.name}</span>
                            {isActive && (
                                <div className="ml-auto w-1 h-4 bg-cyan rounded-full animate-pulse" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-glass-border space-y-2">
                <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-3 rounded-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                >
                    <Settings className="w-5 h-5" />
                    <span className="text-sm font-medium">Settings</span>
                </Link>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-sm text-orange/70 hover:text-orange hover:bg-orange/5 transition-all">
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};
