"use client";

import { useState } from 'react';
import { AIMistakesExplainer } from "@/components/level5/ai-mistakes-explainer";
import Link from 'next/link';
import { ArrowLeft, Brain, AlertTriangle } from 'lucide-react';

export default function Level5Page() {
    const [currentIdea, setCurrentIdea] = useState<number | null>(null);

    if (currentIdea === 1) {
        return <AIMistakesExplainer />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-100 to-red-100">
            <header className="bg-orange-500 py-10 shadow-xl">
                <div className="container mx-auto px-6">
                    <Link href="/" className="inline-flex items-center gap-2 text-white hover:text-orange-100 transition mb-6">
                        <ArrowLeft className="w-6 h-6" />
                        <span className="font-bold text-lg">Retour à l'accueil</span>
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold text-white text-center">🤖 Pourquoi l'IA fait des Erreurs ?</h1>
                </div>
            </header>

            <main className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 gap-10 max-w-3xl mx-auto">
                    {/* Idea 1 Card */}
                    <button
                        onClick={() => setCurrentIdea(1)}
                        className="bg-white rounded-3xl p-12 shadow-2xl border-4 border-orange-400 hover:scale-105 transition-all duration-300 transform text-left group"
                    >
                        <div className="bg-orange-100 w-28 h-28 rounded-full flex items-center justify-center mb-8 group-hover:bg-orange-200 transition mx-auto">
                            <Brain className="w-14 h-14 text-orange-600" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">Comprendre les Erreurs de l'IA</h2>
                        <p className="text-xl text-gray-600 leading-relaxed text-center">Découvrez pourquoi même les IA les plus intelligentes peuvent se tromper, et comment ça arrive.</p>
                    </button>
                </div>
            </main>
        </div>
    );
}