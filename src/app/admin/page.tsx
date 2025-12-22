'use client';

import React, { useState, useEffect } from 'react';
import { Upload, FileSpreadsheet, Database, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

interface KnowledgeEntry {
    id: string;
    category: string;
    question: string;
    answer: string;
    source: string;
    createdAt: string;
}

export default function AdminPage() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
    const [stats, setStats] = useState({ total: 0 });
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const fetchKnowledge = async () => {
        try {
            const res = await fetch('/api/admin/knowledge?limit=50');
            const data = await res.json();
            setEntries(data.entries);
            setStats({ total: data.total });
        } catch (err) {
            console.error('Failed to fetch knowledge', err);
        }
    };

    useEffect(() => {
        fetchKnowledge();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setMessage(null);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        setMessage(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: data.message });
                setFile(null);
                // Reset file input
                const input = document.getElementById('file-upload') as HTMLInputElement;
                if (input) input.value = '';
                fetchKnowledge();
            } else {
                setMessage({ type: 'error', text: data.error || data.message || 'Upload failed' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'An unexpected error occurred.' });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                <header className="mb-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Knowledge Base Admin</h1>
                        <p className="text-gray-500 dark:text-gray-400">Manage knowledge sources for the AI Chatbot.</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center space-x-3">
                            <Database className="text-blue-600" />
                            <div>
                                <div className="text-xs text-gray-500 uppercase font-semibold">Total Entries</div>
                                <div className="text-2xl font-bold">{stats.total}</div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Upload Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sticky top-8">
                            <h2 className="text-xl font-bold mb-6 flex items-center">
                                <Upload className="w-5 h-5 mr-2 text-blue-600" />
                                Upload Knowledge
                            </h2>

                            <form onSubmit={handleUpload} className="space-y-4">
                                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        id="file-upload"
                                        accept=".xlsx"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <FileSpreadsheet className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                                    <p className="text-sm font-medium">
                                        {file ? file.name : "Drop .xlsx file here or click to browse"}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">Excel files with Category, Question, Answer columns</p>
                                </div>

                                {message && (
                                    <div className={`p-4 rounded-xl flex items-start space-x-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'}`}>
                                        {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                                        <p className="text-sm">{message.text}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={!file || uploading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center"
                                >
                                    {uploading ? (
                                        <>
                                            <RefreshCw className="animate-spin mr-2" size={18} />
                                            Processing...
                                        </>
                                    ) : (
                                        "Upload & Process"
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* List Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                <h2 className="text-xl font-bold">Recent Entries</h2>
                                <button onClick={fetchKnowledge} className="text-blue-600 hover:underline text-sm font-medium flex items-center">
                                    <RefreshCw size={14} className="mr-1" /> Refresh
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 uppercase text-xs">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold">Question</th>
                                            <th className="px-6 py-4 font-semibold">Category</th>
                                            <th className="px-6 py-4 font-semibold">Source</th>
                                            <th className="px-6 py-4 font-semibold">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {entries.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                                    No entries found. Upload an Excel file to get started.
                                                </td>
                                            </tr>
                                        ) : (
                                            entries.map((entry) => (
                                                <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                    <td className="px-6 py-4 font-medium max-w-xs truncate" title={entry.question}>{entry.question}</td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                                                            {entry.category}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500">{entry.source}</td>
                                                    <td className="px-6 py-4 text-gray-500">{new Date(entry.createdAt).toLocaleDateString()}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
