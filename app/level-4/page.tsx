"use client";

import { useState } from 'react';
import { LLMExplainer } from "@/components/level4/llm-explainer";
import { ImageToTextExplainer } from "@/components/level4/image-to-text-explainer";
import Link from 'next/link';
import { ArrowLeft, MessageSquare, Camera } from 'lucide-react';

export default function Level4Page() {
    const [currentIdea, setCurrentIdea] = useState<number | null>(null);

    if (currentIdea === 1) {
        return <LLMExplainer />;
    }

    if (currentIdea === 2) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-100 to-cyan-100 p-8">
                <header className="mb-8">
                    <button
                        onClick={() => setCurrentIdea(null)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition font-bold"
                    >
                        <ArrowLeft className="w-6 h-6" />
                        Retour au menu
                    </button>
                </header>
                <ImageToTextExplainer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-pink-100 to-purple-100">
            <header className="bg-pink-500 py-6 shadow-lg">
                <div className="container mx-auto px-4">
                    <Link href="/" className="inline-flex items-center gap-2 text-white hover:text-pink-100 transition mb-4">
                        <ArrowLeft className="w-6 h-6" />
                        <span className="font-bold">Retour à l'accueil</span>
                    </Link>
                    <h1 className="text-4xl font-bold text-white text-center">Niveau 4 : Comprendre les LLM 🤖</h1>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Idea 1 Card */}
                    <button
                        onClick={() => setCurrentIdea(1)}
                        className="bg-white rounded-3xl p-8 shadow-xl border-4 border-pink-400 hover:scale-105 transition transform text-left group"
                    >
                        <div className="bg-pink-100 w-20 h-20 rounded-full flex items-center justify-center mb-6 group-hover:bg-pink-200 transition">
                            <MessageSquare className="w-10 h-10 text-pink-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">1. La Machine à Mots</h2>
                        <p className="text-gray-600">Découvre comment l'IA devine le prochain mot (Next Token Prediction).</p>
                    </button>

                    {/* Idea 2 Card */}
                    <button
                        onClick={() => setCurrentIdea(2)}
                        className="bg-white rounded-3xl p-8 shadow-xl border-4 border-blue-400 hover:scale-105 transition transform text-left group"
                    >
                        <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-200 transition">
                            <Camera className="w-10 h-10 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">2. L'Œil qui Lit (OCR)</h2>
                        <p className="text-gray-600">Regarde comment l'IA transforme une image en texte numérique.</p>
                    </button>
                </div>
            </main>
        </div>
    );
}
