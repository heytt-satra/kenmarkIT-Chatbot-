import Chatbot from '@/components/Chatbot';
import { ArrowRight, Bot, Database, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans selection:bg-blue-100">
      {/* Hero Section */}
      <header className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 -z-10" />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium text-sm mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Kenmark ITan AI Assistant Online
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            Intelligent Support <br /> Powered by RAG
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Experience next-generation customer service with our AI chatbot, capable of answering questions from our knowledge base instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-1">
              Try the Chatbot ↘
            </button>
            <a href="/admin" className="px-8 py-4 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold text-lg transition-all">
              Admin Dashboard
            </a>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <Database className="w-8 h-8 text-blue-600" />,
                title: "Knowledge Base",
                desc: "Uploaded Excel files are parsed and vector-indexed for accurate retrieval."
              },
              {
                icon: <Bot className="w-8 h-8 text-indigo-600" />,
                title: "AI Powered",
                desc: "Uses Llama 3.2 locally via Ollama to generate natural language responses."
              },
              {
                icon: <Zap className="w-8 h-8 text-amber-500" />,
                title: "Instant Answers",
                desc: "Retrieve relevant context and answer user queries in milliseconds."
              }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl w-fit">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
        <p>© 2024 Kenmark ITan Solutions. Built with Next.js 16 & Ollama.</p>
      </footer>

      {/* Chatbot Widget */}
      <Chatbot />
    </div>
  );
}
