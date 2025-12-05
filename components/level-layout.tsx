import React from 'react';
import { ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';

export interface LevelLayoutProps {
    children: React.ReactNode;
    levelNumber: number;
    levelTitle: string;
    levelSubtitle: string;
    currentIdea?: number;
    totalIdeas?: number;
}

export function LevelLayout({
    children,
    levelNumber,
    levelTitle,
    levelSubtitle,
    currentIdea,
    totalIdeas = 3
}: LevelLayoutProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Top Navigation */}
            <nav className="border-b border-white/10 bg-black/20 backdrop-blur-lg">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        {/* Left: Back Button */}
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 text-white" />
                            <span className="text-sm text-white">Retour</span>
                        </Link>

                        {/* Center: Level Info */}
                        <div className="text-center">
                            <h1 className="text-lg font-bold text-white">{levelTitle}</h1>
                            <p className="text-xs text-purple-300">{levelSubtitle}</p>
                        </div>

                        {/* Right: Home Button */}
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                        >
                            <Home className="w-4 h-4 text-white" />
                            <span className="text-sm text-white">Accueil</span>
                        </Link>
                    </div>

                    {/* Progress Bar */}
                    {currentIdea !== undefined && (
                        <div className="mt-3">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-white/60">
                                    Idée {currentIdea} sur {totalIdeas}
                                </span>
                                <span className="text-xs text-white/60">
                                    {Math.round((currentIdea / totalIdeas) * 100)}%
                                </span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-600 transition-all duration-300"
                                    style={{ width: `${(currentIdea / totalIdeas) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Main Content */}
            <main className="h-[calc(100vh-80px)]">{children}</main>
        </div>
    );
}
