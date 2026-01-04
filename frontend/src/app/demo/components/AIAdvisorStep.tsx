"use client";

import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { aiStrategicResponses } from '../data/demoData';

interface AIAdvisorStepProps {
    onNext: () => void;
    onInteraction: () => void;
    interactionsCompleted: number;
    requiredInteractions: number;
}

export default function AIAdvisorStep({ onNext, onInteraction, interactionsCompleted, requiredInteractions }: AIAdvisorStepProps) {
    const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const suggestedQuestions = [
        "Which vendor has the best housing rate?",
        "Why is MHALA underperforming?",
        "How can we reduce overall cost per outcome?",
        "What are the biggest bottlenecks in our system?"
    ];

    const handleSend = (question: string) => {
        const userMessage = { role: 'user' as const, content: question };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const response = aiStrategicResponses[question] ||
                "I can provide insights on vendor performance, cost optimization, service gaps, and strategic recommendations. Try asking one of the suggested questions!";

            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
            setIsTyping(false);
            onInteraction(); // Track question asked
        }, 1500);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
                <h1 className="text-4xl font-black tracking-tighter">
                    <span className="text-[var(--primary)]">Layer 8:</span> AI Strategic Advisor
                </h1>
                <p className="text-lg text-[var(--text-muted)]">
                    Natural language interface to system intelligence
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chat Interface */}
                <div className="lg:col-span-2 nexus-card-outlined bg-[var(--surface)] flex flex-col h-[600px]">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-[var(--border-crisp)] flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
                            <Sparkles className="text-[var(--primary)]" size={20} />
                        </div>
                        <div>
                            <h3 className="font-black">Strategic AI Advisor</h3>
                            <p className="text-xs text-[var(--text-muted)]">Powered by Claude 4.5</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {messages.length === 0 && (
                            <div className="text-center py-12 space-y-4">
                                <div className="w-16 h-16 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mx-auto">
                                    <Sparkles className="text-[var(--primary)]" size={32} />
                                </div>
                                <div>
                                    <h4 className="font-black mb-2">Ask Me Anything</h4>
                                    <p className="text-sm text-[var(--text-muted)]">
                                        I can analyze vendor performance, identify bottlenecks, and provide strategic recommendations.
                                    </p>
                                </div>
                            </div>
                        )}

                        {messages.map((message, i) => (
                            <div
                                key={i}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}
                            >
                                <div className={`max-w-[80%] rounded-2xl p-4 ${message.role === 'user'
                                    ? 'bg-[var(--primary)] text-white'
                                    : 'bg-[var(--background)] border border-[var(--border-crisp)]'
                                    }`}>
                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start animate-in fade-in duration-300">
                                <div className="bg-[var(--background)] border border-[var(--border-crisp)] rounded-2xl p-4">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-[var(--border-crisp)]">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && input && handleSend(input)}
                                placeholder="Ask a strategic question..."
                                className="flex-1 px-4 py-3 bg-[var(--background)] border border-[var(--border-crisp)] rounded-xl outline-none focus:border-[var(--primary)] transition-all"
                            />
                            <button
                                onClick={() => input && handleSend(input)}
                                disabled={!input}
                                className="nexus-button nexus-button-primary px-4 py-3 disabled:opacity-50"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Suggested Questions */}
                    <div className="nexus-card-outlined bg-[var(--surface)] p-6 space-y-4">
                        <h3 className="font-black">Suggested Questions</h3>
                        <div className="space-y-2">
                            {suggestedQuestions.map((question, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSend(question)}
                                    className="w-full text-left p-3 bg-[var(--background)] hover:bg-[var(--surface-hover)] border border-[var(--border-crisp)] rounded-lg text-sm transition-all"
                                >
                                    {question}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Features */}
                    <div className="nexus-card-outlined bg-[var(--surface)] p-6 space-y-4">
                        <h3 className="font-black">What I Can Do</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="text-[var(--primary)]">•</span>
                                <span>Analyze vendor performance trends</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[var(--primary)]">•</span>
                                <span>Identify system bottlenecks</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[var(--primary)]">•</span>
                                <span>Recommend budget reallocations</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[var(--primary)]">•</span>
                                <span>Predict capacity issues</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[var(--primary)]">•</span>
                                <span>Generate custom reports</span>
                            </li>
                        </ul>
                    </div>

                    <button
                        onClick={onNext}
                        className="w-full nexus-button nexus-button-primary py-3"
                    >
                        Next: Business Model →
                    </button>
                </div>
            </div>
        </div>
    );
}
