# Kenmark ITan AI Chatbot

A production-ready AI chatbot for kenmarkitan.com that uses RAG (Retrieval-Augmented Generation) to answer questions based on company knowledge.

## Tech Stack
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (Serverless compatible)
- **Database**: MongoDB (via Prisma v5)
- **AI Engine**: Groq (Llama 3 8B) + Transformers.js (Deep and lightweight embeddings)
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

3.  **Environment Variables**:
    Create a `.env` file:
    ```env
    DATABASE_URL="your-mongodb-connection-string"
    GROQ_API_KEY="your-groq-api-key"
    ```

4.  **Initialize Database**:
    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Visit `http://localhost:3000`.

## Knowledge Management

1.  Navigate to `/admin` (e.g., `http://localhost:3000/admin`).
2.  Upload the included sample file: `public/demo_knowledge.xlsx`.
3.  The system uses `@xenova/transformers` (WASM) to generate embeddings locally on the server—no external embedding API needed!

## Deployment (Vercel)

This project is **Vercel-ready**:
1.  Push code to GitHub.
2.  Import project in Vercel.
3.  Add `DATABASE_URL` and `GROQ_API_KEY` in Vercel Settings > Environment Variables.
4.  Deploy!

## Architecture

1.  **User Query**: User types a question.
2.  **Embedding**: Next.js Serverless Function runs `all-MiniLM-L6-v2` via WASM to vectorize the query.
3.  **Retrieval**: System searches MongoDB for matching vectors.
4.  **Generation**: Retrieved context is sent to **Groq API** (Llama 3).
5.  **Response**: High-speed answer returned to user.

## Deliverables
- **Codebase**: Complete Next.js project.
- **Sample Data**: `public/demo_knowledge.xlsx` included.
- **Documentation**: This README.

## Future Improvements
- Authentication for Admin Dashboard.
- Vector Database (e.g., Qdrant, Pinecone) for scalability.
- Analytics Dashboard.
