"use client";

import React, { useState, useEffect } from 'react';
import { Brain, ArrowRight, Sparkles, MessageSquare, RefreshCw, Scissors, Database, HardDrive } from 'lucide-react';
import Link from 'next/link';

// --- MOCK DATA ---
const MOCK_PREDICTIONS: Record<string, { word: string; prob: number; reason: string }[]> = {
    "": [
        { word: "Le", prob: 0.4, reason: "Début de phrase très commun." },
        { word: "Je", prob: 0.3, reason: "On parle souvent de soi." },
        { word: "Les", prob: 0.1, reason: "Pluriel moins fréquent au début." }
    ],
    "Le": [
        { word: "chat", prob: 0.6, reason: "Animal domestique populaire." },
        { word: "chien", prob: 0.2, reason: "Aussi populaire, mais 'Le chat' est un classique." },
        { word: "soleil", prob: 0.1, reason: "Objet commun, mais moins cité après 'Le'." }
    ],
    "Le chat": [
        { word: "mange", prob: 0.5, reason: "Action vitale et fréquente." },
        { word: "dort", prob: 0.3, reason: "Les chats dorment 16h par jour !" },
        { word: "joue", prob: 0.15, reason: "Activité courante mais moins que dormir." }
    ],
    "Le chat mange": [
        { word: "une souris", prob: 0.7, reason: "Cliché très présent dans les histoires." },
        { word: "des croquettes", prob: 0.2, reason: "Réaliste, mais moins 'raconté'." },
        { word: "de la pizza", prob: 0.05, reason: "Très rare (sauf Garfield !)." }
    ],
    "Le chat dort": [
        { word: "sur le canapé", prob: 0.6, reason: "Endroit favori des chats." },
        { word: "dans son panier", prob: 0.3, reason: "Classique, mais le canapé est mieux." },
        { word: "sur la lune", prob: 0.01, reason: "Impossible (sauf en science-fiction)." }
    ],
    "Je": [
        { word: "suis", prob: 0.5, reason: "Verbe être : le plus utilisé." },
        { word: "veux", prob: 0.3, reason: "Exprimer un désir est fréquent." },
        { word: "vais", prob: 0.1, reason: "Futur proche courant." }
    ],
    "Je suis": [
        { word: "une IA", prob: 0.8, reason: "Contexte : je suis un programme." },
        { word: "un robot", prob: 0.15, reason: "Synonyme souvent utilisé." },
        { word: "un humain", prob: 0.05, reason: "Peu probable pour une machine." }
    ]
};

// --- SUB-COMPONENTS ---

// 1. Tokenizer Visualizer
const TokenizerLab = () => {
    const [input, setInput] = useState("Chocolat");

    // Simple mock tokenization: split every 2-3 chars
    const tokenize = (text: string) => {
        if (!text) return [];
        const tokens = [];
        let i = 0;
        while (i < text.length) {
            const len = Math.random() > 0.5 ? 2 : 3;
            tokens.push(text.slice(i, i + len));
            i += len;
        }
        return tokens;
    };

    const tokens = tokenize(input);
    const colors = ['bg-red-200', 'bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-purple-200'];

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-indigo-400">
            <div className="flex items-center gap-3 mb-4">
                <div className="bg-indigo-100 p-2 rounded-full"><Scissors className="w-6 h-6 text-indigo-600" /></div>
                <h4 className="font-bold text-gray-800 text-lg">1. Le Labo des Tokens 🧩</h4>
            </div>
            <p className="text-gray-600 text-sm mb-4">
                L'IA ne lit pas les mots comme nous. Elle les découpe en petits morceaux appelés <strong>Tokens</strong>.
                Essaie d'écrire un mot :
            </p>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg p-2 mb-4 focus:border-indigo-500 outline-none"
                placeholder="Écris ici..."
            />
            <div className="flex flex-wrap gap-2 min-h-[50px] items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
                {tokens.map((t, i) => (
                    <div key={i} className={`${colors[i % colors.length]} px-3 py-1 rounded-md shadow-sm border border-black/10 font-mono text-lg animate-in zoom-in duration-300`}>
                        {t}
                    </div>
                ))}
            </div>
        </div>
    );
};

