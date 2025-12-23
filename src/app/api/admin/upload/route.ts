
import { NextRequest, NextResponse } from 'next/server';
import { parseExcel } from '@/lib/excel-parser';
import { generateEmbedding } from '@/lib/ollama';
import { prisma } from '@/utils/db';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const entries = await parseExcel(buffer);

        if (entries.length === 0) {
            return NextResponse.json({ message: 'No valid entries found in Excel' }, { status: 400 });
        }

        let addedCount = 0;

        // Process in batches or one by one. For simplicity, one by one.
        const validEntries = [];

        // Generate embeddings first
        for (const entry of entries) {
            try {
                const embedding = await generateEmbedding(entry.answer);
                validEntries.push({
                    category: entry.category,
                    question: entry.question,
                    answer: entry.answer,
                    source: entry.source,
                    embedding: embedding,
                });
            } catch (e) {
                console.error(`Failed to enable embedding for: ${entry.question}`, e);
            }
        }

        if (validEntries.length > 0) {
            await prisma.knowledgeEntry.createMany({
                data: validEntries,
            });
            addedCount = validEntries.length;
        }

        return NextResponse.json({
            success: true,
            message: `Successfully added ${addedCount} entries`,
            entriesAdded: addedCount
        });

    } catch (error: unknown) {
        console.error('Upload error FULL:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
