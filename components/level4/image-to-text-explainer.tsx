"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Camera, Eye, FileText, Zap, ArrowRight, Play, Pause, RotateCcw } from 'lucide-react';

export function ImageToTextExplainer() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [extractedText, setExtractedText] = useState('');
    const [showCharacterBoxes, setShowCharacterBoxes] = useState(false);

    // Text extracted from the LLM.png image
    const fullText = "LLMs are advanced artificial intelligence models trained on vast amounts of text data from the internet, books, and other sources. They use deep architectures, like transformers, to understand context and generate human-like text. This enables them to perform a wide range of tasks, answering questions, translating languages, summarizing documents, writing creative content, and generating code.";

    const steps = [
        {
            title: "📸 Image Brute",
            description: "L'IA reçoit l'image originale avec du texte",
            icon: Camera
        },
        {
            title: "🔍 Détection des Contours",
            description: "L'IA analyse les contrastes et trouve les zones de texte",
            icon: Eye
        },
        {
            title: "🔤 Reconnaissance des Lettres",
            description: "Chaque caractère est identifié et localisé précisément",
            icon: Zap
        },
        {
            title: "📄 Texte Final",
            description: "Le texte complet est extrait et assemblé",
            icon: FileText
        }
    ];

    useEffect(() => {
        if (isPlaying && currentStep < steps.length - 1) {
            const timer = setTimeout(() => {
                setCurrentStep(prev => prev + 1);
            }, 5000); // Increased from 3000 to 5000ms for better viewing
            return () => clearTimeout(timer);
        } else if (currentStep === steps.length - 1) {
            // Start text extraction animation
            setTimeout(() => startTextExtraction(), 1000);
        }
    }, [currentStep, isPlaying]);

    const startTextExtraction = () => {
        setExtractedText('');
        let index = 0;
        const interval = setInterval(() => {
            if (index < fullText.length) {
                setExtractedText(prev => prev + fullText[index]);
                index++;
            } else {
                clearInterval(interval);
                setIsPlaying(false);
            }
        }, 30); // Slightly faster but still readable
    };

    const drawContourDetection = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the original image
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Apply edge detection simulation (Sobel-like effect)
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            const output = new Uint8ClampedArray(data);

            // Simple edge detection by comparing neighboring pixels
            for (let y = 1; y < canvas.height - 1; y++) {
                for (let x = 1; x < canvas.width - 1; x++) {
                    const idx = (y * canvas.width + x) * 4;
                    const idxUp = ((y - 1) * canvas.width + x) * 4;
                    const idxDown = ((y + 1) * canvas.width + x) * 4;
                    const idxLeft = (y * canvas.width + (x - 1)) * 4;
                    const idxRight = (y * canvas.width + (x + 1)) * 4;

                    // Calculate gradients
                    const gradX = Math.abs(data[idxRight] - data[idxLeft]);
                    const gradY = Math.abs(data[idxDown] - data[idxUp]);
                    const gradient = Math.min(255, gradX + gradY);

                    output[idx] = gradient;     // Red
                    output[idx + 1] = gradient; // Green
                    output[idx + 2] = gradient; // Blue
                    output[idx + 3] = 255;      // Alpha
                }
            }

            // Apply threshold to create binary image
            for (let i = 0; i < output.length; i += 4) {
                const gray = output[i];
                const threshold = 50;
                const binary = gray > threshold ? 255 : 0;
                output[i] = binary;
                output[i + 1] = binary;
                output[i + 2] = binary;
            }

            const newImageData = new ImageData(output, canvas.width, canvas.height);
            ctx.putImageData(newImageData, 0, 0);

            // Draw text detection boxes with labels
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 3;
            ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
            ctx.fillRect(40, 70, 280, 35);
            ctx.strokeRect(40, 70, 280, 35);

            ctx.fillRect(40, 110, 260, 35);
            ctx.strokeRect(40, 110, 260, 35);

            ctx.fillRect(40, 150, 290, 35);
            ctx.strokeRect(40, 150, 290, 35);

            ctx.fillRect(40, 190, 270, 35);
            ctx.strokeRect(40, 190, 270, 35);

            // Add labels
            ctx.fillStyle = '#00ff00';
            ctx.font = '12px Arial';
            ctx.fillText('Texte détecté', 45, 65);
            ctx.fillText('Zone de texte', 45, 105);
            ctx.fillText('Paragraphe', 45, 145);
            ctx.fillText('Contenu', 45, 185);
        };
        img.src = '/LLM.png';
    };

    const drawCharacterRecognition = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the original image with slight blur to simulate processing
        const img = new Image();
        img.onload = () => {
            ctx.filter = 'blur(0.5px)';
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            ctx.filter = 'none';

            if (showCharacterBoxes) {
                // Draw detailed character bounding boxes
                ctx.strokeStyle = '#ff0000';
                ctx.lineWidth = 2;
                ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';

                // First line: "LLMs are advanced artificial intelligence"
                const line1 = "LLMs are advanced artificial intelligence";
                for (let i = 0; i < line1.length; i++) {
                    const x = 45 + (i * 7.5);
                    const y = 75;
                    ctx.fillRect(x, y, 7, 18);
                    ctx.strokeRect(x, y, 7, 18);
                }

                // Second line: "models trained on vast amounts"
                const line2 = "models trained on vast amounts";
                for (let i = 0; i < line2.length; i++) {
                    const x = 45 + (i * 7.2);
                    const y = 100;
                    ctx.fillRect(x, y, 6.8, 18);
                    ctx.strokeRect(x, y, 6.8, 18);
                }

                // Third line: "of text data from the internet"
                const line3 = "of text data from the internet";
                for (let i = 0; i < line3.length; i++) {
                    const x = 45 + (i * 7);
                    const y = 125;
                    ctx.fillRect(x, y, 6.5, 18);
                    ctx.strokeRect(x, y, 6.5, 18);
                }

                // Add character recognition labels
                ctx.fillStyle = '#ff0000';
                ctx.font = '10px Arial';
                ctx.fillText('Reconnaissance de caractères individuels', 50, 200);
                ctx.fillText('Chaque boîte rouge = 1 caractère détecté', 50, 220);
            } else {
                // Show word-level boxes
                ctx.strokeStyle = '#ff6b35';
                ctx.lineWidth = 3;
                ctx.fillStyle = 'rgba(255, 107, 53, 0.2)';

                // Word boxes
                const words = [
                    { text: "LLMs", x: 45, y: 75, w: 35 },
                    { text: "are", x: 85, y: 75, w: 25 },
                    { text: "advanced", x: 115, y: 75, w: 65 },
                    { text: "artificial", x: 45, y: 100, w: 70 },
                    { text: "intelligence", x: 120, y: 100, w: 85 },
                    { text: "models", x: 45, y: 125, w: 50 }
                ];

                words.forEach(word => {
                    ctx.fillRect(word.x, word.y, word.w, 18);
                    ctx.strokeRect(word.x, word.y, word.w, 18);
                });

                ctx.fillStyle = '#ff6b35';
                ctx.font = '10px Arial';
                ctx.fillText('Reconnaissance de mots', 50, 200);
                ctx.fillText('Chaque boîte orange = 1 mot détecté', 50, 220);
            }
        };
        img.src = '/LLM.png';
    };

    useEffect(() => {
        if (currentStep === 1) {
            drawContourDetection();
        } else if (currentStep === 2) {
            drawCharacterRecognition();
        }
    }, [currentStep, showCharacterBoxes]);

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const reset = () => {
        setCurrentStep(0);
        setIsPlaying(false);
        setExtractedText('');
        setShowCharacterBoxes(false);
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-blue-800 mb-4">👁️📝 L'Œil qui Lit</h1>
                <p className="text-xl text-gray-600">Découvrez comment l'IA transforme une image en texte !</p>
            </div>

            {/* Step Navigation */}
            <div className="flex justify-center items-center gap-4 mb-8">
                <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition"
                >
                    ← Précédent
                </button>

                <div className="flex gap-2">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition ${
                                index === currentStep
                                    ? 'bg-blue-500 text-white'
                                    : index < currentStep
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-200 text-gray-600'
                            }`}
                        >
                            {index + 1}
                        </div>
                    ))}
                </div>

                <button
                    onClick={nextStep}
                    disabled={currentStep === steps.length - 1}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition"
                >
                    Suivant →
                </button>
            </div>

            {/* Control Buttons */}
            <div className="flex justify-center gap-4 mb-8">
                <button
                    onClick={togglePlay}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold transition"
                >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    {isPlaying ? 'Pause' : 'Démarrer l\'animation'}
                </button>

                <button
                    onClick={reset}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-bold transition"
                >
                    <RotateCcw className="w-5 h-5" />
                    Réinitialiser
                </button>

                {currentStep === 2 && (
                    <button
                        onClick={() => setShowCharacterBoxes(!showCharacterBoxes)}
                        className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition"
                    >
                        {showCharacterBoxes ? 'Masquer' : 'Montrer'} les boîtes
                    </button>
                )}
            </div>

            {/* Current Step Display */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl mb-8">
                <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        {React.createElement(steps[currentStep].icon, { className: "w-8 h-8 text-blue-600" })}
                        <h2 className="text-3xl font-bold text-blue-800">{steps[currentStep].title}</h2>
                    </div>
                    <p className="text-xl text-gray-600">{steps[currentStep].description}</p>
                </div>

                {/* Image Display */}
                <div className="flex justify-center mb-6">
                    <div className="relative border-4 border-gray-300 rounded-2xl overflow-hidden">
                        {currentStep === 0 && (
                            <img
                                src="/LLM.png"
                                alt="Document original"
                                className="max-w-full h-auto"
                                style={{ maxHeight: '400px' }}
                            />
                        )}

                        {(currentStep === 1 || currentStep === 2) && (
                            <canvas
                                ref={canvasRef}
                                className="max-w-full h-auto border"
                                style={{ maxHeight: '400px' }}
                            />
                        )}

                        {currentStep === 3 && (
                            <div className="p-8 bg-gradient-to-br from-green-50 to-blue-50 min-h-[400px] flex flex-col items-center justify-center border-2 border-green-200 rounded-lg">
                                <div className="text-center mb-6">
                                    <FileText className="w-20 h-20 text-green-600 mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold text-green-800 mb-2">📄 Texte Extrait de l'Image</h3>
                                    <p className="text-green-600 font-medium">Voici le texte que l'IA a lu dans LLM.png :</p>
                                </div>

                                <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full border-l-4 border-green-500">
                                    <div className="text-lg font-mono text-gray-800 leading-relaxed">
                                        {extractedText}
                                        <span className="animate-pulse text-green-500">|</span>
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200 max-w-4xl w-full">
                                    <h4 className="text-lg font-bold text-yellow-800 mb-2">🎓 Ce que tu viens d'apprendre :</h4>
                                    <ul className="text-yellow-700 space-y-1">
                                        <li>• L'IA peut transformer des images en texte numérique</li>
                                        <li>• L'OCR analyse les pixels pour reconnaître les lettres</li>
                                        <li>• Cette technologie permet de numériser des livres et documents</li>
                                        <li>• Les LLMs utilisent des architectures complexes comme les transformers</li>
                                        <li>• L'IA peut comprendre le contexte et générer du texte humain</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Step-specific information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-blue-800 mb-3">🤖 Ce que fait l'IA :</h3>
                    <div className="text-blue-700">
                        {currentStep === 0 && (
                            <div>
                                <p className="mb-2">L'IA reçoit l'image LLM.png contenant du texte sur les Large Language Models.</p>
                                <p className="text-sm">Elle analyse les pixels, les contrastes, et identifie qu'il s'agit d'un document textuel.</p>
                            </div>
                        )}
                        {currentStep === 1 && (
                            <div>
                                <p className="mb-2">L'IA applique des filtres mathématiques pour détecter les contours du texte.</p>
                                <p className="text-sm">Elle utilise des algorithmes de traitement d'image pour isoler les zones de texte des zones vides.</p>
                            </div>
                        )}
                        {currentStep === 2 && (
                            <div>
                                <p className="mb-2">L'IA segmente le texte en caractères individuels (L, L, M, s, etc.).</p>
                                <p className="text-sm">Chaque caractère est comparé à une base de données de formes apprises pour être reconnu.</p>
                            </div>
                        )}
                        {currentStep === 3 && (
                            <div>
                                <p className="mb-2">L'IA assemble les caractères en mots, puis en phrases complètes.</p>
                                <p className="text-sm">Le texte extrait explique ce que sont les LLMs et leurs capacités.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-green-50 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-green-800 mb-3">🎓 Ce que tu apprends :</h3>
                    <div className="text-green-700">
                        {currentStep === 0 && (
                            <div>
                                <p className="mb-2">Les images sont composées de millions de pixels colorés.</p>
                                <p className="text-sm">L'IA peut analyser ces pixels pour comprendre le contenu d'une image.</p>
                            </div>
                        )}
                        {currentStep === 1 && (
                            <div>
                                <p className="mb-2">Le traitement d'image utilise les mathématiques pour extraire des informations.</p>
                                <p className="text-sm">Les contrastes et les contours sont essentiels pour la reconnaissance.</p>
                            </div>
                        )}
                        {currentStep === 2 && (
                            <div>
                                <p className="mb-2">L'OCR transforme les images de texte en texte numérique modifiable.</p>
                                <p className="text-sm">Cette technologie est utilisée dans les scanners et les applications de reconnaissance.</p>
                            </div>
                        )}
                        {currentStep === 3 && (
                            <div>
                                <p className="mb-2">Les LLMs sont des IA avancées qui comprennent et génèrent du langage humain.</p>
                                <p className="text-sm">Ils utilisent des architectures complexes pour des tâches comme la traduction et la création de contenu.</p>
                            </div>
                        )}
                    </div>
                </div>
                </div>
            </div>

            {/* Progress Indicator */}
            <div className="flex justify-center">
                <div className="flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-lg">
                    <span className="text-sm font-medium text-gray-600">Progression:</span>
                    <div className="flex gap-1">
                        {steps.map((_, index) => (
                            <div
                                key={index}
                                className={`w-3 h-3 rounded-full transition ${
                                    index <= currentStep ? 'bg-blue-500' : 'bg-gray-300'
                                }`}
                            />
                        ))}
                    </div>
                    <span className="text-sm font-medium text-gray-600 ml-2">
                        {currentStep + 1} / {steps.length}
                    </span>
                </div>
            </div>
        </div>
    );
}