// 2. Context Window Visualizer
const ContextLab = () => {
    const [memory, setMemory] = useState<string[]>(["Il", "était", "une", "fois"]);

    const addWord = () => {
        const words = ["un", "petit", "robot", "qui", "aimait", "les", "pommes"];
        const next = words[Math.floor(Math.random() * words.length)];
        setMemory(prev => {
            const newMem = [...prev, next];
            if (newMem.length > 6) return newMem.slice(1); // Sliding window
            return newMem;
        });
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-pink-400">
            <div className="flex items-center gap-3 mb-4">
                <div className="bg-pink-100 p-2 rounded-full"><HardDrive className="w-6 h-6 text-pink-600" /></div>
                <h4 className="font-bold text-gray-800 text-lg">2. La Fenêtre de Contexte 🧠</h4>
            </div>
            <p className="text-gray-600 text-sm mb-4">
                C'est la mémoire courte de l'IA. Si la phrase est trop longue, elle "oublie" le début !
                Regarde la fenêtre glisser :
            </p>

            <div className="relative bg-gray-800 p-4 rounded-xl overflow-hidden mb-4 h-16 flex items-center gap-2">
                {/* The Window Frame */}
                <div className="absolute inset-y-0 right-0 w-3/4 border-4 border-green-400 rounded-lg pointer-events-none z-10 shadow-[0_0_20px_rgba(74,222,128,0.5)]">
                    <div className="absolute -top-3 right-2 bg-green-400 text-black text-xs font-bold px-2 rounded">Ce que l'IA voit</div>
                </div>

                {memory.map((m, i) => (
                    <span key={i} className="text-white font-mono whitespace-nowrap animate-in slide-in-from-right duration-300">
                        {m}
                    </span>
                ))}
            </div>
            <button
                onClick={addWord}
                className="w-full bg-pink-100 hover:bg-pink-200 text-pink-700 font-bold py-2 rounded-lg transition"
            >
                + Ajouter un mot
            </button>
        </div>
    );
};

// 3. Training Visualizer
const TrainingLab = () => {
    const [trained, setTrained] = useState(false);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-purple-400">
            <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 p-2 rounded-full"><Database className="w-6 h-6 text-purple-600" /></div>
                <h4 className="font-bold text-gray-800 text-lg">3. L'Entraînement 📚</h4>
            </div>
            <p className="text-gray-600 text-sm mb-4">
                Comment l'IA sait que "Chat" va avec "Souris" ? Elle a lu des millions de textes !
            </p>

            <div className="relative h-32 bg-gray-50 rounded-xl border border-gray-200 mb-4 flex items-center justify-between px-8">
                {/* Nodes */}
                <div className="flex flex-col gap-4">
                    <div className="bg-blue-200 px-3 py-1 rounded-full font-bold">Chat</div>
                </div>

                {/* Connections */}
                <div className="flex-1 mx-4 relative h-full">
                    <svg className="absolute inset-0 w-full h-full">
                        <line x1="0" y1="50%" x2="100%" y2="20%" stroke="#CBD5E1" strokeWidth={trained ? "1" : "2"} />
                        <line x1="0" y1="50%" x2="100%" y2="50%" stroke={trained ? "#9333EA" : "#CBD5E1"} strokeWidth={trained ? "6" : "2"} className="transition-all duration-1000" />
                        <line x1="0" y1="50%" x2="100%" y2="80%" stroke="#CBD5E1" strokeWidth={trained ? "1" : "2"} />
                    </svg>
                    {trained && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-purple-600 font-bold animate-bounce">Fort !</div>}
                </div>

                <div className="flex flex-col gap-2">
                    <div className="bg-gray-200 px-3 py-1 rounded-full text-gray-500 text-sm">Chien</div>
                    <div className={`px-3 py-1 rounded-full font-bold transition-colors duration-500 ${trained ? 'bg-purple-200 text-purple-900' : 'bg-gray-200 text-gray-500'}`}>Souris</div>
                    <div className="bg-gray-200 px-3 py-1 rounded-full text-gray-500 text-sm">Voiture</div>
                </div>
            </div>

            <button
                onClick={() => setTrained(!trained)}
                className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold py-2 rounded-lg transition"
            >
                {trained ? "Réinitialiser" : "Lancer l'entraînement ! 🚀"}
            </button>
        </div>
    );
};

// --- MAIN COMPONENT ---

