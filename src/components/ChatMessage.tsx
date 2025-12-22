import React from 'react';
import { twMerge } from 'tailwind-merge';

interface Message {
    role: 'user' | 'bot';
    content: string;
}

interface ChatMessageProps {
    message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.role === 'user';

    return (
        <div className={twMerge("flex w-full mb-4", isUser ? "justify-end" : "justify-start")}>
            <div
                className={twMerge(
                    "max-w-[80%] px-4 py-2 rounded-2xl text-sm leading-relaxed shadow-sm",
                    isUser
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100 rounded-bl-none"
                )}
            >
                <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
        </div>
    );
}
