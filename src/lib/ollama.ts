export async function generateEmbedding(text: string, type: 'query' | 'document' = 'document'): Promise<number[]> {
    const prefix = type === 'query' ? 'search_query: ' : 'search_document: ';
    const promptWithPrefix = prefix + text.trim();

    const response = await fetch('http://localhost:11434/api/embeddings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'nomic-embed-text',
            prompt: promptWithPrefix,
        }),
    });

    if (!response.ok) {
        throw new Error(`Failed to generate embedding: ${response.statusText}`);
    }

    const data = await response.json();
    return data.embedding;
}

export async function generateCompletion(prompt: string, model = 'llama3.2:3b'): Promise<string> {
    const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model,
            prompt,
            stream: false,
        }),
    });

    if (!response.ok) {
        throw new Error(`Failed to generate completion: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response;
}
