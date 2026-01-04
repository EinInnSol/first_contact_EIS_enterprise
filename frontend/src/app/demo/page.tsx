"use client";

import React, { useState } from 'react';
import { BrainCircuit, ChevronLeft, ChevronRight } from 'lucide-react';
import ProgressBar from './components/ProgressBar';
import ThemeToggle from './components/ThemeToggle';
import IntroStep from './components/IntroStep';
import QRIntakeStep from './components/QRIntakeStep';
import FuzzyDuplicateStep from './components/FuzzyDuplicateStep';
import CasePlanStep from './components/CasePlanStep';
import CallingAudiblesStep from './components/CallingAudiblesStep';
import BenefitStackStep from './components/BenefitStackStep';
import AppointmentOrchestratorStep from './components/AppointmentOrchestratorStep';
import GoogleMapsStep from './components/GoogleMapsStep';
import Layer8Step from './components/Layer8Step';
import AIAdvisorStep from './components/AIAdvisorStep';
import PredictiveAnalyticsStep from './components/PredictiveAnalyticsStep';
import GeospatialStep from './components/GeospatialStep';
import BusinessModelStep from './components/BusinessModelStep';

const STEP_TITLES = [
    'The Problem',
    'QR Intake',
    'Duplicate Detection',
    'AI Case Plans',
    'Calling Audibles',
    'Benefit Stack',
    'Appointments',
    'Vendor Map',
    'Layer 8 Reveal',
    'AI Advisor',
    'Predictive Analytics',
    'Heat Maps',
    'Business Model'
];

// Required interactions per step
const REQUIRED_INTERACTIONS = {
    1: 1,  // Click "See How It Works"
    2: 1,  // Submit intake form
    3: 4,  // Check duplicates + review 3 matches
    4: 1,  // Generate case plan
    5: 3,  // Review 3 AI recommendations
    6: 1,  // Calculate benefits
    7: 4,  // Select 3 appointments + optimize
    8: 3,  // Click 3 vendor markers
    9: 1,  // Reveal Layer 8
    10: 2, // Ask 2 questions
    11: 4, // Run prediction + review 3 forecasts
    12: 3, // Toggle 3 heat map layers
    13: 1  // Click through business model
};

