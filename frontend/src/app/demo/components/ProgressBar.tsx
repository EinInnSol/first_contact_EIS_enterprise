import React from 'react';
import { Check } from 'lucide-react';

interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
    stepTitles: string[];
    onStepClick: (step: number) => void;
}

export default function ProgressBar({ currentStep, totalSteps, stepTitles, onStepClick }: ProgressBarProps) {
    return (
        <div className="w-full bg-[var(--surface)] border-b border-[var(--border-crisp)] py-4 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between">
                    {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
                        const isCompleted = step < currentStep;
                        const isCurrent = step === currentStep;

                        return (
                            <React.Fragment key={step}>
                                <div className="flex flex-col items-center gap-2">
                                    <button
                                        onClick={() => onStepClick(step)}
                                        className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                      transition-all duration-300 hover:scale-110
                      ${isCompleted ? 'bg-[var(--success)] text-white' : ''}
                      ${isCurrent ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/30' : ''}
                      ${!isCompleted && !isCurrent ? 'bg-[var(--surface-hover)] text-[var(--text-muted)] border-2 border-[var(--border-crisp)]' : ''}
                    `}
                                    >
                                        {isCompleted ? <Check size={20} /> : step}
                                    </button>
                                    <span className={`
                    text-[10px] font-bold uppercase tracking-wider max-w-[80px] text-center
                    ${isCurrent ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'}
                  `}>
                                        {stepTitles[step - 1]}
                                    </span>
                                </div>

                                {step < totalSteps && (
                                    <div className={`
                    flex-1 h-1 mx-2 rounded-full transition-all duration-500
                    ${isCompleted ? 'bg-[var(--success)]' : 'bg-[var(--border-crisp)]'}
                  `} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
