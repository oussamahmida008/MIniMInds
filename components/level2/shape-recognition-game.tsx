"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Zap, Target, Eye, Calculator, CheckCircle } from 'lucide-react';

interface Shape {
    name: string;
    emoji: string;
    color: string;
    drawFunction: (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, size: number) => void;
    properties: {
        roundness: number;
        symmetry: number;
        corners: number;
        closed: boolean;
    };
}

interface ShapeAnalysis {
    shape: string;
    confidence: number;
    properties: {
        roundness: number;
        symmetry: number;
        corners: number;
        closed: boolean;
    };
}

export function ShapeRecognitionGame() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const [selectedShape, setSelectedShape] = useState<Shape | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(true);
    const [showResult, setShowResult] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const [analysis, setAnalysis] = useState<ShapeAnalysis | null>(null);
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [pixelData, setPixelData] = useState<boolean[][]>([]);
    const [shapeOutline, setShapeOutline] = useState<{x: number, y: number}[]>([]);
    const [gamePhase, setGamePhase] = useState<'selection' | 'analysis'>('selection');

    const shapes: Shape[] = [
        {
            name: "Étoile",
            emoji: "⭐",
            color: "#fbbf24",
            properties: { roundness: 20, symmetry: 100, corners: 10, closed: true },
            drawFunction: (ctx, x, y, size) => {
                ctx.beginPath();
                for (let i = 0; i < 10; i++) {
                    const angle = (i * Math.PI) / 5;
                    const radius = i % 2 === 0 ? size : size * 0.5;
                    const px = x + Math.cos(angle) * radius;
                    const py = y + Math.sin(angle) * radius;
                    if (i === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.closePath();
                ctx.fill();
            }
        },
        {
            name: "Cœur",
            emoji: "❤️",
            color: "#ef4444",
            properties: { roundness: 60, symmetry: 100, corners: 0, closed: true },
            drawFunction: (ctx, x, y, size) => {
                ctx.beginPath();
                ctx.moveTo(x, y + size * 0.3);
                ctx.bezierCurveTo(x - size, y - size * 0.3, x - size, y + size * 0.8, x, y + size * 1.2);
                ctx.bezierCurveTo(x + size, y + size * 0.8, x + size, y - size * 0.3, x, y + size * 0.3);
                ctx.closePath();
                ctx.fill();
            }
        },
        {
            name: "Losange",
            emoji: "💎",
            color: "#a855f7",
            properties: { roundness: 0, symmetry: 100, corners: 4, closed: true },
            drawFunction: (ctx, x, y, size) => {
                ctx.beginPath();
                ctx.moveTo(x, y - size);
                ctx.lineTo(x + size, y);
                ctx.lineTo(x, y + size);
                ctx.lineTo(x - size, y);
                ctx.closePath();
                ctx.fill();
            }
        },
        {
            name: "Croissant",
            emoji: "🌙",
            color: "#f97316",
            properties: { roundness: 70, symmetry: 30, corners: 0, closed: true },
            drawFunction: (ctx, x, y, size) => {
                // Outer circle
                ctx.beginPath();
                ctx.arc(x, y, size, 0, 2 * Math.PI);
                // Inner circle (cut out)
                ctx.arc(x + size * 0.3, y, size * 0.7, 0, 2 * Math.PI, true);
                ctx.closePath();
                ctx.fill();
            }
        }
    ];

    const steps = [
        {
            title: "🧠 1. L'IA regarde comme des pixels LEGO",
            description: "L'écran est fait de petits carrés (pixels). L'IA regarde chaque pixel comme des blocs de LEGO.",
            icon: Eye,
            analyzeFunction: (ctx: CanvasRenderingContext2D, shape: Shape) => {
                // Clear canvas
                ctx.clearRect(0, 0, 400, 350);

                // Draw pixel grid background
                ctx.strokeStyle = '#e5e7eb';
                ctx.lineWidth = 1;
                for (let x = 0; x < 400; x += 20) {
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, 300);
                    ctx.stroke();
                }
                for (let y = 0; y < 300; y += 20) {
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(400, y);
                    ctx.stroke();
                }

                // Draw the shape
                ctx.fillStyle = shape.color;
                shape.drawFunction(ctx, 200, 150, 60);

                // Highlight some pixels
                ctx.fillStyle = '#ff6b35';
                ctx.fillRect(180, 130, 20, 20);
                ctx.fillRect(200, 130, 20, 20);
                ctx.fillRect(220, 130, 20, 20);

                ctx.fillStyle = '#000000';
                ctx.font = '16px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('Chaque petit carré = 1 pixel', 200, 270);
                ctx.fillText('L\'IA compte les pixels colorés', 200, 290);
                ctx.fillText('Comme des blocs LEGO !', 200, 310);
            }
        },
        {
            title: "🟢 2. L'IA analyse la forme",
            description: "L'IA examine les caractéristiques spéciales de chaque forme : coins, courbes, symétrie.",
            icon: Calculator,
            analyzeFunction: (ctx: CanvasRenderingContext2D, shape: Shape) => {
                // Clear canvas
                ctx.clearRect(0, 0, 400, 350);

                // Draw the shape
                ctx.fillStyle = shape.color;
                shape.drawFunction(ctx, 200, 150, 60);

                if (shape.name === 'Étoile') {
                    // Show star points
                    ctx.fillStyle = '#ff6b35';
                    for (let i = 0; i < 10; i += 2) {
                        const angle = (i * Math.PI) / 5;
                        const px = 200 + Math.cos(angle) * 60;
                        const py = 150 + Math.sin(angle) * 60;
                        ctx.fillRect(px - 3, py - 3, 6, 6);
                    }

                    ctx.fillStyle = '#ff6b35';
                    ctx.font = '14px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('10 pointes détectées', 200, 270);
                    ctx.fillText('Symétrie parfaite', 200, 290);
                    ctx.fillText('Forme complexe', 200, 310);
                } else if (shape.name === 'Cœur') {
                    // Show heart curves
                    ctx.strokeStyle = '#ff0000';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.arc(170, 130, 25, 0, Math.PI);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(230, 130, 25, 0, Math.PI);
                    ctx.stroke();

                    ctx.fillStyle = '#ff0000';
                    ctx.font = '14px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('Deux courbes lisses', 200, 270);
                    ctx.fillText('Symétrie parfaite', 200, 290);
                    ctx.fillText('Forme organique', 200, 310);
                } else if (shape.name === 'Losange') {
                    // Show diamond corners
                    ctx.fillStyle = '#ff6b35';
                    ctx.fillRect(197, 87, 6, 6); // top
                    ctx.fillRect(257, 147, 6, 6); // right
                    ctx.fillRect(197, 207, 6, 6); // bottom
                    ctx.fillRect(137, 147, 6, 6); // left

                    ctx.fillStyle = '#ff6b35';
                    ctx.font = '14px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('4 coins détectés', 200, 270);
                    ctx.fillText('Toutes les distances égales', 200, 290);
                    ctx.fillText('Lignes droites', 200, 310);
                } else if (shape.name === 'Croissant') {
                    // Show crescent curves
                    ctx.strokeStyle = '#00ff00';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.arc(200, 150, 60, 0, 2 * Math.PI);
                    ctx.stroke();

                    ctx.strokeStyle = '#ff6b35';
                    ctx.beginPath();
                    ctx.arc(230, 150, 42, 0, 2 * Math.PI);
                    ctx.stroke();

                    ctx.fillStyle = '#ff6b35';
                    ctx.font = '14px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('Deux cercles superposés', 200, 270);
                    ctx.fillText('Forme asymétrique', 200, 290);
                    ctx.fillText('Courbes lisses', 200, 310);
                }
            }
        },
        {
            title: "🔍 3. Comparaison avec des exemples",
            description: "L'IA a vu des milliers de formes magiques. Elle compare avec ses souvenirs.",
            icon: Target,
            analyzeFunction: (ctx: CanvasRenderingContext2D, shape: Shape) => {
                // Clear canvas
                ctx.clearRect(0, 0, 400, 350);

                // Draw the shape larger
                ctx.fillStyle = shape.color;
                shape.drawFunction(ctx, 200, 120, 50);

                // Draw comparison examples (smaller, arranged in a circle)
                ctx.globalAlpha = 0.4;
                const exampleShapes = shapes.filter(s => s.name !== shape.name);
                exampleShapes.forEach((exampleShape, index) => {
                    const angle = (index * 2 * Math.PI) / exampleShapes.length;
                    const radius = 80;
                    const x = 200 + Math.cos(angle) * radius;
                    const y = 200 + Math.sin(angle) * radius;

                    ctx.fillStyle = exampleShape.color;
                    exampleShape.drawFunction(ctx, x, y, 25);
                    ctx.fillStyle = '#666666';
                    ctx.font = '10px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText(exampleShape.emoji, x, y + 35);
                });
                ctx.globalAlpha = 1;

                // Draw connection lines
                ctx.strokeStyle = '#10b981';
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]);
                exampleShapes.forEach((exampleShape, index) => {
                    const angle = (index * 2 * Math.PI) / exampleShapes.length;
                    const radius = 80;
                    const x = 200 + Math.cos(angle) * radius;
                    const y = 200 + Math.sin(angle) * radius;

                    ctx.beginPath();
                    ctx.moveTo(200, 120);
                    ctx.lineTo(x, y);
                    ctx.stroke();
                });
                ctx.setLineDash([]);

                // Highlight the selected shape
                ctx.strokeStyle = '#10b981';
                ctx.lineWidth = 4;
                ctx.strokeRect(150, 70, 100, 100);

                ctx.fillStyle = '#10b981';
                ctx.font = '16px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('Celle-ci est différente !', 200, 300);
                ctx.fillText(`${shape.emoji} ${shape.name} unique`, 200, 320);
            }
        },
        {
            title: "🧮 4. Vérification mathématique finale",
            description: "L'IA fait ses derniers calculs : mesure les angles, vérifie les proportions, confirme l'identification.",
            icon: Zap,
            analyzeFunction: (ctx: CanvasRenderingContext2D, shape: Shape) => {
                // Clear canvas
                ctx.clearRect(0, 0, 400, 350);

                // Draw the shape
                ctx.fillStyle = shape.color;
                shape.drawFunction(ctx, 200, 150, 60);

                // Draw mathematical analysis based on shape
                if (shape.name === 'Étoile') {
                    // Show angle measurements
                    ctx.strokeStyle = '#ff6b35';
                    ctx.lineWidth = 2;
                    for (let i = 0; i < 5; i++) {
                        const angle = (i * 2 * Math.PI) / 5;
                        ctx.beginPath();
                        ctx.moveTo(200, 150);
                        ctx.lineTo(200 + Math.cos(angle) * 70, 150 + Math.sin(angle) * 70);
                        ctx.stroke();
                    }

                    ctx.fillStyle = '#000000';
                    ctx.font = '12px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('Angles: 72° chacun', 200, 270);
                    ctx.fillText('10 sommets réguliers', 200, 290);
                    ctx.fillText('Symétrie pentagonale', 200, 310);
                } else if (shape.name === 'Cœur') {
                    // Show curve analysis
                    ctx.strokeStyle = '#ff0000';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(170, 130, 25, 0, Math.PI);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(230, 130, 25, 0, Math.PI);
                    ctx.stroke();

                    ctx.fillStyle = '#000000';
                    ctx.font = '12px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('Courbes elliptiques', 200, 270);
                    ctx.fillText('Rapport 1:2 détecté', 200, 290);
                    ctx.fillText('Symétrie bilatérale', 200, 310);
                } else if (shape.name === 'Losange') {
                    // Show angle measurements
                    ctx.strokeStyle = '#a855f7';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(200, 150);
                    ctx.lineTo(260, 150); // horizontal
                    ctx.moveTo(200, 150);
                    ctx.lineTo(200, 90);  // vertical
                    ctx.stroke();

                    ctx.fillStyle = '#000000';
                    ctx.font = '12px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('Angles: 60° et 120°', 200, 270);
                    ctx.fillText('Côtés égaux', 200, 290);
                    ctx.fillText('Diagonales perpendiculaires', 200, 310);
                } else if (shape.name === 'Croissant') {
                    // Show radius measurements
                    ctx.strokeStyle = '#f97316';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(200, 150, 60, 0, 2 * Math.PI);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(230, 150, 42, 0, 2 * Math.PI);
                    ctx.stroke();

                    ctx.fillStyle = '#000000';
                    ctx.font = '12px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('Rayons: 60 et 42 unités', 200, 270);
                    ctx.fillText('Différence: 18 unités', 200, 290);
                    ctx.fillText('Forme asymétrique confirmée', 200, 310);
                }

                // Final confidence indicator
                ctx.fillStyle = '#e5e7eb';
                ctx.fillRect(150, 325, 100, 20);
                ctx.fillStyle = '#10b981';
                ctx.fillRect(150, 325, 100, 20);

                ctx.fillStyle = '#10b981';
                ctx.font = 'bold 16px Arial';
                ctx.fillText('CONFIRMÉ !', 200, 345);
            }
        }
    ];

    useEffect(() => {
        initializeCanvas();
        if (gamePhase === 'selection') {
            startShapeAnimation();
        }
    }, [gamePhase]);

    const initializeCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        canvas.width = 400;
        canvas.height = 300;

        // Fill with white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const startShapeAnimation = () => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }

        let animationTime = 0;
        const animate = () => {
            animationTime += 0.02;
            drawAnimatedShapes(animationTime);
            animationRef.current = requestAnimationFrame(animate);
        };
        animate();
    };

    const drawAnimatedShapes = (time: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#e0f2fe');
        gradient.addColorStop(0.5, '#f0f9ff');
        gradient.addColorStop(1, '#e0f2fe');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw floating animated shapes
        shapes.forEach((shape, index) => {
            // Calculate floating position with sine waves
            const baseX = 100 + index * 120;
            const baseY = 120;
            const floatX = baseX + Math.sin(time * 1.5 + index) * 15;
            const floatY = baseY + Math.cos(time * 1.2 + index * 0.5) * 10;

            // Pulsing size effect
            const pulse = 1 + Math.sin(time * 2 + index) * 0.1;
            const size = 35 * pulse;

            // Draw glowing background
            const glowGradient = ctx.createRadialGradient(floatX, floatY, 0, floatX, floatY, 60);
            glowGradient.addColorStop(0, shape.color + '40');
            glowGradient.addColorStop(1, shape.color + '10');
            ctx.fillStyle = glowGradient;
            ctx.beginPath();
            ctx.arc(floatX, floatY, 60, 0, 2 * Math.PI);
            ctx.fill();

            // Draw rotating shape
            ctx.save();
            ctx.translate(floatX, floatY);
            ctx.rotate(Math.sin(time + index) * 0.2);
            ctx.fillStyle = shape.color;
            shape.drawFunction(ctx, 0, 0, size);
            ctx.restore();

            // Draw shape name with shadow
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(shape.emoji, floatX + 1, floatY + 65);
            ctx.fillText(shape.name, floatX + 1, floatY + 80);

            ctx.fillStyle = '#000000';
            ctx.fillText(shape.emoji, floatX, floatY + 64);
            ctx.fillText(shape.name, floatX, floatY + 79);
        });

        // Add animated instruction text
        const textY = 40 + Math.sin(time * 1.8) * 3;
        ctx.fillStyle = '#374151';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('✨ Choisis une forme magique ! ✨', 200, textY);

        ctx.fillStyle = '#6b7280';
        ctx.font = '14px Arial';
        ctx.fillText('Clique pour voir comment l\'IA l\'analyse', 200, textY + 25);
    };

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (gamePhase !== 'selection') return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        // Determine which shape was clicked (floating positions)
        shapes.forEach((shape, index) => {
            // Calculate current floating position (same as in drawAnimatedShapes)
            const time = 0; // Use time 0 for click detection (approximate)
            const baseX = 100 + index * 120;
            const baseY = 120;
            const floatX = baseX + Math.sin(time * 1.5 + index) * 15;
            const floatY = baseY + Math.cos(time * 1.2 + index * 0.5) * 10;

            const distance = Math.sqrt(Math.pow(clickX - floatX, 2) + Math.pow(clickY - floatY, 2));

            if (distance <= 60) { // Click radius matches glow radius
                selectShape(shape);
            }
        });
    };

    const selectShape = (shape: Shape) => {
        setSelectedShape(shape);
        setGamePhase('analysis');
        setCurrentStep(0);
        setIsAnimating(false);
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
        // Start analysis
        analyzeSelectedShape(shape);
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (currentStep !== 0) return;

        setIsDrawing(true);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || currentStep !== 0) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        initializeCanvas();
        setAnalysis(null);
        setShowAnalysis(false);
        setCurrentStep(0);
        setPixelData([]);
        setShapeOutline([]);
    };

    const analyzeSelectedShape = (shape: Shape) => {
        // For selected shapes, we use the predefined properties
        const properties = shape.properties;

        const analysisResult: ShapeAnalysis = {
            shape: shape.name,
            confidence: 100, // Perfect confidence for selected shapes
            properties: properties
        };

        console.log('Shape Analysis for selected shape:', {
            shape: shape.name,
            properties,
            confidence: 100
        });

        setAnalysis(analysisResult);
        setShowAnalysis(true);
    };

    const analyzeDrawing = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Step 1: Convert to pixel grid
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = convertToPixelGrid(imageData);
        setPixelData(pixels);

        // Step 2: Find shape outline
        const outline = findShapeOutline(pixels);
        setShapeOutline(outline);

        // Step 3: Analyze shape properties
        const properties = analyzeShapeProperties(outline, pixels);

        // Step 4: Determine shape
        const detectedShape = determineShape(properties);

        const { roundness, symmetry, corners } = properties;
        console.log('Shape Analysis:', {
            properties,
            detectedShape,
            pixelCount: pixels.flat().filter(p => p).length,
            outlineLength: outline.length,
            debug: {
                roundnessThreshold: roundness > 0.75 && corners < 3 ? 'Circle' : 'Not circle',
                triangleCheck: corners >= 2 && corners <= 6 && roundness < 0.8 ? 'Triangle' : 'Not triangle',
                squareCheck: symmetry > 0.4 && corners >= 3 && corners <= 8 && roundness < 0.7 ? 'Square/Rect' : 'Not square'
            }
        });

        setAnalysis(detectedShape);
        setCurrentStep(1);
        setShowAnalysis(true);
    };

    const convertToPixelGrid = (imageData: ImageData): boolean[][] => {
        const pixels: boolean[][] = [];
        const threshold = 128; // Darkness threshold

        for (let y = 0; y < imageData.height; y += 5) { // Sample every 5 pixels for performance
            const row: boolean[] = [];
            for (let x = 0; x < imageData.width; x += 5) {
                const index = (y * imageData.width + x) * 4;
                const r = imageData.data[index];
                const g = imageData.data[index + 1];
                const b = imageData.data[index + 2];
                const brightness = (r + g + b) / 3;
                row.push(brightness < threshold); // true if dark (drawn)
            }
            pixels.push(row);
        }

        return pixels;
    };

    const findShapeOutline = (pixels: boolean[][]): {x: number, y: number}[] => {
        const outline: {x: number, y: number}[] = [];

        for (let y = 0; y < pixels.length; y++) {
            for (let x = 0; x < pixels[y].length; x++) {
                if (pixels[y][x]) {
                    // Check if this pixel has empty neighbors (outline)
                    const hasEmptyNeighbor =
                        (x > 0 && !pixels[y][x-1]) ||
                        (x < pixels[y].length - 1 && !pixels[y][x+1]) ||
                        (y > 0 && !pixels[y-1][x]) ||
                        (y < pixels.length - 1 && !pixels[y+1][x]);

                    if (hasEmptyNeighbor) {
                        outline.push({x: x * 5, y: y * 5});
                    }
                }
            }
        }

        return outline;
    };

    const analyzeShapeProperties = (outline: {x: number, y: number}[], pixels: boolean[][]) => {
        if (outline.length < 5) return { roundness: 0, symmetry: 0, corners: 0, closed: false };

        // Calculate centroid
        const centroid = outline.reduce(
            (acc, point) => ({ x: acc.x + point.x, y: acc.y + point.y }),
            { x: 0, y: 0 }
        );
        centroid.x /= outline.length;
        centroid.y /= outline.length;

        // Calculate distances from centroid
        const distances = outline.map(point =>
            Math.sqrt(Math.pow(point.x - centroid.x, 2) + Math.pow(point.y - centroid.y, 2))
        );

        // Roundness: how consistent are the distances?
        const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;
        const variance = distances.reduce((acc, dist) => acc + Math.pow(dist - avgDistance, 2), 0) / distances.length;
        const roundness = Math.max(0, 1 - variance / (avgDistance * avgDistance));

        // Symmetry: check horizontal and vertical symmetry
        let symmetryScore = 0;
        const width = pixels[0]?.length || 0;
        const height = pixels.length;

        // Horizontal symmetry
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width / 2; x++) {
                if (pixels[y][x] === pixels[y][width - 1 - x]) symmetryScore += 0.5;
            }
        }

        // Vertical symmetry
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height / 2; y++) {
                if (pixels[y][x] === pixels[height - 1 - y][x]) symmetryScore += 0.5;
            }
        }

        const symmetry = symmetryScore / (width * height);

        // Corners: count significant direction changes (more robust)
        let corners = 0;
        let lastSignificantChange = 0;

        for (let i = 3; i < outline.length - 1; i++) {
            const p0 = outline[i-3];
            const p1 = outline[i-2];
            const p2 = outline[i-1];
            const p3 = outline[i];

            // Calculate direction vectors
            const v1x = p1.x - p0.x;
            const v1y = p1.y - p0.y;
            const v2x = p2.x - p1.x;
            const v2y = p2.y - p1.y;
            const v3x = p3.x - p2.x;
            const v3y = p3.y - p2.y;

            // Calculate angles
            const angle1 = Math.atan2(v2y, v2x) - Math.atan2(v1y, v1x);
            const angle2 = Math.atan2(v3y, v3x) - Math.atan2(v2y, v2x);

            // Normalize angles
            let normAngle1 = angle1;
            let normAngle2 = angle2;
            while (normAngle1 > Math.PI) normAngle1 -= 2 * Math.PI;
            while (normAngle1 < -Math.PI) normAngle1 += 2 * Math.PI;
            while (normAngle2 > Math.PI) normAngle2 -= 2 * Math.PI;
            while (normAngle2 < -Math.PI) normAngle2 += 2 * Math.PI;

            // Check for significant direction change
            const totalAngleChange = Math.abs(normAngle1) + Math.abs(normAngle2);
            const minCornerAngle = Math.PI / 3; // 60 degrees

            if (totalAngleChange > minCornerAngle && i - lastSignificantChange > 5) {
                corners++;
                lastSignificantChange = i;
            }
        }

        // Fallback: if no corners detected but shape seems angular, estimate based on outline complexity
        if (corners === 0 && outline.length > 20) {
            const complexity = outline.length / 50; // Rough estimate
            corners = Math.max(1, Math.round(complexity));
        }

        // Closed: check if shape forms a loop (more forgiving for children's drawings)
        const startPoint = outline[0];
        const endPoint = outline[outline.length - 1];
        const endDistance = Math.sqrt(Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2));

        // Consider closed if endpoints are reasonably close (relative to shape size)
        const shapeSize = Math.max(
            Math.max(...outline.map(p => p.x)) - Math.min(...outline.map(p => p.x)),
            Math.max(...outline.map(p => p.y)) - Math.min(...outline.map(p => p.y))
        );
        const closed = endDistance < Math.max(15, shapeSize * 0.1); // 15px or 10% of shape size

        // Also check if the shape generally forms a loop by seeing if it returns close to start
        let isLoop = false;
        if (outline.length > 10) {
            const quarterPoint = outline[Math.floor(outline.length * 0.75)];
            const loopDistance = Math.sqrt(Math.pow(quarterPoint.x - startPoint.x, 2) + Math.pow(quarterPoint.y - startPoint.y, 2));
            isLoop = loopDistance < shapeSize * 0.3; // Within 30% of shape size
        }

        const closedShape = closed || isLoop;

        return { roundness, symmetry, corners, closed: closedShape };
    };

    const determineShape = (properties: any): ShapeAnalysis => {
        const { roundness, symmetry, corners, closed } = properties;

        let shape = "Forme inconnue";
        let confidence = 0;

        // Prioritize corner-based detection over roundness for better shape distinction

        // Triangle detection - prioritize corners over roundness
        if (corners >= 2 && corners <= 6 && roundness < 0.8) {
            shape = "Triangle";
            confidence = Math.max(70, 100 - (Math.abs(corners - 3) * 15)); // 3 corners = 100% confidence
            if (closed) confidence += 10;
            if (symmetry > 0.3) confidence += 5;
            confidence = Math.min(100, confidence);
        }
        // Square/Rectangle detection - good symmetry and moderate corners
        else if (symmetry > 0.4 && corners >= 3 && corners <= 8 && roundness < 0.7) {
            shape = corners <= 5 ? "Carré" : "Rectangle";
            confidence = Math.round(symmetry * 100);
            if (closed) confidence += 15;
            if (corners === 4) confidence += 10; // Perfect for squares
            confidence = Math.min(100, confidence);
        }
        // Circle detection - only when roundness is dominant AND corners are minimal
        else if (roundness > 0.75 && corners < 3) {
            shape = "Cercle";
            confidence = Math.round(roundness * 100);
            if (closed) confidence += 10;
            if (symmetry > 0.5) confidence += 5;
            confidence = Math.min(100, confidence);
        }
        // Line detection - very few corners and not round
        else if (corners < 2 && roundness < 0.5) {
            shape = "Ligne";
            confidence = 80;
        }
        // Complex polygon
        else if (corners > 6 && roundness < 0.6) {
            shape = "Polygone Complexe";
            confidence = Math.min(80, corners * 8);
        }

        // Fallback for ambiguous shapes
        if (shape === "Forme inconnue") {
            // High roundness but some corners - could be circle
            if (roundness > 0.7) {
                shape = "Cercle (arrondi)";
                confidence = Math.round(roundness * 100 - corners * 5);
            }
            // Moderate symmetry - likely rectangle/square
            else if (symmetry > 0.5) {
                shape = "Forme Rectangulaire";
                confidence = Math.round(symmetry * 100);
            }
            // Some corners but not clear - triangle
            else if (corners >= 2 && corners <= 5) {
                shape = "Triangle (approximatif)";
                confidence = Math.max(50, 80 - Math.abs(corners - 3) * 10);
            }
            // Default fallback
            else {
                shape = "Forme Géométrique";
                confidence = Math.max(40, (roundness + symmetry) * 60);
            }
        }

        return {
            shape,
            confidence: Math.round(Math.max(0, Math.min(100, confidence))),
            properties
        };
    };

    const drawPixelGrid = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear and redraw original
        initializeCanvas();

        // Draw pixel grid overlay
        ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
        pixelData.forEach((row: boolean[], y: number) => {
            row.forEach((pixel: boolean, x: number) => {
                if (pixel) {
                    ctx.fillRect(x * 5, y * 5, 5, 5);
                }
            });
        });

        // Draw grid lines
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 20) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += 20) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    };

    const drawShapeOutline = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear and redraw original
        initializeCanvas();

        // Draw shape outline
        if (shapeOutline.length > 0) {
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(shapeOutline[0].x, shapeOutline[0].y);

            for (let i = 1; i < shapeOutline.length; i++) {
                ctx.lineTo(shapeOutline[i].x, shapeOutline[i].y);
            }

            ctx.closePath();
            ctx.stroke();
        }
    };

    const drawShapeAnalysis = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear and redraw original
        initializeCanvas();

        if (analysis) {
            // Draw analysis results
            ctx.fillStyle = '#0066ff';
            ctx.font = '20px Arial';
            ctx.fillText(`${analysis.shape} (${analysis.confidence}%)`, 20, 40);

            // Draw property indicators
            ctx.fillStyle = '#ff6600';
            ctx.font = '14px Arial';
            ctx.fillText(`Rond: ${(analysis.properties.roundness * 100).toFixed(0)}%`, 20, 70);
            ctx.fillText(`Symétrie: ${(analysis.properties.symmetry * 100).toFixed(0)}%`, 20, 90);
            ctx.fillText(`Coins: ${analysis.properties.corners}`, 20, 110);
            ctx.fillText(`Fermé: ${analysis.properties.closed ? 'Oui' : 'Non'}`, 20, 130);
        }
    };

    useEffect(() => {
        if (gamePhase === 'analysis' && selectedShape) {
            // Draw the current analysis step
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            steps[currentStep].analyzeFunction(ctx, selectedShape);
        }
    }, [currentStep, selectedShape?.name || '', gamePhase]);

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

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-100 to-cyan-100">
            <header className="bg-blue-500 py-4 shadow-lg">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center gap-2 text-white hover:text-blue-100"
                        >
                            ← Retour
                        </button>
                    </div>
                    <h1 className="text-2xl font-bold text-white">🎨 Reconnaître les Formes</h1>
                    <div className="w-20"></div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Instructions */}
                    <div className="bg-white rounded-3xl p-6 shadow-xl mb-8">
                        <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center">🎯 Comment ça marche ?</h2>
                        <p className="text-lg text-gray-700 text-center">
                            {gamePhase === 'selection'
                                ? "Clique sur une forme animée pour la sélectionner et découvrir comment l'IA l'analyse !"
                                : "L'IA analyse la forme que tu as sélectionnée étape par étape !"
                            }
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Drawing Canvas */}
                        <div className="bg-white rounded-3xl p-6 shadow-2xl">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                {React.createElement(steps[currentStep].icon, { className: "w-6 h-6 text-blue-600" })}
                                {gamePhase === 'selection' ? '🎨 Choisis une forme' : steps[currentStep].title}
                            </h3>

                            <div className="relative border-4 border-blue-300 rounded-2xl overflow-hidden mb-4">
                                <canvas
                                    ref={canvasRef}
                                    className={`w-full h-auto ${gamePhase === 'selection' ? 'cursor-pointer' : currentStep === 0 ? 'cursor-crosshair' : 'cursor-default'}`}
                                    onClick={gamePhase === 'selection' ? handleCanvasClick : undefined}
                                    onMouseDown={gamePhase === 'analysis' ? startDrawing : undefined}
                                    onMouseMove={gamePhase === 'analysis' ? draw : undefined}
                                    onMouseUp={gamePhase === 'analysis' ? stopDrawing : undefined}
                                    onMouseLeave={gamePhase === 'analysis' ? stopDrawing : undefined}
                                />
                            </div>

                            {/* Controls */}
                            <div className="flex justify-center gap-4 mb-4">
                                {gamePhase === 'selection' && (
                                    <div className="text-center text-gray-600">
                                        <p className="text-sm">Clique sur une forme pour commencer l'analyse</p>
                                    </div>
                                )}

                                {gamePhase === 'analysis' && currentStep === 0 && (
                                    <>
                                        <button
                                            onClick={() => {
                                                setGamePhase('selection');
                                                setSelectedShape(null);
                                                setAnalysis(null);
                                                setShowAnalysis(false);
                                                setCurrentStep(0);
                                                setIsAnimating(true);
                                                startShapeAnimation();
                                            }}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                                        >
                                            <RotateCcw className="w-4 h-4" />
                                            Choisir une autre forme
                                        </button>
                                        <button
                                            onClick={() => setCurrentStep(1)}
                                            className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold transition"
                                        >
                                            <Zap className="w-4 h-4" />
                                            Commencer l'analyse !
                                        </button>
                                    </>
                                )}

                                {gamePhase === 'analysis' && currentStep > 0 && (
                                    <>
                                        <button
                                            onClick={prevStep}
                                            disabled={currentStep === 0}
                                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 rounded-lg transition"
                                        >
                                            ← Précédent
                                        </button>
                                        <button
                                            onClick={nextStep}
                                            disabled={currentStep === steps.length - 1}
                                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 rounded-lg transition"
                                        >
                                            Suivant →
                                        </button>
                                    </>
                                )}
                            </div>

                            <p className="text-sm text-gray-600 text-center">
                                {gamePhase === 'selection'
                                    ? 'Les formes bougent ! Clique sur celle qui te plaît.'
                                    : steps[currentStep].description
                                }
                            </p>
                        </div>

                        {/* Analysis Panel */}
                        <div className="space-y-6">
                            {/* Shape Selection Info */}
                            {gamePhase === 'selection' && (
                                <div className="bg-white rounded-3xl p-6 shadow-2xl">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">✨ Formes Magiques</h3>
                                    <p className="text-gray-700 mb-4">
                                        Regarde les formes magiques qui flottent ! Clique sur celle qui t'intrigue le plus pour découvrir comment l'IA l'analyse.
                                    </p>
                                    <div className="grid grid-cols-2 gap-4">
                                        {shapes.map((shape, index) => (
                                            <div key={index} className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200 hover:border-purple-300 transition">
                                                <div className="text-3xl mb-2">{shape.emoji}</div>
                                                <div className="text-sm font-bold text-gray-800">{shape.name}</div>
                                                <div className="text-xs text-gray-600 mt-1">
                                                    {shape.properties.corners > 0 ? `${shape.properties.corners} coins` : 'Courbes lisses'}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Current Analysis */}
                            {gamePhase === 'analysis' && showAnalysis && analysis && selectedShape && (
                                <div className="bg-white rounded-3xl p-6 shadow-2xl">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">🔍 Analyse de {selectedShape.emoji} {selectedShape.name}</h3>

                                    <div className="text-center mb-4">
                                        <div className="text-4xl font-bold text-blue-600 mb-2">{analysis.shape}</div>
                                        <div className="text-2xl text-green-600 font-semibold">{analysis.confidence}% de certitude</div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span>Rond :</span>
                                            <span className="font-bold">{(analysis.properties.roundness * 100).toFixed(0)}%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Symétrie :</span>
                                            <span className="font-bold">{(analysis.properties.symmetry * 100).toFixed(0)}%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Coins détectés :</span>
                                            <span className="font-bold">{analysis.properties.corners}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Forme fermée :</span>
                                            <span className="font-bold">{analysis.properties.closed ? 'Oui' : 'Non'}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Educational Explanation */}
                            <div className="bg-white rounded-3xl p-6 shadow-2xl">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">🧠 Comment l'IA reconnaît les formes</h3>

                                <div className="space-y-4 text-sm text-gray-700">
                                    <div>
                                        <h4 className="font-bold text-blue-700 mb-1">🧩 1. Pixels comme LEGO</h4>
                                        <p>L'écran est fait de petits carrés (pixels). L'IA regarde chaque pixel comme des blocs de LEGO colorés.</p>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-blue-700 mb-1">⭐ 2. Recherche de motifs</h4>
                                        <p>L'IA sait ce qu'est un cercle : courbe lisse, même distance du centre, pas de coins, forme fermée.</p>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-blue-700 mb-1">🔍 3. Comparaison avec des exemples</h4>
                                        <p>L'IA a vu des milliers de cercles, carrés, triangles. Elle compare ton dessin avec ses souvenirs.</p>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-blue-700 mb-1">🧮 4. Vérification mathématique</h4>
                                        <p>Même si le cercle est un peu tremblant, l'IA utilise les maths : rondeur, symétrie, bords lisses.</p>
                                    </div>
                                </div>

                                <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                    <p className="text-yellow-800 text-sm font-medium">
                                        💡 <strong>Histoire pour enfants :</strong> "L'IA regarde ton dessin comme un détective.
                                        Elle vérifie si les lignes courbent doucement et reviennent à leur point de départ.
                                        Si ça ressemble à un ballon, l'IA dit : 'Aha ! C'est un cercle !'"
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