export function LLMExplainer() {
    const [sentence, setSentence] = useState<string[]>([]);
    const [options, setOptions] = useState<{ word: string; prob: number; reason: string }[]>([]);
    const [isThinking, setIsThinking] = useState(false);

    // Initial load
    useEffect(() => {
        updatePredictions([]);
    }, []);

    const updatePredictions = (currentWords: string[]) => {
        setIsThinking(true);
        setTimeout(() => {
            const text = currentWords.join(" ");
            const preds = MOCK_PREDICTIONS[text] || [
                { word: ".", prob: 0.9, reason: "Fin de phrase probable." },
                { word: "et", prob: 0.05, reason: "Pour continuer la phrase." },
                { word: "!", prob: 0.05, reason: "Pour exprimer une émotion." }
            ];
            setOptions(preds);
            setIsThinking(false);
        }, 800);
    };

    const addWord = (word: string) => {
        const newSentence = [...sentence, word];
        setSentence(newSentence);
        updatePredictions(newSentence);
    };

    const reset = () => {
        setSentence([]);
        updatePredictions([]);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
            {/* Header */}
            <header className="bg-indigo-600 py-4 shadow-lg">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-white hover:text-indigo-200">
                        <ArrowRight className="w-6 h-6 rotate-180" />
                        <span className="text-lg font-bold">Retour</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-white">🤖 La Machine à Mots (LLM)</h1>
                    <div className="w-20"></div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto space-y-12">

                    {/* MAIN GAME SECTION */}
                    <div className="space-y-8">
                        {/* 1. The Context (Input) */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-indigo-200">
                            <div className="flex items-center gap-3 mb-6">
                                <MessageSquare className="w-8 h-8 text-indigo-600" />
                                <h2 className="text-2xl font-bold text-gray-800">Le Jeu de la Prédiction</h2>
                            </div>

                            <div className="bg-gray-100 rounded-2xl p-6 min-h-[100px] flex flex-wrap gap-2 items-center">
                                {sentence.length === 0 ? (
                                    <span className="text-gray-400 italic">Commence une phrase...</span>
                                ) : (
                                    sentence.map((word, i) => (
                                        <span key={i} className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-lg font-medium animate-in fade-in slide-in-from-bottom-2">
                                            {word}
                                        </span>
                                    ))
                                )}
                                {isThinking && (
                                    <div className="flex gap-1 ml-2">
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 2. The Brain & Output */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                            {/* Brain Animation */}
                            <div className="md:col-span-1 flex justify-center">
                                <div className={`bg-indigo-900 rounded-full p-6 shadow-2xl text-white transition-all duration-300 ${isThinking ? 'scale-110 shadow-pink-500/50' : ''}`}>
                                    <Brain className={`w-12 h-12 ${isThinking ? 'text-pink-400 animate-pulse' : 'text-gray-400'}`} />
                                </div>
                            </div>

                            {/* Predictions */}
                            <div className="md:col-span-3 bg-white rounded-3xl p-6 shadow-xl border-4 border-pink-200">
                                <h3 className="text-lg font-bold text-gray-600 mb-4 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-pink-500" />
                                    L'IA propose (et explique pourquoi) :
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {options.map((opt, i) => (
                                        <button
                                            key={i}
                                            onClick={() => addWord(opt.word)}
                                            disabled={isThinking}
                                            className="group relative bg-gradient-to-b from-white to-gray-50 hover:to-pink-50 border-2 border-gray-200 hover:border-pink-400 rounded-xl p-3 transition-all hover:-translate-y-1 hover:shadow-lg text-left flex flex-col h-full"
                                        >
                                            <div className="flex justify-between items-end mb-1">
                                                <span className="font-bold text-gray-800 group-hover:text-pink-600 text-lg">
                                                    {opt.word}
                                                </span>
                                                <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                    {(opt.prob * 100).toFixed(0)}%
                                                </span>
                                            </div>

                                            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden mb-3">
                                                <div
                                                    className="h-full bg-pink-500 transition-all duration-1000 ease-out"
                                                    style={{ width: `${opt.prob * 100}%` }}
                                                ></div>
                                            </div>

                                            <p className="text-xs text-gray-500 italic mt-auto border-t border-gray-100 pt-2 group-hover:text-pink-700">
                                                "{opt.reason}"
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <button onClick={reset} className="text-indigo-600 hover:underline flex items-center gap-2">
                                <RefreshCw className="w-4 h-4" /> Recommencer
                            </button>
                        </div>
                    </div>

                    {/* INTERACTIVE LABS SECTION */}
                    <div>
                        <h2 className="text-3xl font-bold text-indigo-900 mb-8 text-center">🔬 Comprendre la Technologie</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <TokenizerLab />
                            <ContextLab />
                            <TrainingLab />
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
