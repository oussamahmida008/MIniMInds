"use client";

import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { Camera, Eye, Loader2, Home, Target } from 'lucide-react';
import Link from 'next/link';

interface Detection {
    bbox: [number, number, number, number];
    class: string;
    score: number;
}

export function ObjectDetector() {
    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [model, setModel] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [detections, setDetections] = useState<Detection[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [selectedObject, setSelectedObject] = useState<string | null>(null);

    // Load COCO-SSD model
    useEffect(() => {
        const loadModel = async () => {
            try {
                setIsLoading(true);
                await tf.ready();
                const loadedModel = await cocoSsd.load();
                setModel(loadedModel);
                setIsLoading(false);
            } catch (error) {
                console.error('Error loading model:', error);
                setIsLoading(false);
            }
        };
        loadModel();
    }, []);

    // Continuous detection
    useEffect(() => {
        if (!model || isLoading) return;

        const detectObjects = async () => {
            if (webcamRef.current && webcamRef.current.video) {
                const video = webcamRef.current.video;
                if (video.readyState === 4) {
                    setIsAnalyzing(true);
                    try {
                        const predictions = await model.detect(video);
                        setDetections(predictions);
                        drawBoundingBoxes(predictions);
                    } catch (error) {
                        console.error('Error detecting objects:', error);
                    }
                    setIsAnalyzing(false);
                }
            }
        };

        const interval = setInterval(detectObjects, 500); // Detect every 0.5 seconds
        return () => clearInterval(interval);
    }, [model, isLoading]);

    const drawBoundingBoxes = (predictions: Detection[]) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const video = webcamRef.current?.video;
        if (!video) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        predictions.forEach((prediction, index) => {
            const [x, y, width, height] = prediction.bbox;

            // Draw bounding box
            ctx.strokeStyle = getColorForClass(prediction.class);
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, width, height);

            // Draw label background
            ctx.fillStyle = getColorForClass(prediction.class);
            const labelWidth = ctx.measureText(`${prediction.class} ${Math.round(prediction.score * 100)}%`).width + 10;
            ctx.fillRect(x, y - 25, labelWidth, 25);

            // Draw label text
            ctx.fillStyle = '#ffffff';
            ctx.font = '16px Arial';
            ctx.fillText(`${prediction.class} ${Math.round(prediction.score * 100)}%`, x + 5, y - 5);
        });
    };

    const getColorForClass = (className: string) => {
        const colors: { [key: string]: string } = {
            'person': '#FF6B6B',
            'car': '#4ECDC4',
            'dog': '#45B7D1',
            'cat': '#96CEB4',
            'chair': '#FFEAA7',
            'bottle': '#DDA0DD',
            'cup': '#98D8C8',
            'book': '#F7DC6F',
            'laptop': '#BB8FCE',
            'phone': '#85C1E9'
        };
        return colors[className] || '#FF6B6B';
    };

    const getUniqueObjects = () => {
        const uniqueClasses = [...new Set(detections.map(d => d.class))];
        return uniqueClasses.sort();
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-indigo-100 to-purple-100">
            {/* Header */}
            <header className="bg-indigo-500 py-4 shadow-lg">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <Link href="/level-2" className="flex items-center gap-2 text-white hover:text-indigo-100">
                        <Home className="w-6 h-6" />
                        <span className="text-lg font-bold">Menu Niveau 2</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-white">🔍 Détecteur d'Objets</h1>
                    <div className="w-20"></div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Instructions */}
                    <div className="bg-white rounded-3xl p-6 shadow-xl mb-8">
                        <h2 className="text-2xl font-bold text-indigo-700 mb-4 text-center">🎯 Comment ça marche ?</h2>
                        <ol className="text-lg text-gray-700 space-y-2 list-decimal list-inside">
                            <li><strong>Étape 1:</strong> L'IA analyse l'image en temps réel</li>
                            <li><strong>Étape 2:</strong> Elle détecte tous les objets visibles</li>
                            <li><strong>Étape 3:</strong> Chaque objet est entouré d'une boîte colorée (bounding box)</li>
                            <li><strong>Étape 4:</strong> La boîte indique le nom de l'objet et son niveau de confiance</li>
                            <li><strong>Étape 5:</strong> Observe comment l'IA reconnaît plusieurs objets en même temps !</li>
                        </ol>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Detection Area */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-3xl p-6 shadow-2xl">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Target className="w-6 h-6 text-indigo-600" />
                                    Détection en cours
                                </h3>

                                <div className="relative rounded-2xl overflow-hidden border-4 border-indigo-400 bg-black aspect-video mb-4">
                                    {isLoading ? (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-indigo-50">
                                            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                                            <p className="text-indigo-700 font-semibold">Chargement de l'IA de détection...</p>
                                        </div>
                                    ) : (
                                        <>
                                            <Webcam
                                                ref={webcamRef}
                                                audio={false}
                                                className="w-full h-full object-cover"
                                                videoConstraints={{
                                                    facingMode: 'user',
                                                    width: 640,
                                                    height: 480
                                                }}
                                            />
                                            <canvas
                                                ref={canvasRef}
                                                className="absolute inset-0 w-full h-full"
                                            />
                                            {isAnalyzing && (
                                                <div className="absolute top-4 right-4 bg-indigo-500 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse">
                                                    🤖 Analyse...
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                {/* Detection Stats */}
                                <div className="flex justify-center gap-6">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-indigo-600">{detections.length}</div>
                                        <div className="text-sm text-gray-600">Objets détectés</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-green-600">{getUniqueObjects().length}</div>
                                        <div className="text-sm text-gray-600">Types d'objets</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Object List Panel */}
                        <div className="space-y-6">
                            {/* Detected Objects */}
                            <div className="bg-white rounded-3xl p-6 shadow-2xl">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Eye className="w-6 h-6 text-blue-600" />
                                    Objets détectés
                                </h3>

                                {detections.length > 0 ? (
                                    <div className="space-y-3 max-h-64 overflow-y-auto">
                                        {detections.map((detection, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-3 rounded-lg border-2 hover:bg-gray-50 transition"
                                                style={{ borderColor: getColorForClass(detection.class) }}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-4 h-4 rounded-full"
                                                        style={{ backgroundColor: getColorForClass(detection.class) }}
                                                    ></div>
                                                    <span className="font-medium capitalize">{detection.class}</span>
                                                </div>
                                                <span className="text-sm font-bold text-gray-600">
                                                    {Math.round(detection.score * 100)}%
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <Eye className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <p>En attente de détection...</p>
                                    </div>
                                )}
                            </div>

                            {/* Educational Panel */}
                            <div className="bg-white rounded-3xl p-6 shadow-2xl">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Target className="w-6 h-6 text-green-600" />
                                    Les Bounding Boxes
                                </h3>

                                <div className="space-y-4 text-sm text-gray-700">
                                    <div>
                                        <h4 className="font-bold text-green-700 mb-1">📦 Qu'est-ce qu'une Bounding Box ?</h4>
                                        <p>Un rectangle qui encadre parfaitement un objet détecté par l'IA.</p>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-green-700 mb-1">🎨 Couleurs différentes</h4>
                                        <p>Chaque couleur représente un type d'objet différent pour une meilleure visibilité.</p>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-green-700 mb-1">📊 Pourcentage de confiance</h4>
                                        <p>L'IA indique à quel point elle est sûre de sa détection (0-100%).</p>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-green-700 mb-1">⚡ Détection multiple</h4>
                                        <p>L'IA peut détecter plusieurs objets en même temps dans la même image !</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}