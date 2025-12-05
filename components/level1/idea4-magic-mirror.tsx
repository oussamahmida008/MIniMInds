"use client";

import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';
import { Camera, Eye, Loader2, Home, Target, Zap } from 'lucide-react';
import Link from 'next/link';

interface Landmark {
    x: number;
    y: number;
    z: number;
    visibility?: number;
}

export function MagicMirror() {
    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [detector, setDetector] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [poses, setPoses] = useState<any[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);
    const [selectedLandmark, setSelectedLandmark] = useState<number | null>(null);
    const [noseTouched, setNoseTouched] = useState(false);
    const [showMathExplanation, setShowMathExplanation] = useState(false);

    // Initialize PoseNet
    useEffect(() => {
        const initializePoseNet = async () => {
            try {
                setIsLoading(true);
                await tf.ready();
                await tf.setBackend('webgl');

                const net = await posenet.load({
                    architecture: 'MobileNetV1',
                    outputStride: 16,
                    inputResolution: { width: 640, height: 480 },
                    multiplier: 0.75
                });

                setDetector(net);
                setIsLoading(false);
            } catch (error) {
                console.error('Error initializing PoseNet:', error);
                setIsLoading(false);
            }
        };

        initializePoseNet();
    }, []);

    // Pose detection loop
    useEffect(() => {
        if (!detector || isLoading) return;

        const detectPose = async () => {
            if (webcamRef.current && webcamRef.current.video) {
                const video = webcamRef.current.video;
                if (video.readyState === 4) {
                    setIsAnalyzing(true);
                    try {
                        const pose = await detector.estimateSinglePose(video);
                        setPoses([pose]);

                        // Check for nose touch
                        checkNoseTouch(pose);

                        drawSkeleton([pose]);
                    } catch (error) {
                        console.error('Error detecting pose:', error);
                    }
                    setIsAnalyzing(false);
                }
            }
        };

        const interval = setInterval(detectPose, 100); // 10 FPS
        return () => clearInterval(interval);
    }, [detector, isLoading]);

    const checkNoseTouch = (pose: any) => {
        if (!pose.keypoints || noseTouched) return;

        const nose = pose.keypoints.find((kp: any) => kp.part === 'nose');
        const leftWrist = pose.keypoints.find((kp: any) => kp.part === 'leftWrist');
        const rightWrist = pose.keypoints.find((kp: any) => kp.part === 'rightWrist');

        if (nose && leftWrist && rightWrist) {
            const noseX = nose.position.x;
            const noseY = nose.position.y;

            const leftWristX = leftWrist.position.x;
            const leftWristY = leftWrist.position.y;

            const rightWristX = rightWrist.position.x;
            const rightWristY = rightWrist.position.y;

            const leftDistance = Math.sqrt(Math.pow(noseX - leftWristX, 2) + Math.pow(noseY - leftWristY, 2));
            const rightDistance = Math.sqrt(Math.pow(noseX - rightWristX, 2) + Math.pow(noseY - rightWristY, 2));

            const threshold = 60; // pixels

            if ((leftDistance < threshold || rightDistance < threshold) && nose.score > 0.5) {
                setNoseTouched(true);
                setShowCelebration(true);
                setTimeout(() => {
                    setShowCelebration(false);
                    setShowMathExplanation(true);
                }, 2000);
            }
        }
    };

    const drawSkeleton = (poses: any[]) => {
        const canvas = canvasRef.current;
        if (!canvas || poses.length === 0) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const video = webcamRef.current?.video;
        if (!video) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        poses.forEach((pose) => {
            if (!pose.keypoints) return;

            // Draw connections
            drawConnections(ctx, pose.keypoints);

            // Draw keypoints
            pose.keypoints.forEach((keypoint: any, index: number) => {
                if (keypoint.score > 0.3) {
                    drawKeypoint(ctx, keypoint, index);
                }
            });
        });
    };

    const drawConnections = (ctx: CanvasRenderingContext2D, keypoints: any[]) => {
        // PoseNet connections (simplified for 17 keypoints)
        const connections = [
            ['nose', 'leftEye'], ['leftEye', 'leftEar'], ['nose', 'rightEye'], ['rightEye', 'rightEar'],
            ['nose', 'leftShoulder'], ['leftShoulder', 'leftElbow'], ['leftElbow', 'leftWrist'],
            ['nose', 'rightShoulder'], ['rightShoulder', 'rightElbow'], ['rightElbow', 'rightWrist'],
            ['leftShoulder', 'rightShoulder'], ['leftShoulder', 'leftHip'], ['rightShoulder', 'rightHip'],
            ['leftHip', 'rightHip'], ['leftHip', 'leftKnee'], ['leftKnee', 'leftAnkle'],
            ['rightHip', 'rightKnee'], ['rightKnee', 'rightAnkle']
        ];

        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 3;

        connections.forEach(([startPart, endPart]) => {
            const startPoint = keypoints.find(kp => kp.part === startPart);
            const endPoint = keypoints.find(kp => kp.part === endPart);

            if (startPoint && endPoint && startPoint.score > 0.3 && endPoint.score > 0.3) {
                ctx.beginPath();
                ctx.moveTo(startPoint.position.x, startPoint.position.y);
                ctx.lineTo(endPoint.position.x, endPoint.position.y);
                ctx.stroke();
            }
        });
    };

    const drawKeypoint = (ctx: CanvasRenderingContext2D, keypoint: any, index: number) => {
        const x = keypoint.position.x;
        const y = keypoint.position.y;

        // Draw point
        ctx.fillStyle = selectedLandmark === index ? '#ff0000' : '#00ff00';
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fill();

        // Draw index number
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(index.toString(), x, y + 4);
    };

    const landmarkNames = [
        'Nez', 'Œil gauche', 'Œil droit', 'Oreille gauche', 'Oreille droite',
        'Épaule gauche', 'Épaule droite', 'Coude gauche', 'Coude droit',
        'Poignet gauche', 'Poignet droit', 'Hanche gauche', 'Hanche droite',
        'Genou gauche', 'Genou droit', 'Cheville gauche', 'Cheville droite'
    ];


    const resetGame = () => {
        setNoseTouched(false);
        setShowCelebration(false);
        setShowMathExplanation(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-100 to-blue-100">
            {/* Header */}
            <header className="bg-cyan-500 py-4 shadow-lg">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <Link href="/level-1" className="flex items-center gap-2 text-white hover:text-cyan-100">
                        <Home className="w-6 h-6" />
                        <span className="text-lg font-bold">Menu Niveau 1</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-white">🪄 Miroir Magique !</h1>
                    <div className="w-20"></div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Instructions */}
                    <div className="bg-white rounded-3xl p-6 shadow-xl mb-8">
                        <h2 className="text-2xl font-bold text-cyan-700 mb-4 text-center">🎯 Comment jouer ?</h2>
                        <ol className="text-lg text-gray-700 space-y-2 list-decimal list-inside">
                            <li><strong>Étape 1:</strong> L'IA te dit "Touchez votre nez !"</li>
                            <li><strong>Étape 2:</strong> Utilise ta main pour toucher ton nez</li>
                            <li><strong>Étape 3:</strong> L'IA détecte le contact et célèbre !</li>
                            <li><strong>Étape 4:</strong> Découvre les maths derrière la détection</li>
                            <li><strong>Étape 5:</strong> Comprends comment l'IA calcule les distances</li>
                        </ol>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Game Area */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-3xl p-6 shadow-2xl">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Zap className="w-6 h-6 text-cyan-600" />
                                    Miroir Magique
                                </h3>

                                <div className="relative rounded-2xl overflow-hidden border-4 border-cyan-400 bg-black aspect-video mb-4">
                                    {isLoading ? (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-cyan-50">
                                            <Loader2 className="w-12 h-12 text-cyan-600 animate-spin mb-4" />
                                            <p className="text-cyan-700 font-semibold">Chargement de l'IA de mouvement...</p>
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
                                            {showCelebration && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                                    <div className="text-center">
                                                        <div className="text-6xl mb-4 animate-bounce">🎉</div>
                                                        <p className="text-white text-2xl font-bold">Bravo ! Tu touches ton nez !</p>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    {isAnalyzing && (
                                        <div className="absolute top-4 right-4 bg-cyan-500 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse">
                                            🤖 Analyse...
                                        </div>
                                    )}
                                </div>

                                {/* Game Instructions */}
                                <div className="text-center mb-4">
                                    {!noseTouched && (
                                        <div className="bg-cyan-100 border-2 border-cyan-300 rounded-xl p-4">
                                            <h3 className="text-xl font-bold text-cyan-800 mb-2">
                                                🤖 L'IA dit : "Touchez votre nez !"
                                            </h3>
                                            <div className="text-4xl">👃</div>
                                        </div>
                                    )}

                                    {noseTouched && !showMathExplanation && (
                                        <div className="bg-blue-100 border-2 border-blue-300 rounded-xl p-4">
                                            <h3 className="text-xl font-bold text-blue-800 mb-2">🔍 Analyse en cours...</h3>
                                            <p className="text-blue-700">L'IA prépare une explication mathématique !</p>
                                        </div>
                                    )}

                                    {showMathExplanation && (
                                        <div className="bg-green-100 border-2 border-green-300 rounded-xl p-4">
                                            <h3 className="text-xl font-bold text-green-800 mb-2">🎉 Bravo ! Maintenant découvre comment l'IA fonctionne !</h3>
                                            <button
                                                onClick={resetGame}
                                                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl font-bold transition mt-2"
                                            >
                                                Rejouer
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Game Stats */}
                                <div className="flex justify-center gap-6">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-cyan-600">
                                            {noseTouched ? '✓' : '👃'}
                                        </div>
                                        <div className="text-sm text-gray-600">Nez touché</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-green-600">{poses.length > 0 ? '✅' : '❌'}</div>
                                        <div className="text-sm text-gray-600">Détection active</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Data Panel */}
                        <div className="space-y-6">
                            {/* Landmark Data */}
                            <div className="bg-white rounded-3xl p-6 shadow-2xl">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Eye className="w-6 h-6 text-blue-600" />
                                    Données des Points
                                </h3>

                                <div className="max-h-64 overflow-y-auto space-y-2">
                                    {poses.length > 0 && poses[0].keypoints ? (
                                        poses[0].keypoints.slice(0, 11).map((keypoint: any, index: number) => (
                                            <div
                                                key={index}
                                                className={`p-2 rounded-lg cursor-pointer transition ${
                                                    selectedLandmark === index ? 'bg-red-100 border-2 border-red-300' : 'bg-gray-50 hover:bg-gray-100'
                                                }`}
                                                onClick={() => setSelectedLandmark(selectedLandmark === index ? null : index)}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium text-sm">
                                                        {index}: {landmarkNames[index] || `Point ${index}`}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {(keypoint.score * 100).toFixed(0)}%
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-600 mt-1">
                                                    x: {keypoint.position.x.toFixed(0)}, y: {keypoint.position.y.toFixed(0)}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <Eye className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                            <p>En attente de détection...</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Educational Panel */}
                            <div className="bg-white rounded-3xl p-6 shadow-2xl">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Target className="w-6 h-6 text-green-600" />
                                    Comment ça marche ?
                                </h3>

                                <div className="space-y-4 text-sm text-gray-700">
                                    <div>
                                        <h4 className="font-bold text-green-700 mb-1">🦴 Squelette 17 Points</h4>
                                        <p>L'IA détecte des points clés sur ton corps : nez, yeux, épaules, coudes, poignets, hanches, genoux, chevilles...</p>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-green-700 mb-1">📐 Coordonnées x, y</h4>
                                        <p>Chaque point a une position x,y sur l'écran. L'IA ne voit pas une "personne", mais des coordonnées mathématiques !</p>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-green-700 mb-1">🎯 Instructions de l'IA</h4>
                                        <p>L'IA te guide étape par étape. Elle sait exactement où sont tes parties du corps grâce aux coordonnées !</p>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-green-700 mb-1">🤖 PoseNet</h4>
                                        <p>Cette IA s'appelle PoseNet. Elle transforme ton corps en nombres pour que les ordinateurs puissent comprendre le mouvement !</p>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-green-700 mb-1">🎮 Applications Réelles</h4>
                                        <p>Cette technologie est utilisée pour les jeux de danse, l'animation 3D, et même pour aider les personnes avec des handicaps !</p>
                                    </div>
                                </div>
                            </div>

                            {/* Mathematical Geometry Explanation */}
                            {showMathExplanation && (
                                <div className="bg-white rounded-3xl p-6 shadow-2xl border-4 border-purple-300">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <Zap className="w-6 h-6 text-purple-600" />
                                        La Mathématique derrière l'IA !
                                    </h3>

                                    <div className="space-y-6">
                                        {/* Distance Calculation */}
                                        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4">
                                            <h4 className="font-bold text-purple-800 mb-3 flex items-center gap-2">
                                                📏 <span>Calcul de Distance</span>
                                            </h4>
                                            <p className="text-purple-700 text-sm">
                                                L'IA calcule cette formule 10 fois par seconde pour savoir si tu touches ton nez !
                                            </p>
                                        </div>

                                        {/* Coordinate System */}
                                        <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl p-4">
                                            <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                                                📍 <span>Système de Coordonnées</span>
                                            </h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-white rounded-lg p-3 text-center">
                                                    <div className="text-2xl mb-1">↔️</div>
                                                    <div className="font-bold text-blue-600">Axe X</div>
                                                    <div className="text-xs text-gray-600">Gauche ↔ Droite</div>
                                                    <div className="text-xs font-mono mt-1">0 → 640 pixels</div>
                                                </div>
                                                <div className="bg-white rounded-lg p-3 text-center">
                                                    <div className="text-2xl mb-1">↕️</div>
                                                    <div className="font-bold text-blue-600">Axe Y</div>
                                                    <div className="text-xs text-gray-600">Haut ↔ Bas</div>
                                                    <div className="text-xs font-mono mt-1">0 → 480 pixels</div>
                                                </div>
                                            </div>
                                            <p className="text-blue-700 text-sm mt-3">
                                                Chaque point de ton corps a une adresse mathématique (x, y) sur l'écran !
                                            </p>
                                        </div>

                                        {/* Real-time Processing */}
                                        <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-4">
                                            <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                                                ⚡ <span>Traitement en Temps Réel</span>
                                            </h4>
                                            <div className="space-y-2 text-sm text-green-700">
                                                <div className="flex items-center justify-between">
                                                    <span>Détection des points :</span>
                                                    <span className="font-mono">17 points</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span>Calculs par seconde :</span>
                                                    <span className="font-mono">10×</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span>Formules utilisées :</span>
                                                    <span className="font-mono">Pythagore</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span>Précision requise :</span>
                                                    <span className="font-mono">60 pixels</span>
                                                </div>
                                            </div>
                                            <p className="text-green-700 text-sm mt-3">
                                                L'IA fait des milliers de calculs mathématiques chaque seconde pour te comprendre !
                                            </p>
                                        </div>

                                        {/* AI Learning Insight */}
                                        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4">
                                            <h4 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
                                                🧠 <span>Comment l'IA a appris ?</span>
                                            </h4>
                                            <ul className="text-yellow-900 text-sm space-y-1">
                                                <li>• <strong>Entraînée sur des images :</strong> Des milliers de photos de personnes</li>
                                                <li>• <strong>Algorithmes mathématiques :</strong> Des formules complexes pour trouver les points</li>
                                                <li>• <strong>Apprentissage automatique :</strong> Elle s'améliore en analysant des exemples</li>
                                                <li>• <strong>Réseaux de neurones :</strong> Comme un cerveau mathématique !</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}