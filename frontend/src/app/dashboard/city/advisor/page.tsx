"use client";

import { useState } from 'react';
import { MessageSquare, Send, Sparkles } from 'lucide-react';

export default function AIAdvisorPage() {
    const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const predefinedResponses: Record<string, string> = {
        "why is mhala underperforming": "MHALA's 24% housing rate is concerning. Analysis shows: 1) They serve highest-acuity clients (avg VI-SPDAT 8.9 vs 6.2), 2) 40% staff turnover disrupts continuity, 3) Limited supportive housing inventory. Recommendation: Increase supportive housing units or restructure contract.",
        "how can we reduce cost per outcome": "Analysis shows reallocating 30% of MHALA's $2.1M contract to PATH would yield 47 additional placements annually at same cost. PATH's $21K cost-per-outcome vs MHALA's $78K creates $890K annual savings opportunity.",
        "which vendor should get more funding": "PATH demonstrates best ROI: 73% housing rate, $21K cost-per-outcome, 82% retention, +5% trend. Recommend expanding their contract by 25-30% and studying their best practices for system-wide implementation."
    };

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            const response = predefinedResponses[userMessage.toLowerCase()] ||
                "I can provide strategic insights on vendor performance, budget optimization, and system improvements. Try asking about vendor performance, cost reduction, or funding allocation.";

            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[var(--background)] p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-black mb-2">AI Strategic Advisor</h1>
                    <p className="text-[var(--text-muted)]">Ask strategic questions about vendor performance and system optimization</p>
                </div>

                <div className="nexus-card bg-[var(--surface)] h-[600px] flex flex-col">
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {messages.length === 0 && (
                            <div className="text-center py-12">
                                <Sparkles size={48} className="mx-auto mb-4 text-[var(--primary)]" />
                                <h3 className="font-bold mb-2">Ask a Strategic Question</h3>
                                <p className="text-sm text-[var(--text-muted)] mb-4">Try asking:</p>
                                <div className="space-y-2">
                                    <button onClick={() => setInput("Why is MHALA underperforming?")} className="block w-full text-left px-4 py-2 bg-[var(--background)] rounded-lg hover:bg-[var(--surface-hover)]">
                                        "Why is MHALA underperforming?"
                                    </button>
                                    <button onClick={() => setInput("How can we reduce cost per outcome?")} className="block w-full text-left px-4 py-2 bg-[var(--background)] rounded-lg hover:bg-[var(--surface-hover)]">
                                        "How can we reduce cost per outcome?"
                                    </button>
                                    <button onClick={() => setInput("Which vendor should get more funding?")} className="block w-full text-left px-4 py-2 bg-[var(--background)] rounded-lg hover:bg-[var(--surface-hover)]">
                                        "Which vendor should get more funding?"
                                    </button>
                                </div>
                            </div>
                        )}

                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-4 rounded-xl ${msg.role === 'user'
                                        ? 'bg-[var(--primary)] text-white'
                                        : 'bg-[var(--background)]'
                                    }`}>
                                    <p className="text-sm">{msg.content}</p>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-[var(--background)] p-4 rounded-xl">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" />
                                        <div className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                        <div className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-[var(--border-crisp)] p-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask a strategic question..."
                                className="flex-1 px-4 py-3 bg-[var(--background)] border border-[var(--border-crisp)] rounded-xl"
                            />
                            <button onClick={handleSend} className="nexus-button nexus-button-primary px-6">
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