export default function EnhancedDemoPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [stepInteractions, setStepInteractions] = useState<Record<number, number>>({});
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

    const handleNext = () => {
        if (currentStep < STEP_TITLES.length) {
            // Mark current step as completed
            setCompletedSteps(new Set([...completedSteps, currentStep]));
            setCurrentStep(currentStep + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleStepClick = (step: number) => {
        // Only allow clicking on completed steps or the next step
        if (completedSteps.has(step) || step === currentStep + 1 || step === currentStep) {
            setCurrentStep(step);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleRestart = () => {
        setCurrentStep(1);
        setStepInteractions({});
        setCompletedSteps(new Set());
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleInteraction = () => {
        setStepInteractions(prev => ({
            ...prev,
            [currentStep]: (prev[currentStep] || 0) + 1
        }));
    };

    const getInteractionsCompleted = () => stepInteractions[currentStep] || 0;
    const getRequiredInteractions = () => REQUIRED_INTERACTIONS[currentStep as keyof typeof REQUIRED_INTERACTIONS] || 1;

    return (
        <div className="min-h-screen bg-[var(--background)]">
            {/* Header */}
            <div className="bg-[var(--surface)] border-b border-[var(--border-crisp)] py-6 px-6">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[var(--primary)] rounded-2xl flex items-center justify-center shadow-lg shadow-[var(--primary)]/20">
                            <BrainCircuit className="text-white" size={28} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tighter">First Contact E.I.S.</h1>
                            <p className="text-sm text-[var(--text-muted)] font-bold uppercase tracking-widest">
                                Enhanced Interactive Demo
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <button
                            onClick={handleRestart}
                            className="nexus-button bg-[var(--surface-hover)] border border-[var(--border-crisp)] px-4 py-2 text-sm"
                        >
                            Restart Demo
                        </button>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <ProgressBar
                currentStep={currentStep}
                totalSteps={STEP_TITLES.length}
                stepTitles={STEP_TITLES}
                onStepClick={handleStepClick}
            />

            {/* Content */}
            <div className="py-12 px-6">
                {currentStep === 1 && <IntroStep onNext={handleNext} />}
                {currentStep === 2 && (
                    <QRIntakeStep
                        onNext={handleNext}
                        onInteraction={handleInteraction}
                        interactionsCompleted={getInteractionsCompleted()}
                        requiredInteractions={getRequiredInteractions()}
                    />
                )}
                {currentStep === 3 && (
                    <FuzzyDuplicateStep
                        onNext={handleNext}
                        onInteraction={handleInteraction}
                        interactionsCompleted={getInteractionsCompleted()}
                        requiredInteractions={getRequiredInteractions()}
                    />
                )}
                {currentStep === 4 && (
                    <CasePlanStep
                        onNext={handleNext}
                        onInteraction={handleInteraction}
                        interactionsCompleted={getInteractionsCompleted()}
                        requiredInteractions={getRequiredInteractions()}
                    />
                )}
                {currentStep === 5 && (
                    <CallingAudiblesStep
                        onNext={handleNext}
                        onInteraction={handleInteraction}
                        interactionsCompleted={getInteractionsCompleted()}
                        requiredInteractions={getRequiredInteractions()}
                    />
                )}
                {currentStep === 6 && (
                    <BenefitStackStep
                        onNext={handleNext}
                        onInteraction={handleInteraction}
                        interactionsCompleted={getInteractionsCompleted()}
                        requiredInteractions={getRequiredInteractions()}
                    />
                )}
                {currentStep === 7 && (
                    <AppointmentOrchestratorStep
                        onNext={handleNext}
                        onInteraction={handleInteraction}
                        interactionsCompleted={getInteractionsCompleted()}
                        requiredInteractions={getRequiredInteractions()}
                    />
                )}
                {currentStep === 8 && (
                    <GoogleMapsStep
                        onNext={handleNext}
                        onInteraction={handleInteraction}
                        interactionsCompleted={getInteractionsCompleted()}
                        requiredInteractions={getRequiredInteractions()}
                    />
                )}
                {currentStep === 9 && <Layer8Step onNext={handleNext} />}
                {currentStep === 10 && (
                    <AIAdvisorStep
                        onNext={handleNext}
                        onInteraction={handleInteraction}
                        interactionsCompleted={getInteractionsCompleted()}
                        requiredInteractions={getRequiredInteractions()}
                    />
                )}
                {currentStep === 11 && (
                    <PredictiveAnalyticsStep
                        onNext={handleNext}
                        onInteraction={handleInteraction}
                        interactionsCompleted={getInteractionsCompleted()}
                        requiredInteractions={getRequiredInteractions()}
                    />
                )}
                {currentStep === 12 && (
                    <GeospatialStep
                        onNext={handleNext}
                        onInteraction={handleInteraction}
                        interactionsCompleted={getInteractionsCompleted()}
                        requiredInteractions={getRequiredInteractions()}
                    />
                )}
                {currentStep === 13 && <BusinessModelStep onRestart={handleRestart} />}
            </div>

            {/* Navigation Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-[var(--surface)]/95 backdrop-blur-lg border-t border-[var(--border-crisp)] py-4 px-6">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <button
                        onClick={handlePrevious}
                        disabled={currentStep === 1}
                        className="nexus-button bg-[var(--surface-hover)] border border-[var(--border-crisp)] px-6 py-3 flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={20} />
                        Previous
                    </button>

                    <div className="text-center">
                        <div className="text-sm font-bold text-[var(--text-muted)]">
                            Step {currentStep} of {STEP_TITLES.length}
                        </div>
                        <div className="text-xs text-[var(--text-muted)]">
                            {STEP_TITLES[currentStep - 1]}
                        </div>
                        {REQUIRED_INTERACTIONS[currentStep as keyof typeof REQUIRED_INTERACTIONS] && (
                            <div className="text-xs text-[var(--primary)] font-bold mt-1">
                                {getInteractionsCompleted()}/{getRequiredInteractions()} interactions
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={currentStep === STEP_TITLES.length}
                        className="nexus-button nexus-button-primary px-6 py-3 flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        Next
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Spacer for fixed footer */}
            <div className="h-24" />
        </div>
    );
}
