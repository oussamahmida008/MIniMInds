"use client";

import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { Camera, Eye, Loader2, Home, Target, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

interface Detection {
    bbox: [number, number, number, number];
    class: string;
    score: number;
}

interface UserBox {
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
}

export function BoundingBoxGame() {
    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [model, setModel] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [detections, setDetections] = useState<any[]>([]);
    const [userBoxes, setUserBoxes] = useState<UserBox[]>([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
    const [currentBox, setCurrentBox] = useState<UserBox | null>(null);
    const [gameScore, setGameScore] = useState(0);
    const [feedback, setFeedback] = useState<string>('');

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

    // Get AI detections
    useEffect(() => {
        if (!model || isLoading) return;

        const detectObjects = async () => {
            if (webcamRef.current && webcamRef.current.video) {
                const video = webcamRef.current.video;
                if (video.readyState === 4) {
                    try {
                        const predictions = await model.detect(video);
                        setDetections(predictions.slice(0, 3)); // Limit to 3 objects for game
                    } catch (error) {
                        console.error('Error detecting objects:', error);
                    }
                }
            }
        };

        const interval = setInterval(detectObjects, 2000); // Detect every 2 seconds
        return () => clearInterval(interval);
    }, [model, isLoading]);

    const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (isDrawing) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        setStartPoint({ x, y });
        setIsDrawing(true);
    };

    const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !startPoint) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const currentX = event.clientX - rect.left;
        const currentY = event.clientY - rect.top;

        const width = Math.abs(currentX - startPoint.x);
        const height = Math.abs(currentY - startPoint.y);
        const x = Math.min(startPoint.x, currentX);
        const y = Math.min(startPoint.y, currentY);

        setCurrentBox({
            x,
            y,
            width,
            height,
            label: ''
        });
    };

    const handleCanvasMouseUp = () => {
        if (!isDrawing || !currentBox) return;

        // Prompt for label
        const label = prompt('Quel objet as-tu encadré ?');
        if (label) {
            const newBox = { ...currentBox, label };
            setUserBoxes(prev => [...prev, newBox]);

            // Check if box matches any AI detection
            checkBoxAccuracy(newBox);
        }

        setIsDrawing(false);
        setStartPoint(null);
        setCurrentBox(null);
    };

    const checkBoxAccuracy = (userBox: UserBox) => {
        let bestMatch: any = null;
        let bestIoU = 0;

        detections.forEach((detection) => {
            const iou = calculateIoU(userBox, detection);
            if (iou > bestIoU) {
                bestIoU = iou;
                bestMatch = detection;
            }
        });

        if (bestMatch && bestIoU > 0.5) {
            const points = Math.round(bestIoU * 100);
            setGameScore(prev => prev + points);
            setFeedback(`🎉 Excellent ! Tu as bien encadré un(e) ${bestMatch.class} (+${points} points)`);
        } else if (bestMatch && bestIoU > 0.3) {
            setGameScore(prev => prev + 10);
            setFeedback(`👍 Pas mal ! C'est presque un(e) ${bestMatch.class} (+10 points)`);
        } else {
            setFeedback('🤔 Essaie encore ! Place ta boîte autour d\'un objet visible.');
        }

        setTimeout(() => setFeedback(''), 3000);
    };

    const calculateIoU = (userBox: UserBox, detection: any): number => {
        const [detX, detY, detWidth, detHeight] = detection.bbox;

        // Calculate intersection
        const x1 = Math.max(userBox.x, detX);
        const y1 = Math.max(userBox.y, detY);
        const x2 = Math.min(userBox.x + userBox.width, detX + detWidth);
        const y2 = Math.min(userBox.y + userBox.height, detY + detHeight);

        const intersectionArea = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);

        // Calculate union
        const userArea = userBox.width * userBox.height;
        const detArea = detWidth * detHeight;
        const unionArea = userArea + detArea - intersectionArea;

        return intersectionArea / unionArea;
    };

    const drawEverything = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const video = webcamRef.current?.video;
        if (!video) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw AI detections (semi-transparent)
        detections.forEach((detection) => {
            const [x, y, width, height] = detection.bbox;

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, width, height);

            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            const label = `${detection.class} ${Math.round(detection.score * 100)}%`;
            const labelWidth = ctx.measureText(label).width + 10;
            ctx.fillRect(x, y - 25, labelWidth, 25);

            ctx.fillStyle = '#000000';
            ctx.font = '14px Arial';
            ctx.fillText(label, x + 5, y - 5);
        });

        // Draw user boxes
        userBoxes.forEach((box, index) => {
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 3;
            ctx.strokeRect(box.x, box.y, box.width, box.height);

            ctx.fillStyle = '#00ff00';
            const labelWidth = ctx.measureText(box.label).width + 10;
            ctx.fillRect(box.x, box.y - 25, labelWidth, 25);

            ctx.fillStyle = '#ffffff';
            ctx.font = '14px Arial';
            ctx.fillText(box.label, box.x + 5, box.y - 5);
        });

        // Draw current drawing box
        if (currentBox) {
            ctx.strokeStyle = '#ffff00';
            ctx.lineWidth = 2;
            ctx.strokeRect(currentBox.x, currentBox.y, currentBox.width, currentBox.height);
        }
    };

    useEffect(() => {
        drawEverything();
    }, [detections, userBoxes, currentBox]);

    const clearBoxes = () => {
        setUserBoxes([]);
        setGameScore(0);
        setFeedback('');
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-purple-100 to-indigo-100">
            {/* Header */}
            <header className="bg-purple-500 py-4 shadow-lg">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <Link href="/level-2" className="flex items-center gap-2 text-white hover:text-purple-100">
                        <Home className="w-6 h-6" />
                        <span className="text-lg font-bold">Menu Niveau 2</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-white">🎯 Jeu des Boîtes</h1>
                    <div className="flex items-center gap-4">
                        <div className="bg-purple-600 px-4 py-2 rounded-full">
                            <span className="text-white font-bold">Score: {gameScore}</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Instructions */}
                    <div className="bg-white rounded-3xl p-6 shadow-xl mb-8">
                        <h2 className="text-2xl font-bold text-purple-700 mb-4 text-center">🎯 Comment jouer ?</h2>
                        <ol className="text-lg text-gray-700 space-y-2 list-decimal list-inside">
                            <li><strong>Étape 1:</strong> Clique et glisse pour créer une boîte autour d'un objet</li>
                            <li><strong>Étape 2:</strong> Donne un nom à l'objet que tu as encadré</li>
                            <li><strong>Étape 3:</strong> L'IA vérifie si ta boîte correspond à un objet réel</li>
                            <li><strong>Étape 4:</strong> Gagne des points selon la précision de ta boîte !</li>
                            <li><strong>Étape 5:</strong> Les boîtes blanches sont celles de l'IA, les vertes sont les tiennes</li>
                        </ol>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Game Area */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-3xl p-6 shadow-2xl">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Target className="w-6 h-6 text-purple-600" />
                                    Crée tes Bounding Boxes
                                </h3>

                                <div className="relative rounded-2xl overflow-hidden border-4 border-purple-400 bg-black aspect-video mb-4">
                                    {isLoading ? (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-purple-50">
                                            <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
                                            <p className="text-purple-700 font-semibold">Chargement de l'IA de détection...</p>
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
                                                className="absolute inset-0 w-full h-full cursor-crosshair"
                                                onMouseDown={handleCanvasClick}
                                                onMouseMove={handleCanvasMouseMove}
                                                onMouseUp={handleCanvasMouseUp}
                                            />
                                        </>
                                    )}
                                </div>

                                {/* Game Controls */}
                                <div className="flex justify-center gap-4">
                                    <button
                                        onClick={clearBoxes}
                                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-bold transition"
                                    >
                                        Effacer les boîtes
                                    </button>
                                </div>

                                {/* Feedback */}
                                {feedback && (
                                    <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-300 rounded-xl">
                                        <p className="text-blue-800 font-bold text-center">{feedback}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Info Panel */}
                        <div className="space-y-6">
                            {/* Game Stats */}
                            <div className="bg-white rounded-3xl p-6 shadow-2xl">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                    Statistiques
                                </h3>

                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span>Score total :</span>
                                        <span className="font-bold text-purple-600">{gameScore}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Boîtes créées :</span>
                                        <span className="font-bold text-blue-600">{userBoxes.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Objets IA :</span>
                                        <span className="font-bold text-green-600">{detections.length}</span>
                                    </div>
                                </div>
                            </div>

                            {/* How to Play */}
                            <div className="bg-white rounded-3xl p-6 shadow-2xl">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Eye className="w-6 h-6 text-blue-600" />
                                    Conseils pour bien jouer
                                </h3>

                                <div className="space-y-3 text-sm text-gray-700">
                                    <div className="flex items-start gap-2">
                                        <span className="text-green-500 font-bold">✓</span>
                                        <span>Clique et glisse pour créer une boîte rectangulaire</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-green-500 font-bold">✓</span>
                                        <span>Encadre complètement l'objet (pas trop grand, pas trop petit)</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-green-500 font-bold">✓</span>
                                        <span>Donne le bon nom à l'objet que tu vois</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-yellow-500 font-bold">⚠</span>
                                        <span>Les boîtes blanches sont celles de l'IA (référence)</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-yellow-500 font-bold">⚠</span>
                                        <span>Plus ta boîte correspond à celle de l'IA, plus tu gagnes de points !</span>
                                    </div>
                                </div>
                            </div>

                            {/* Educational Panel */}
                            <div className="bg-white rounded-3xl p-6 shadow-2xl">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Target className="w-6 h-6 text-green-600" />
                                    Qu'est-ce que l'IoU ?
                                </h3>

                                <div className="space-y-4 text-sm text-gray-700">
                                    <div>
                                        <h4 className="font-bold text-green-700 mb-1">📊 Intersection over Union</h4>
                                        <p>IoU mesure à quel point deux boîtes se superposent parfaitement.</p>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-green-700 mb-1">🎯 Score parfait = 1.0</h4>
                                        <p>Si ta boîte correspond exactement à celle de l'IA, IoU = 1.0</p>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-green-700 mb-1">📈 Plus c'est proche de 1.0</h4>
                                        <p>Plus tu gagnes de points ! C'est la même métrique que les chercheurs utilisent.</p>
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