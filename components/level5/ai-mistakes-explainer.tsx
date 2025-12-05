"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Brain, AlertTriangle, BookOpen, Heart, Eye, Zap, Home } from 'lucide-react';
import Link from 'next/link';

interface MistakeScenario {
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    color: string;
    explanation: string;
    analogy: string;
}

export function AIMistakesExplainer() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [currentScenario, setCurrentScenario] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);
    const [robotMood, setRobotMood] = useState<'happy' | 'confused' | 'wrong'>('happy');

    const scenarios: MistakeScenario[] = [
        {
            title: "📚 Mémoire Imparfaite",
            description: "L'IA se souvient de quelque chose de faux",
            icon: BookOpen,
            color: "blue",
            explanation: "L'IA a lu des millions de livres, mais elle peut mélanger les détails ou se souvenir d'informations incorrectes.",
            analogy: "C'est comme quand tu apprends une leçon à l'école mais tu mélanges les dates ou les noms."
        },
        {
            title: "⚡ Réponses Trop Rapides",
            description: "L'IA devine sans réfléchir assez",
            icon: Zap,
            color: "yellow",
            explanation: "Parfois l'IA donne une réponse rapide sans vérifier tous les détails ou le contexte.",
            analogy: "Comme quand tu réponds à une question de maths sans lire le problème jusqu'au bout."
        },
        {
            title: "💝 Sentiments Différents",
            description: "L'IA ne comprend pas les émotions comme nous",
            icon: Heart,
            color: "pink",
            explanation: "L'IA peut analyser les mots, mais elle ne ressent pas les émotions de la même façon que les humains.",
            analogy: "C'est comme lire une histoire triste sans pleurer, ou une histoire drôle sans rire."
        },
        {
            title: "👁️ Vision Limitée",
            description: "L'IA ne voit pas le tableau complet",
            icon: Eye,
            color: "green",
            explanation: "L'IA ne voit que ce qu'elle a appris dans ses livres, pas les expériences de la vraie vie.",
            analogy: "Comme étudier la géographie sur une carte sans jamais voyager dans ces pays."
        }
    ];

    useEffect(() => {
        drawScenario();
    }, [currentScenario, robotMood]);

    const drawScenario = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#f0f9ff');
        gradient.addColorStop(1, '#e0f2fe');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw robot
        drawRobot(ctx, 150, 200);

        // Draw scenario-specific elements
        drawScenarioElements(ctx, currentScenario);

        // Draw thought bubble if confused or wrong
        if (robotMood === 'confused' || robotMood === 'wrong') {
            drawThoughtBubble(ctx);
        }
    };

    const drawRobot = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
        // Robot body
        ctx.fillStyle = robotMood === 'happy' ? '#10b981' : robotMood === 'confused' ? '#f59e0b' : '#ef4444';
        ctx.fillRect(x - 25, y - 50, 50, 60);

        // Robot head
        ctx.fillRect(x - 20, y - 80, 40, 35);

        // Eyes
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x - 15, y - 70, 8, 8);
        ctx.fillRect(x + 7, y - 70, 8, 8);

        // Pupils
        ctx.fillStyle = '#000000';
        ctx.fillRect(x - 12, y - 67, 4, 4);
        ctx.fillRect(x + 10, y - 67, 4, 4);

        // Mouth
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        if (robotMood === 'happy') {
            ctx.beginPath();
            ctx.arc(x, y - 55, 8, 0, Math.PI);
            ctx.stroke();
        } else if (robotMood === 'confused') {
            ctx.beginPath();
            ctx.moveTo(x - 5, y - 60);
            ctx.lineTo(x + 5, y - 50);
            ctx.moveTo(x + 5, y - 60);
            ctx.lineTo(x - 5, y - 50);
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.arc(x, y - 50, 6, Math.PI, 0);
            ctx.stroke();
        }

        // Arms
        ctx.fillStyle = '#6b7280';
        ctx.fillRect(x - 35, y - 30, 10, 30);
        ctx.fillRect(x + 25, y - 30, 10, 30);

        // Legs
        ctx.fillRect(x - 15, y + 10, 10, 30);
        ctx.fillRect(x + 5, y + 10, 10, 30);
    };

    const drawScenarioElements = (ctx: CanvasRenderingContext2D, scenarioIndex: number) => {
        switch (scenarioIndex) {
            case 0: // Memory mistake
                drawBooks(ctx);
                drawWrongAnswer(ctx);
                break;
            case 1: // Too fast
                drawClock(ctx);
                drawQuickAnswer(ctx);
                break;
            case 2: // Emotions
                drawHeart(ctx);
                drawConfusedFace(ctx);
                break;
            case 3: // Limited vision
                drawWorld(ctx);
                drawLimitedView(ctx);
                break;
        }
    };

    const drawBooks = (ctx: CanvasRenderingContext2D) => {
        // Draw stack of books
        ctx.fillStyle = '#8b4513';
        for (let i = 0; i < 3; i++) {
            ctx.fillRect(50 + i * 5, 100 + i * 15, 40, 50);
            ctx.fillStyle = '#a0522d';
            ctx.fillRect(45 + i * 5, 95 + i * 15, 50, 5);
        }

        // Wrong answer bubble
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(250, 150, 120, 40);
        ctx.strokeStyle = '#000000';
        ctx.strokeRect(250, 150, 120, 40);
        ctx.fillStyle = '#000000';
        ctx.font = '12px Arial';
        ctx.fillText('Paris is in Italy?', 260, 170);
    };

    const drawClock = (ctx: CanvasRenderingContext2D) => {
        // Draw clock
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(300, 150, 30, 0, 2 * Math.PI);
        ctx.stroke();

        // Clock hands
        ctx.beginPath();
        ctx.moveTo(300, 150);
        ctx.lineTo(300, 130);
        ctx.moveTo(300, 150);
        ctx.lineTo(310, 150);
        ctx.stroke();

        // Quick answer
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(100, 120, 80, 30);
        ctx.strokeRect(100, 120, 80, 30);
        ctx.fillStyle = '#000000';
        ctx.font = '10px Arial';
        ctx.fillText('2+2=5!', 110, 138);
    };

    const drawHeart = (ctx: CanvasRenderingContext2D) => {
        // Draw heart
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(280, 160);
        ctx.bezierCurveTo(280, 150, 270, 140, 260, 150);
        ctx.bezierCurveTo(250, 140, 240, 150, 240, 160);
        ctx.bezierCurveTo(240, 170, 250, 180, 260, 180);
        ctx.bezierCurveTo(270, 180, 280, 170, 280, 160);
        ctx.fill();

        // Confused face
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(120, 150, 25, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(110, 145, 2, 0, 2 * Math.PI);
        ctx.arc(130, 145, 2, 0, 2 * Math.PI);
        ctx.fill();

        ctx.strokeStyle = '#000000';
        ctx.beginPath();
        ctx.moveTo(115, 155);
        ctx.lineTo(125, 165);
        ctx.moveTo(125, 155);
        ctx.lineTo(115, 165);
        ctx.stroke();
    };

    const drawWorld = (ctx: CanvasRenderingContext2D) => {
        // Draw simplified world map
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(100, 150, 40, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(100, 150, 35, 0, 2 * Math.PI);
        ctx.fill();

        // Limited view rectangle
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.strokeRect(60, 110, 80, 80);

        // Question mark
        ctx.fillStyle = '#ef4444';
        ctx.font = '24px Arial';
        ctx.fillText('?', 300, 150);
    };

    const drawWrongAnswer = (ctx: CanvasRenderingContext2D) => {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.strokeRect(240, 140, 140, 60);
        ctx.fillStyle = '#ef4444';
        ctx.font = '14px Arial';
        ctx.fillText('FAUX !', 280, 175);
    };

    const drawQuickAnswer = (ctx: CanvasRenderingContext2D) => {
        ctx.fillStyle = '#10b981';
        ctx.fillRect(80, 100, 60, 30);
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.fillText('TROP VITE!', 85, 118);
    };

    const drawConfusedFace = (ctx: CanvasRenderingContext2D) => {
        // Already drawn in drawHeart
    };

    const drawLimitedView = (ctx: CanvasRenderingContext2D) => {
        ctx.fillStyle = '#6b7280';
        ctx.fillRect(55, 105, 90, 90);
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px Arial';
        ctx.fillText('Vue limitée', 70, 140);
        ctx.fillText('du robot', 75, 155);
    };

    const drawThoughtBubble = (ctx: CanvasRenderingContext2D) => {
        // Thought bubble
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;

        // Main bubble
        ctx.beginPath();
        ctx.arc(200, 100, 40, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        // Bubble tail
        ctx.beginPath();
        ctx.moveTo(180, 130);
        ctx.lineTo(190, 120);
        ctx.lineTo(200, 130);
        ctx.fill();
        ctx.stroke();

        // Question marks
        ctx.fillStyle = '#000000';
        ctx.font = '16px Arial';
        ctx.fillText('???', 185, 110);
    };

    const nextScenario = () => {
        setCurrentScenario((prev) => (prev + 1) % scenarios.length);
        setShowExplanation(false);
        setRobotMood('happy');
    };

    const prevScenario = () => {
        setCurrentScenario((prev) => (prev - 1 + scenarios.length) % scenarios.length);
        setShowExplanation(false);
        setRobotMood('happy');
    };

    const demonstrateMistake = () => {
        setRobotMood('confused');
        setTimeout(() => setRobotMood('wrong'), 1000);
        setTimeout(() => setShowExplanation(true), 2000);
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-orange-100 to-red-100">
            {/* Header */}
            <header className="bg-orange-500 py-4 shadow-lg">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <Link href="/level-5" className="flex items-center gap-2 text-white hover:text-orange-100">
                        <Home className="w-6 h-6" />
                        <span className="text-lg font-bold">Menu Niveau 5</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-white">🤖 Pourquoi l'IA fait des Erreurs ?</h1>
                    <div className="w-20"></div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Introduction */}
                    <div className="bg-white rounded-3xl p-6 shadow-xl mb-8">
                        <h2 className="text-3xl font-bold text-orange-800 mb-4 text-center">🌟 Comprendre les Erreurs de l'IA</h2>
                        <p className="text-lg text-gray-700 text-center mb-4">
                            Imagine un robot qui a tout appris en lisant une énorme bibliothèque.
                            Il a lu des millions de livres, d'histoires et de messages. Il a beaucoup appris...
                            <strong>mais il n'a jamais vraiment vécu quoi que ce soit.</strong>
                        </p>
                        <div className="bg-orange-50 p-4 rounded-xl border-2 border-orange-200">
                            <p className="text-orange-800 font-medium text-center italic">
                                "L'IA est comme un ami qui a entendu beaucoup d'histoires.
                                Ils essaient de bien aider, mais parfois ils mélangent les détails parce qu'ils n'ont jamais vécu ces histoires eux-mêmes."
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Canvas Demonstration */}
                        <div className="bg-white rounded-3xl p-6 shadow-2xl">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Brain className="w-6 h-6 text-orange-600" />
                                Démonstration Visuelle
                            </h3>

                            <div className="relative border-4 border-orange-300 rounded-2xl overflow-hidden mb-4">
                                <canvas
                                    ref={canvasRef}
                                    width={400}
                                    height={300}
                                    className="w-full h-auto"
                                />
                            </div>

                            {/* Scenario Controls */}
                            <div className="flex justify-center gap-4 mb-4">
                                <button
                                    onClick={prevScenario}
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
                                >
                                    ← Précédent
                                </button>

                                <button
                                    onClick={demonstrateMistake}
                                    className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold transition"
                                >
                                    Montrer l'Erreur
                                </button>

                                <button
                                    onClick={nextScenario}
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
                                >
                                    Suivant →
                                </button>
                            </div>
                        </div>

                        {/* Explanation Panel */}
                        <div className="space-y-6">
                            {/* Current Scenario */}
                            <div className="bg-white rounded-3xl p-6 shadow-2xl">
                                <div className="flex items-center gap-3 mb-4">
                                    {React.createElement(scenarios[currentScenario].icon, { className: "w-8 h-8 text-orange-600" })}
                                    <h3 className="text-xl font-bold text-gray-800">
                                        {scenarios[currentScenario].title}
                                    </h3>
                                </div>

                                <p className="text-gray-700 mb-4">{scenarios[currentScenario].description}</p>

                                {showExplanation && (
                                    <div className="bg-orange-50 p-4 rounded-xl border-2 border-orange-200">
                                        <h4 className="font-bold text-orange-800 mb-2">💡 Explication :</h4>
                                        <p className="text-orange-700 text-sm mb-3">{scenarios[currentScenario].explanation}</p>
                                        <h4 className="font-bold text-orange-800 mb-2">🎭 Analogie :</h4>
                                        <p className="text-orange-700 text-sm">{scenarios[currentScenario].analogy}</p>
                                    </div>
                                )}
                            </div>

                            {/* Why AI Makes Mistakes */}
                            <div className="bg-white rounded-3xl p-6 shadow-2xl">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <AlertTriangle className="w-6 h-6 text-red-600" />
                                    Pourquoi l'IA se trompe ?
                                </h3>

                                <div className="space-y-3 text-sm text-gray-700">
                                    <div className="flex items-start gap-2">
                                        <span className="text-red-500 font-bold">•</span>
                                        <span><strong>Apprentissage par patterns :</strong> L'IA apprend des modèles, pas des expériences vécues</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-red-500 font-bold">•</span>
                                        <span><strong>Données limitées :</strong> Elle ne connaît que ce qu'elle a "lu" dans ses entraînements</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-red-500 font-bold">•</span>
                                        <span><strong>Pas de conscience :</strong> Elle ne comprend pas le contexte humain complet</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-red-500 font-bold">•</span>
                                        <span><strong>Probabilités :</strong> Elle devine parfois au lieu d'être sûre</span>
                                    </div>
                                </div>

                                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                                    <p className="text-green-800 text-sm font-medium text-center">
                                        🎯 <strong>C'est normal !</strong> Même les humains font des erreurs en apprenant.
                                        L'IA apprend comme un enfant curieux !
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}