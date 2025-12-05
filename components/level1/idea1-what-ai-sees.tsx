"use client";

import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { Camera, Eye, Loader2, Home } from 'lucide-react';
import Link from 'next/link';

interface Prediction {
    class: string;
    confidence: number;
}

export function WhatAISees() {
    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [model, setModel] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [currentImage, setCurrentImage] = useState<string | null>(null);
    const [visualizationMode, setVisualizationMode] = useState<'edges' | 'blur' | 'contrast' | 'keypoints' | 'zones' | 'heatmap'>('edges');

    // Load MobileNet model
    useEffect(() => {
        const loadModel = async () => {
            try {
                setIsLoading(true);
                await tf.ready();
                const loadedModel = await mobilenet.load();
                setModel(loadedModel);
                setIsLoading(false);
            } catch (error) {
                console.error('Error loading model:', error);
                setIsLoading(false);
            }
        };
        loadModel();
    }, []);

    // Continuous analysis
    useEffect(() => {
        if (!model || isLoading) return;

        const interval = setInterval(async () => {
            await analyzeImage();
        }, 1500); // Analyze every 1.5 seconds

        return () => clearInterval(interval);
    }, [model, isLoading]);

    // Process image for edge detection
    useEffect(() => {
        if (!currentImage || !canvasRef.current || visualizationMode !== 'edges') return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // Simple edge detection simulation (grayscale + high contrast)
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Convert to grayscale and increase contrast
            for (let i = 0; i < data.length; i += 4) {
                const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
                const contrasted = Math.min(255, gray * 1.5);
                data[i] = contrasted;     // Red
                data[i + 1] = contrasted; // Green
                data[i + 2] = contrasted; // Blue
            }

            ctx.putImageData(imageData, 0, 0);
        };
        img.src = currentImage;
    }, [currentImage, visualizationMode]);

    const analyzeImage = async () => {
        if (!webcamRef.current || !model) return;

        const video = webcamRef.current.video;
        if (!video || video.readyState !== 4) return;

        setIsAnalyzing(true);

        try {
            // Capture current image for visualization
            const screenshot = webcamRef.current.getScreenshot();
            setCurrentImage(screenshot);

            const predictions = await model.classify(video);
            const formattedPredictions: Prediction[] = predictions.slice(0, 3).map((pred: any) => ({
                class: pred.className,
                confidence: pred.probability
            }));

            setPredictions(formattedPredictions);
        } catch (error) {
            console.error('Error analyzing image:', error);
        }

        setIsAnalyzing(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 to-emerald-100">
            {/* Simple Header */}
            <header className="bg-green-500 py-4 shadow-lg">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-white hover:text-green-100">
                        <Home className="w-6 h-6" />
                        <span className="text-lg font-bold">Retour</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-white">👁️ Qu'est-ce que l'IA voit ?</h1>
                    <div className="w-20"></div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {/* Instructions */}
                <div className="bg-white rounded-3xl p-6 shadow-xl mb-8 max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">📋 Comment jouer ?</h2>
                    <ol className="text-lg text-gray-700 space-y-2 list-decimal list-inside">
                        <li><strong>Étape 1:</strong> Montre un objet à la webcam pour voir l'image normale</li>
                        <li><strong>Étape 2:</strong> Observe comment l'IA traite l'image (points clés, zones importantes, filtres)</li>
                        <li><strong>Étape 3:</strong> Découvre la classification finale de l'IA</li>
                        <li><strong>Étape 4:</strong> Compare avec ce que TU vois et apprends !</li>
                    </ol>
                </div>

                {/* Three-Step Process */}
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Step 1: Normal Image */}
                        <div className="bg-white rounded-3xl p-6 shadow-2xl">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                                <Eye className="w-6 h-6 text-green-600" />
                                <h3 className="text-xl font-bold text-gray-800">Image normale</h3>
                            </div>
                            <div className="relative rounded-2xl overflow-hidden border-4 border-green-400 bg-black aspect-video">
                                {isLoading ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-50">
                                        <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
                                        <p className="text-green-700 font-semibold">Chargement de l'IA...</p>
                                    </div>
                                ) : (
                                    <Webcam
                                        ref={webcamRef}
                                        audio={false}
                                        screenshotFormat="image/jpeg"
                                        className="w-full h-full object-cover"
                                        videoConstraints={{
                                            facingMode: 'user',
                                            width: 640,
                                            height: 480
                                        }}
                                    />
                                )}
                                {isAnalyzing && !isLoading && (
                                    <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse">
                                        🤖 Analyse...
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-gray-600 mt-3 text-center">
                                Ce que tes yeux voient naturellement
                            </p>
                        </div>

                        {/* Step 2: AI Processing Visualization */}
                        <div className="bg-white rounded-3xl p-6 shadow-2xl">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                                <Camera className="w-6 h-6 text-blue-600" />
                                <h3 className="text-xl font-bold text-gray-800">Comment l'IA voit</h3>
                            </div>
                            <div className="relative rounded-2xl overflow-hidden border-4 border-blue-400 bg-black aspect-video">
                                {currentImage ? (
                                    <div className="relative w-full h-full">
                                        <img
                                            src={currentImage}
                                            alt="AI processing"
                                            className={`w-full h-full object-cover ${
                                                visualizationMode === 'blur' ? 'filter blur-sm' :
                                                visualizationMode === 'contrast' ? 'filter contrast-200' :
                                                visualizationMode === 'edges' ? 'filter grayscale' : ''
                                            }`}
                                        />
                                        {visualizationMode === 'keypoints' && (
                                            <div className="absolute inset-0">
                                                {/* Simulated keypoints */}
                                                <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                                <div className="absolute top-1/2 left-2/3 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                                <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                                <div className="absolute top-3/4 left-1/2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                            </div>
                                        )}
                                        {visualizationMode === 'zones' && (
                                            <div className="absolute inset-0">
                                                {/* Simulated important zones */}
                                                <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-blue-500 bg-opacity-30 border-2 border-blue-600"></div>
                                                <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-green-500 bg-opacity-30 border-2 border-green-600"></div>
                                            </div>
                                        )}
                                        {visualizationMode === 'heatmap' && (
                                            <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-yellow-500 to-green-500 opacity-50"></div>
                                        )}
                                        <canvas
                                            ref={canvasRef}
                                            className="absolute inset-0 w-full h-full"
                                            style={{ display: visualizationMode === 'edges' ? 'block' : 'none' }}
                                        />
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                        <p className="text-gray-600">En attente d'image...</p>
                                    </div>
                                )}
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                                <button
                                    onClick={() => setVisualizationMode('edges')}
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        visualizationMode === 'edges' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                                    }`}
                                >
                                    Contours
                                </button>
                                <button
                                    onClick={() => setVisualizationMode('blur')}
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        visualizationMode === 'blur' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                                    }`}
                                >
                                    Flou
                                </button>
                                <button
                                    onClick={() => setVisualizationMode('contrast')}
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        visualizationMode === 'contrast' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                                    }`}
                                >
                                    Contraste
                                </button>
                                <button
                                    onClick={() => setVisualizationMode('keypoints')}
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        visualizationMode === 'keypoints' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                                    }`}
                                >
                                    Points clés
                                </button>
                                <button
                                    onClick={() => setVisualizationMode('zones')}
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        visualizationMode === 'zones' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                                    }`}
                                >
                                    Zones
                                </button>
                                <button
                                    onClick={() => setVisualizationMode('heatmap')}
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        visualizationMode === 'heatmap' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                                    }`}
                                >
                                    Carte chaleur
                                </button>
                            </div>
                            <p className="text-sm text-gray-600 mt-3 text-center">
                                L'IA analyse les formes et les motifs
                            </p>
                        </div>

                        {/* Step 3: Final Classification */}
                        <div className="bg-white rounded-3xl p-6 shadow-2xl">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                                <Camera className="w-6 h-6 text-purple-600" />
                                <h3 className="text-xl font-bold text-gray-800">Classification finale</h3>
                            </div>
                            <div className="aspect-video bg-gray-100 rounded-2xl flex items-center justify-center border-4 border-purple-400">
                                {predictions.length > 0 ? (
                                    <div className="w-full p-4">
                                        <div className="space-y-3">
                                            {predictions.slice(0, 2).map((pred, i) => (
                                                <div key={i} className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-3 border-2 border-purple-300">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-sm font-bold text-gray-800">
                                                            {pred.class}
                                                        </span>
                                                        <span className="text-lg font-bold text-purple-600">
                                                            {(pred.confidence * 100).toFixed(0)}%
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-white rounded-full h-2 overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                                                            style={{ width: `${pred.confidence * 100}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <p className="text-gray-600 text-sm">
                                            {isLoading ? "Chargement..." : "En attente de classification..."}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-gray-600 mt-3 text-center">
                                La décision finale basée sur les motifs reconnus
                            </p>
                        </div>
                    </div>
                </div>

                {/* Educational Section */}
                <div className="max-w-6xl mx-auto mt-8">
                    <div className="bg-blue-50 rounded-3xl p-6 shadow-xl border-4 border-blue-300">
                        <h3 className="text-2xl font-bold text-blue-700 mb-4 text-center">💡 Comment l'IA "voit" les images ?</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg text-gray-700">
                            <div className="space-y-4">
                                <p>
                                    <strong className="text-blue-600">👁️ L'IA ne voit pas comme les humains !</strong> Contrairement à toi qui reconnaît instantanément un chat ou une voiture, l'IA transforme l'image en millions de chiffres (pixels) et analyse les motifs et les caractéristiques.
                                </p>
                                <p>
                                    <strong className="text-blue-600">🔍 Points clés et zones importantes :</strong> L'IA identifie les parties essentielles de l'image, comme les contours d'un objet ou les zones de contraste élevé, pour comprendre ce qu'elle regarde.
                                </p>
                                <p>
                                    <strong className="text-blue-600">🎨 Filtres et transformations :</strong> Elle applique des filtres comme le flou, le contraste ou la détection de contours pour extraire les caractéristiques importantes, exactement comme dans l'étape 2 !
                                </p>
                            </div>
                            <div className="space-y-4">
                                <p>
                                    <strong className="text-blue-600">🧠 Carte de chaleur :</strong> L'IA crée une "carte de chaleur" montrant où se concentrent les informations importantes - les zones rouges sont celles que l'IA juge cruciales pour la reconnaissance.
                                </p>
                                <p>
                                    <strong className="text-blue-600">📊 Classification finale :</strong> Après avoir analysé tous ces motifs, l'IA compare avec ce qu'elle a appris lors de son entraînement et donne sa réponse avec un pourcentage de confiance.
                                </p>
                                <p>
                                    <strong className="text-blue-600">🎯 L'apprentissage :</strong> L'IA a été entraînée sur des millions d'images pour apprendre à reconnaître les objets. C'est pourquoi elle peut identifier des choses que tu n'aurais jamais imaginées !
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 p-4 bg-yellow-50 rounded-xl border-2 border-yellow-300">
                            <p className="text-yellow-800 font-semibold text-center">
                                🤔 À toi de jouer : Essaie de deviner ce que l'IA va dire avant de regarder l'étape 3 !
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
