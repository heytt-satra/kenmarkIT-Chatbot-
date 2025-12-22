
const Groq = require('groq-sdk');
let pipelineModule: any;

// Singleton for embedding pipeline
let embeddingPipeline: any = null;

// Initialize Groq Client
const apiKey = process.env.GROQ_API_KEY;
if (!apiKey) {
    console.warn("GROQ_API_KEY is missing from environment variables!");
}
const groq = new Groq({ apiKey: apiKey || 'dummy_key' });

// export async function generateEmbedding(text: string, type: 'query' | 'document' = 'document'): Promise<number[]> {
//     if (!embeddingPipeline) {
//         console.log('Initializing transformer pipeline...');
//         // @ts-ignore - dynamic import handling
//         const { pipeline } = await import('@xenova/transformers');

//         // Use a smaller, efficient model suitable for CPU/Edge
//         embeddingPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
//     }

//     // Generate embedding
//     const output = await embeddingPipeline(text, { pooling: 'mean', normalize: true });
export async function generateEmbedding(text: string, type: 'query' | 'document' = 'document'): Promise<number[]> {
    try {
        if (!embeddingPipeline) {
            console.log('Initializing transformer pipeline...');
            // @ts-ignore - dynamic import handling
            const { pipeline } = await import('@xenova/transformers');

            // Use a smaller, efficient model suitable for CPU/Edge
            embeddingPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        }

        // Generate embedding
        const output = await embeddingPipeline(text, { pooling: 'mean', normalize: true });
        return Array.from(output.data);
    } catch (e) {
        console.error("Embedding generation failed (falling back to mock):", e);
        // Fallback to mock embedding to allow local dev even if binary fails
        // This ensures Vercel deployment (where binary works) is not blocked
        return new Array(384).fill(0.1);
    }
}

export async function generateCompletion(prompt: string, model = 'llama-3.1-8b-instant'): Promise<string> {
    try {
        console.log(`Calling Groq API with model ${model}...`);
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            model: model,
            temperature: 0.1, // Low temp for factual answers
        });

        return chatCompletion.choices[0]?.message?.content || '';
    } catch (error: any) {
        console.error('Groq API Error:', error);
        throw new Error(`Failed to generate completion: ${error.message}`);
    }
}
