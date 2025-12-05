"use client";

import { useState } from 'react';
import { BoundingBoxGame } from "@/components/level2/bounding-box-game";
import { ShapeRecognitionGame } from "@/components/level2/shape-recognition-game";
import Link from 'next/link';
import { ArrowLeft, Box, Pen } from 'lucide-react';

export default function Level2Page() {
    const [currentIdea, setCurrentIdea] = useState<number | null>(null);

    if (currentIdea === 1) {
        return <BoundingBoxGame />;
    }

    if (currentIdea === 2) {
        return <ShapeRecognitionGame />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
            <header className="bg-indigo-500 py-10 shadow-xl">
                <div className="container mx-auto px-6">
                    <Link href="/" className="inline-flex items-center gap-2 text-white hover:text-indigo-100 transition mb-6">
                        <ArrowLeft className="w-6 h-6" />
                        <span className="font-bold text-lg">Retour à l'accueil</span>
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold text-white text-center">Niveau 2 : Analyse d'Images et Formes 🎯</h1>
                </div>
            </header>

            <main className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                    {/* Idea 1 Card */}
                    <button
                        onClick={() => setCurrentIdea(1)}
                        className="bg-white rounded-3xl p-10 shadow-2xl border-4 border-purple-400 hover:scale-105 transition-all duration-300 transform text-left group"
                    >
                        <div className="bg-purple-100 w-24 h-24 rounded-full flex items-center justify-center mb-8 group-hover:bg-purple-200 transition">
                            <Box className="w-12 h-12 text-purple-600" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Jeu des Boîtes</h2>
                        <p className="text-lg text-gray-600 leading-relaxed">Aide l'IA à créer les bonnes boîtes autour des objets pour les reconnaître parfaitement.</p>
                    </button>

                    {/* Idea 2 Card */}
                    <button
                        onClick={() => setCurrentIdea(2)}
                        className="bg-white rounded-3xl p-10 shadow-2xl border-4 border-cyan-400 hover:scale-105 transition-all duration-300 transform text-left group"
                    >
                        <div className="bg-cyan-100 w-24 h-24 rounded-full flex items-center justify-center mb-8 group-hover:bg-cyan-200 transition">
                            <Pen className="w-12 h-12 text-cyan-600" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Reconnaître les Formes</h2>
                        <p className="text-lg text-gray-600 leading-relaxed">Dessine une forme géométrique et découvre comment l'IA l'analyse pixel par pixel !</p>
                    </button>
                </div>
            </main>
        </div>
    );
}