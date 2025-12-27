"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
    MessageCircle,
    Send,
    Loader2,
    Sparkles,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    Lightbulb,
    BarChart3
} from 'lucide-react';

interface Recommendation {
    title: string;
    description: string;
    impact: string;
    priority: 'high' | 'medium' | 'low';
}

interface Message {
    role: 'user' | 'assistant';
    content: string;
    recommendations?: Recommendation[];
    key_insights?: string[];
    data_citations?: string[];
    confidence_score?: number;
    timestamp: Date;
}

export default function AIStrategicAdvisor() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [suggestedQuestions, setSuggestedQuestions] = useState<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Fetch suggested questions on mount
        fetchSuggestedQuestions();
    }, []);

    useEffect(() => {
        // Scroll to bottom when new messages arrive
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchSuggestedQuestions = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ai-advisor/suggested-questions`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                setSuggestedQuestions(data);
            }
        } catch (err) {
            console.error('Failed to fetch suggested questions:', err);
        }
    };

    const handleSendMessage = async (questionText?: string) => {
        const question = questionText || input.trim();
        if (!question) return;

        // Add user message
        const userMessage: Message = {
            role: 'user',
            content: question,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ai-advisor/ask`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        question,
                        include_context: true
                    })
                }
            );

            if (!response.ok) {
                throw new Error('Failed to get AI response');
            }

            const data = await response.json();

            // Add assistant message
            const assistantMessage: Message = {
                role: 'assistant',
                content: data.answer,
                recommendations: data.recommendations,
                key_insights: data.key_insights,
                data_citations: data.data_citations,
                confidence_score: data.confidence_score,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, assistantMessage]);

        } catch (err) {
            console.error('Error getting AI response:', err);
            const errorMessage: Message = {
                role: 'assistant',
                content: 'Sorry, I encountered an error processing your question. Please try again.',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-red-500 bg-red-500/10 border-red-500/20';
            case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            case 'low': return 'text-green-500 bg-green-500/10 border-green-500/20';
            default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
        }
    };

    return (
        <div className="flex flex-col h-[700px] nexus-card overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-[var(--border-crisp)] bg-gradient-to-r from-[var(--primary-glow)] to-transparent">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[var(--primary)] flex items-center justify-center">
                        <Sparkles className="text-white" size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">AI Strategic Advisor</h3>
                        <p className="text-xs text-[var(--text-muted)]">
                            Ask me anything about your homeless services system
                        </p>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.length === 0 ? (
                    <div className="text-center py-12 space-y-6">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--primary-glow)] mb-4">
                            <MessageCircle className="text-[var(--primary)]" size={40} />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold mb-2">Welcome to your AI Strategic Advisor</h4>
                            <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto">
                                I have access to all your system data and can provide insights on vendor performance,
                                cost optimization, housing outcomes, and strategic recommendations.
                            </p>
                        </div>

                        {/* Suggested Questions */}
                        {suggestedQuestions && (
                            <div className="text-left max-w-2xl mx-auto space-y-4">
                                <h5 className="text-sm font-bold text-[var(--text-muted)] uppercase">
                                    Suggested Questions:
                                </h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {suggestedQuestions.categories.slice(0, 2).map((category: any) => (
                                        <div key={category.category} className="space-y-2">
                                            <div className="text-xs font-bold text-[var(--primary)]">
                                                {category.category}
                                            </div>
                                            {category.questions.slice(0, 3).map((q: string, i: number) => (
                                                <button
                                                    key={i}
                                                    onClick={() => handleSendMessage(q)}
                                                    className="w-full text-left p-3 bg-[var(--surface-hover)]/30 hover:bg-[var(--surface-hover)] border border-[var(--border-crisp)] rounded-lg transition-all text-xs"
                                                >
                                                    "{q}"
                                                </button>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] ${
                                        message.role === 'user'
                                            ? 'bg-[var(--primary)] text-white rounded-2xl rounded-br-sm p-4'
                                            : 'bg-[var(--surface-hover)] rounded-2xl rounded-bl-sm p-4 space-y-4'
                                    }`}
                                >
                                    {/* Message Content */}
                                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                                        {message.content}
                                    </div>

                                    {/* AI Message Extras */}
                                    {message.role === 'assistant' && (
                                        <>
                                            {/* Key Insights */}
                                            {message.key_insights && message.key_insights.length > 0 && (
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-xs font-bold text-[var(--primary)]">
                                                        <Lightbulb size={14} />
                                                        Key Insights
                                                    </div>
                                                    <ul className="space-y-1">
                                                        {message.key_insights.map((insight, i) => (
                                                            <li key={i} className="text-xs flex items-start gap-2">
                                                                <span className="text-[var(--primary)] mt-1">•</span>
                                                                <span className="text-[var(--text-muted)]">{insight}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Recommendations */}
                                            {message.recommendations && message.recommendations.length > 0 && (
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2 text-xs font-bold text-[var(--primary)]">
                                                        <TrendingUp size={14} />
                                                        Recommendations
                                                    </div>
                                                    {message.recommendations.map((rec, i) => (
                                                        <div
                                                            key={i}
                                                            className="p-3 bg-[var(--background)] border border-[var(--border-crisp)] rounded-lg space-y-2"
                                                        >
                                                            <div className="flex items-start justify-between gap-2">
                                                                <div className="font-bold text-sm">{rec.title}</div>
                                                                <div className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${getPriorityColor(rec.priority)}`}>
                                                                    {rec.priority}
                                                                </div>
                                                            </div>
                                                            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                                                                {rec.description}
                                                            </p>
                                                            <div className="flex items-start gap-2 text-xs">
                                                                <CheckCircle size={12} className="text-green-500 mt-0.5 flex-shrink-0" />
                                                                <span className="text-[var(--text-muted)]">
                                                                    <strong>Impact:</strong> {rec.impact}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Data Citations */}
                                            {message.data_citations && message.data_citations.length > 0 && (
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-muted)]">
                                                        <BarChart3 size={14} />
                                                        Data Sources
                                                    </div>
                                                    <ul className="space-y-1">
                                                        {message.data_citations.map((citation, i) => (
                                                            <li key={i} className="text-xs text-[var(--text-muted)] flex items-start gap-2">
                                                                <span className="mt-1">•</span>
                                                                <span>{citation}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Confidence Score */}
                                            {message.confidence_score !== undefined && (
                                                <div className="flex items-center gap-2 text-xs">
                                                    <div className="text-[var(--text-muted)]">Confidence:</div>
                                                    <div className="flex-1 h-2 bg-[var(--background)] rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-[var(--primary)] transition-all"
                                                            style={{ width: `${message.confidence_score}%` }}
                                                        ></div>
                                                    </div>
                                                    <div className="font-bold text-[var(--primary)]">
                                                        {message.confidence_score}%
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {/* Timestamp */}
                                    <div className={`text-[10px] ${message.role === 'user' ? 'text-white/70' : 'text-[var(--text-muted)]'}`}>
                                        {message.timestamp.toLocaleTimeString()}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-[var(--surface-hover)] rounded-2xl rounded-bl-sm p-4 flex items-center gap-2">
                                    <Loader2 className="animate-spin text-[var(--primary)]" size={16} />
                                    <span className="text-sm text-[var(--text-muted)]">Analyzing data...</span>
                                </div>
                            </div>
                        )}
                    </>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-[var(--border-crisp)] bg-[var(--surface-hover)]/30">
                <div className="flex gap-2">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask a question about your homeless services system..."
                        disabled={loading}
                        className="flex-1 px-4 py-3 bg-[var(--background)] border border-[var(--border-crisp)] rounded-lg resize-none focus:outline-none focus:border-[var(--primary)] text-sm disabled:opacity-50"
                        rows={2}
                    />
                    <button
                        onClick={() => handleSendMessage()}
                        disabled={!input.trim() || loading}
                        className="nexus-button nexus-button-primary px-6 self-end disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={18} />
                        ) : (
                            <Send size={18} />
                        )}
                    </button>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-2">
                    Press Enter to send • This AI has access to all system data
                </p>
            </div>
        </div>
    );
}
