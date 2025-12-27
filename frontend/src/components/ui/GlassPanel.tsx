import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface GlassPanelProps {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
    children,
    className,
    hoverEffect = false
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={hoverEffect ? { scale: 1.01, borderColor: 'rgba(0, 240, 255, 0.4)' } : undefined}
            className={cn(
                "bg-glass backdrop-blur-md border border-glass-border rounded-lg p-6 overflow-hidden relative",
                className
            )}
        >
            {/* Subtle scanline overlay for that tech feel */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] z-0 opacity-20" />

            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
};
