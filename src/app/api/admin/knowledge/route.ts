import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/db';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const total = await prisma.knowledgeEntry.count();

        // Pagination params
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const skip = (page - 1) * limit;

        const entries = await prisma.knowledgeEntry.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                category: true,
                question: true,
                answer: true,
                source: true,
                createdAt: true,
                // Exclude embedding to reduce payload size
            }
        });

        return NextResponse.json({
            total,
            page,
            limit,
            entries
        });

    } catch (error: unknown) {
        console.error('Fetch error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
