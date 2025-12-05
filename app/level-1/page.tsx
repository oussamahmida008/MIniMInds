"use client";

import { useState } from 'react';
import { WhatAISees } from "@/components/level1/idea1-what-ai-sees";
import { MagicMirror } from "@/components/level1/idea4-magic-mirror";
import { ObjectDetector } from "@/components/level1/idea5-object-detector";
import Link from 'next/link';
import { ArrowLeft, Eye, Zap, Target } from 'lucide-react';

export default function Level1Page() {
    const [currentIdea, setCurrentIdea] = useState<number | null>(null);

    if (currentIdea === 1) {
        return <WhatAISees />;
    }

    if (currentIdea === 2) {
        return <MagicMirror />;
    }

    if (currentIdea === 3) {
        return <ObjectDetector />;
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-green-100 to-emerald-100">
            <header className="bg-green-500 py-6 shadow-lg">
                <div className="container mx-auto px-4">
                    <Link href="/" className="inline-flex items-center gap-2 text-white hover:text-green-100 transition mb-4">
                        <ArrowLeft className="w-6 h-6" />
                        <span className="font-bold">Retour à l'accueil</span>
                    </Link>
                    <h1 className="text-4xl font-bold text-white text-center">Niveau 1 : Reconnais les Objets ! 📸</h1>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Idea 1 Card */}
                    <button
                        onClick={() => setCurrentIdea(1)}
                        className="bg-white rounded-3xl p-8 shadow-xl border-4 border-green-400 hover:scale-105 transition transform text-left group"
                    >
                        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-200 transition">
                            <Eye className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">1. Qu'est-ce que l'IA voit ?</h2>
                        <p className="text-gray-600">Regarde le monde à travers les yeux de l'IA et découvre comment elle analyse les images.</p>
                    </button>

                    {/* Idea 2 Card */}
                    <button
                        onClick={() => setCurrentIdea(2)}
                        className="bg-white rounded-3xl p-8 shadow-xl border-4 border-cyan-400 hover:scale-105 transition transform text-left group"
                    >
                        <div className="bg-cyan-100 w-20 h-20 rounded-full flex items-center justify-center mb-6 group-hover:bg-cyan-200 transition">
                            <Zap className="w-10 h-10 text-cyan-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">2. Miroir Magique</h2>
                        <p className="text-gray-600">L'IA détecte ton corps en 33 points ! Touche ton nez et découvre comment l'IA voit le mouvement.</p>
                    </button>

                    {/* Idea 3 Card */}
                    <button
                        onClick={() => setCurrentIdea(3)}
                        className="bg-white rounded-3xl p-8 shadow-xl border-4 border-indigo-400 hover:scale-105 transition transform text-left group"
                    >
                        <div className="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mb-6 group-hover:bg-indigo-200 transition">
                            <Target className="w-10 h-10 text-indigo-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">3. Détecteur d'Objets</h2>
                        <p className="text-gray-600">L'IA trouve et encadre automatiquement tous les objets qu'elle voit dans l'image.</p>
                    </button>
                </div>
            </main>
        </div>
    );
}
