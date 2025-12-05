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
        <div className="min-h-screen bg-linear-to-br from-orange-100 to-red-100">
            <header className="bg-orange-500 py-6 shadow-lg">
                <div className="container mx-auto px-4">
                    <Link href="/" className="inline-flex items-center gap-2 text-white hover:text-orange-100 transition mb-4">
                        <ArrowLeft className="w-6 h-6" />
                        <span className="font-bold">Retour à l'accueil</span>
                    </Link>
                    <h1 className="text-4xl font-bold text-white text-center">🤖 Pourquoi l'IA fait des Erreurs ?</h1>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 gap-8 max-w-2xl mx-auto">
                    {/* Idea 1 Card */}
                    <button
                        onClick={() => setCurrentIdea(1)}
                        className="bg-white rounded-3xl p-8 shadow-xl border-4 border-orange-400 hover:scale-105 transition transform text-left group"
                    >
                        <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-200 transition">
                            <Brain className="w-10 h-10 text-orange-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Comprendre les Erreurs de l'IA</h2>
                        <p className="text-gray-600">Découvrez pourquoi même les IA les plus intelligentes peuvent se tromper, et comment ça arrive.</p>
                    </button>
                </div>
            </main>
        </div>
    );
}