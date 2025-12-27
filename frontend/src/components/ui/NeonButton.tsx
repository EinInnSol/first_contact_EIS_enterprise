import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, HTMLMotionProps } from 'framer-motion';

// Utility for class merging
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface NeonButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
    children: React.ReactNode;
    variant?: 'cyan' | 'orange' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    glow?: boolean;
}

export const NeonButton = React.forwardRef<HTMLButtonElement, NeonButtonProps>(
    ({ className, children, variant = 'cyan', size = 'md', fullWidth = false, glow = false, ...props }, ref) => {

        // Base styles
        const baseStyles = "relative inline-flex items-center justify-center rounded-sm font-mono font-bold tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-start-900 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group";

        // Variants
        const variants = {
            cyan: "bg-cyan-dim/10 text-cyan border border-cyan hover:bg-cyan/20 active:bg-cyan/30 focus:ring-cyan",
            orange: "bg-orange-dim/10 text-orange border border-orange hover:bg-orange/20 active:bg-orange/30 focus:ring-orange",
            outline: "bg-transparent text-slate-400 border border-slate-700 hover:border-slate-500 hover:text-slate-200",
        };

        // Sizes
        const sizes = {
            sm: "h-8 px-4 text-xs",
            md: "h-10 px-6 text-sm",
            lg: "h-12 px-8 text-base",
        };

        // Glow effect classes
        const glowEffects = {
            cyan: "shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)]",
            orange: "shadow-[0_0_15px_rgba(255,153,0,0.3)] hover:shadow-[0_0_25px_rgba(255,153,0,0.5)]",
            outline: "",
        };

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    baseStyles,
                    variants[variant],
                    sizes[size],
                    fullWidth ? "w-full" : "w-auto",
                    glow && glowEffects[variant],
                    className
                )}
                {...props}
            >
                {/* Scanline effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />

                {/* Content */}
                <span className="relative z-10 flex items-center gap-2">
                    {children}
                </span>
            </motion.button>
        );
    }
);

NeonButton.displayName = "NeonButton";
