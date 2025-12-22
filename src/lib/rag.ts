import { generateCompletion, generateEmbedding } from './ollama';
import { KnowledgeEntry } from '@prisma/client';

export interface ScoredEntry extends KnowledgeEntry {
    score: number;
}

function dotProduct(a: number[], b: number[]): number {
    return a.reduce((sum, val, i) => sum + val * b[i], 0);
}

function magnitude(vec: number[]): number {
    return Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
}

export function cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    const dot = dotProduct(a, b);
    const magA = magnitude(a);
    const magB = magnitude(b);
    if (magA === 0 || magB === 0) return 0;
    return dot / (magA * magB);
}

export function findSimilar(queryEmbedding: number[], entries: KnowledgeEntry[], threshold = 0.3, topK = 5): ScoredEntry[] {
    const scored = entries.map(entry => {
        // entry.embedding is Json, need to cast generic Json to number[]
        // In production, might want to validate this structure
        const embedding = entry.embedding as unknown as number[];
        if (!Array.isArray(embedding)) return { ...entry, score: 0 };

        return {
            ...entry,
            score: cosineSimilarity(queryEmbedding, embedding)
        };
    });

    return scored
        .filter(item => item.score > threshold)
        .sort((a, b) => b.score - a.score)
        .slice(0, topK);
}

export async function processQuery(query: string, allEntries: KnowledgeEntry[]) {
    // 1. Generate embedding for query
    const queryEmbedding = await generateEmbedding(query, 'query');

    // 2. Find similar entries
    const sources = findSimilar(queryEmbedding, allEntries);

    // 3. Construct prompt
    let prompt = '';
    if (sources.length === 0) {
        // No context found
        // Optionally return canned response immediately or let LLM handle it with instructions
        // Requirement: "If info not found, respond: 'I don't have that information. Please contact us...'"
        // We can just return strict response here to save LLM call, OR ask LLM.
        // The requirement says "LLM should ONLY answer from knowledge base... If info not found, respond: ..."
        // To be safe and fast:
        return {
            response: "I don't have that information. Please contact us at kenmarkitan.com/contact",
            sources: []
        };
    } else {
        const contextText = sources.map(s => `Q: ${s.question}\nA: ${s.answer}`).join('\n\n');
        prompt = `You are Kenmark ITan assistant. Answer ONLY using this context:\n\n${contextText}\n\nUser question: ${query}\n\nIf context doesn't contain answer, say you don't know.`;

        // 4. Generate response
        const response = await generateCompletion(prompt);

        return {
            response,
            sources
        };
    }
}
