import { NextRequest, NextResponse } from 'next/server';
import { processQuery } from '@/lib/rag';
import { prisma } from '@/utils/db';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { message, sessionId } = body;

        if (!message) {
            return NextResponse.json({ error: 'Message required' }, { status: 400 });
        }

        // 1. Fetch all knowledge entries (for small scale in-memory search)
        // Optimization: Cache this if it doesn't change often, or use vector DB
        const allEntries = await prisma.knowledgeEntry.findMany();

        // 2. Process query via RAG
        const { response, sources } = await processQuery(message, allEntries);

        // 3. Save chat log
        await prisma.chatLog.create({
            data: {
                sessionId: sessionId || 'anonymous',
                userMessage: message,
                botResponse: response,
            },
        });

        return NextResponse.json({ response, sources });

    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
