# Kenmark ITan AI Chatbot

A production-ready AI chatbot for kenmarkitan.com that uses RAG (Retrieval-Augmented Generation) to answer questions based on company knowledge.

## Tech Stack
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB (via Prisma v5)
- **AI Engine**: Ollama (Llama 3.2, Nomic Embed Text)
- **Vector Search**: Cosine similarity (in-memory/On-demand)

## Setup Instructions

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/heytt-satra/kenmarkIT-Chatbot-.git
    cd kenmarkIT-Chatbot-
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Database**:
    - Ensure you have a MongoDB instance running (local or Atlas).
    - Create a `.env` file in the root directory:
      ```env
      DATABASE_URL="your-mongodb-connection-string"
      ```

4.  **Setup Ollama**:
    - Install [Ollama](https://ollama.com/).
    - Pull the required models:
      ```bash
      ollama pull llama3.2:3b
      ollama pull nomic-embed-text
      ```
    - Ensure Ollama is running (`ollama serve`).

5.  **Initialize Database**:
    ```bash
    npx prisma generate
    npx prisma db push
    ```

6.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Visit `http://localhost:3000`.

## Knowledge Management

1.  Navigate to `/admin` (e.g., `http://localhost:3000/admin`).
2.  Upload the included sample file: `public/demo_knowledge.xlsx`.
3.  The system will parse the file, generate embeddings with `search_document:` prefix, and store them in MongoDB.

## Deployment Notes

- **Vercel/Netlify**: The frontend and API routes can be deployed to Vercel.
- **AI/Ollama**: Since Ollama runs locally, for a production deployment you must either:
  - Host Ollama on a VPS (e.g., DigitalOcean, AWS EC2) and expose it via ngrok/tailscale.
  - Use an external LLM provider key (OpenAI/Anthropic) by modifying `src/lib/ollama.ts`.

## Deliverables
- **Codebase**: Complete Next.js project.
- **Sample Data**: `public/demo_knowledge.xlsx` included.
- **Documentation**: This README.

## Future Improvements
- Authentication for Admin Dashboard.
- Vector Database (e.g., Qdrant, Pinecone) for scalability.
- Analytics Dashboard.
