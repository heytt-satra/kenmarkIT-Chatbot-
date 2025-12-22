'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minus, ChevronDown } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';

interface Message {
    role: 'user' | 'bot';
    content: string;
}

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState('');

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize session and load history (optional persistence within session)
    useEffect(() => {
        // Generate simple session ID if not exists
        let sid = sessionStorage.getItem('chatSessionId');
        if (!sid) {
            sid = crypto.randomUUID();
            sessionStorage.setItem('chatSessionId', sid);
        }
        setSessionId(sid);

        // Load messages from local storage if needed (requirement: persists during browser session)
        const saved = sessionStorage.getItem('chatMessages');
        if (saved) {
            try {
                setMessages(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse chat history', e);
            }
        }
    }, []);

    // Save messages to session storage
    useEffect(() => {
        if (messages.length > 0) {
            sessionStorage.setItem('chatMessages', JSON.stringify(messages));
        }
    }, [messages]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading, isOpen]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
        setIsMinimized(false);
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: Message = { role: 'user', content: input.trim() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg.content, sessionId }),
            });

            if (!res.ok) throw new Error('Failed to send message');

            const data = await res.json();
            const botMsg: Message = { role: 'bot', content: data.response };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'bot', content: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={toggleChat}
                    className="fixed bottom-5 right-5 w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 z-50"
                    aria-label="Open chat"
                >
                    <MessageCircle size={32} />
                </button>
            )}

            {/* Chat Window */}
            <div
                className={twMerge(
                    "fixed bottom-5 right-5 bg-white dark:bg-gray-900 shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 ease-in-out z-50 flex flex-col border border-gray-200 dark:border-gray-800",
                    isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none",
                    isMinimized ? "w-72 h-14" : "w-[90vw] h-[80vh] sm:w-[400px] sm:h-[600px]"
                )}
            >
                {/* Header */}
                <div className="bg-blue-600 text-white p-4 flex items-center justify-between shadow-md shrink-0">
                    <div className="flex items-center space-x-2">
                        <MessageCircle size={20} />
                        <h3 className="font-semibold text-lg">Kenmark Assistant</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setIsMinimized(!isMinimized)}
                            className="p-1 hover:bg-blue-700 rounded transition-colors"
                        >
                            {isMinimized ? <ChevronDown size={20} /> : <Minus size={20} />}
                        </button>
                        <button
                            onClick={toggleChat}
                            className="p-1 hover:bg-blue-700 rounded transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className={twMerge("flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-950", isMinimized && "hidden")}>
                    {messages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center p-4">
                            <MessageCircle size={48} className="mb-2 opacity-50" />
                            <p>Hi! How can I help you regarding Kenmark ITan Solutions?</p>
                        </div>
                    )}

                    {messages.map((msg, idx) => (
                        <ChatMessage key={idx} message={msg} />
                    ))}

                    {isLoading && (
                        <div className="flex justify-start mb-4">
                            <TypingIndicator />
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className={twMerge("p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800", isMinimized && "hidden")}>
                    <div className="flex items-end space-x-2">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your question..."
                            className="flex-1 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 resize-none max-h-32 min-h-[50px]"
                            rows={1}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-3 rounded-xl transition-colors shadow-sm"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                    <div className="text-xs text-center text-gray-400 mt-2">
                        Powered by Kenmark ITan AI
                    </div>
                </div>
            </div>
        </>
    );
}
