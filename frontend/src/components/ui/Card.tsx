import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'glass';
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    variant = 'default'
}) => {
    const baseStyles = "rounded-xl overflow-hidden";

    const variants = {
        default: "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm",
        glass: "glass-card shadow-lg",
    };

    return (
        <div className={`${baseStyles} ${variants[variant]} ${className}`}>
            {children}
        </div>
    );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`p-6 border-b border-slate-100 dark:border-slate-700/50 ${className}`}>
        {children}
    </div>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`p-6 ${className}`}>
        {children}
    </div>
);
