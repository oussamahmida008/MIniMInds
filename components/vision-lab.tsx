"use client"

import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { Brain, Eye, Gamepad2, Camera, CheckCircle, AlertTriangle, ArrowRight, ArrowLeft } from 'lucide-react';
import './ai-lab.css';

interface Prediction {
  className: string;
  probability: number;
}

export function VisionLab() {
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  // Step 1 State
  const [showConcepts, setShowConcepts] = useState(false);

  // Step 2 State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visionMode, setVisionMode] = useState<'normal' | 'pixel' | 'edges'>('normal');

  // Step 3 State
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [gameFeedback, setGameFeedback] = useState('');

  // Step 4 State (Camera)
  const webcamRef = useRef<Webcam>(null);
  const [model, setModel] = useState<mobilenet.MobileNet | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scanState, setScanState] = useState<'idle' | 'countdown' | 'analyzing' | 'complete'>('idle');
  const [countdown, setCountdown] = useState(3);
  const [userAgreement, setUserAgreement] = useState<'yes' | 'no' | null>(null);

  // Load Model (Only once)
  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        const loadedModel = await mobilenet.load({ version: 2, alpha: 1.0 });
        setModel(loadedModel);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load model:', err);
        setIsLoading(false);
      }
    };
    loadModel();
  }, []);

  // Step 2: Canvas Drawing
  useEffect(() => {
    if (step === 2 && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      const img = new Image();
      img.src = 'https://placehold.co/400x400/png?text=Pomme'; // Placeholder apple
      img.crossOrigin = "Anonymous";
      
      img.onload = () => {
        if (!ctx) return;
        canvasRef.current!.width = 400;
        canvasRef.current!.height = 400;

        if (visionMode === 'normal') {
          ctx.imageSmoothingEnabled = true;
          ctx.drawImage(img, 0, 0, 400, 400);
        } else if (visionMode === 'pixel') {
          // Draw small then scale up
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(img, 0, 0, 20, 20);
          ctx.drawImage(canvasRef.current!, 0, 0, 20, 20, 0, 0, 400, 400);
        } else if (visionMode === 'edges') {
           ctx.drawImage(img, 0, 0, 400, 400);
           const imageData = ctx.getImageData(0, 0, 400, 400);
           const data = imageData.data;
           // Simple grayscale + threshold for "edges" look
           for (let i = 0; i < data.length; i += 4) {
             const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
             const val = avg > 128 ? 255 : 0; // Binary
             data[i] = val;
             data[i + 1] = val;
             data[i + 2] = val;
           }
           ctx.putImageData(imageData, 0, 0);
        }
      };
    }
  }, [step, visionMode]);


  // Camera Logic
  const startScan = () => {
    if (scanState !== 'idle' && scanState !== 'complete') return;
    setScanState('countdown');
    setCountdown(3);
    setPredictions([]);
    setUserAgreement(null);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          performScan();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const performScan = async () => {
    setScanState('analyzing');
    if (model && webcamRef.current && webcamRef.current.video && webcamRef.current.video.readyState === 4) {
      const video = webcamRef.current.video;
      await new Promise(r => setTimeout(r, 500));
      const preds = await model.classify(video);
      setPredictions(preds);
      setScanState('complete');
    } else {
      setScanState('idle');
    }
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="ai-lab-wrapper">
      <div className="lab-container">
        
        {/* Header */}
        <header className="lab-header">
          <h1 className="lab-title">Laboratoire IA</h1>
          <p className="lab-subtitle">Comprendre l'Intelligence Artificielle, étape par étape.</p>
        </header>

        {/* Progress Bar */}
        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
        </div>

        {/* Step Content */}
        <main className="step-content">
          
          {/* STEP 1: Human Brain */}
          {step === 1 && (
            <>
              <div className="step-icon"><Brain size={48} color="var(--lab-primary)" /></div>
              <h2 className="step-title">Étape 1 : Cerveau Humain vs Machine</h2>
              <p className="step-description">
                Regardez cette image pendant 5 secondes. Qu'est-ce que vous voyez ?
              </p>
              
              <div className="brain-image-container">
                <img src="https://placehold.co/600x400/png?text=Objet+Mystere" alt="Mystery Object" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              </div>

              {!showConcepts ? (
                <button className="btn-primary" onClick={() => setShowConcepts(true)}>
                  Je vois un objet !
                </button>
              ) : (
                <div style={{ animation: 'fadeInUp 0.5s forwards' }}>
                  <p className="step-description">
                    Comment avez-vous su ? Grâce à votre :
                  </p>
                  <div className="concept-tags">
                    <span className="concept-tag">Mémoire</span>
                    <span className="concept-tag">Expérience</span>
                    <span className="concept-tag">Entraînement</span>
                  </div>
                  <p className="step-description" style={{ marginTop: '1.5rem' }}>
                    L'IA fonctionne pareil, mais avec des <strong>données</strong> à la place des souvenirs.
                  </p>
                </div>
              )}
            </>
          )}

          {/* STEP 2: How AI Sees */}
          {step === 2 && (
            <>
              <div className="step-icon"><Eye size={48} color="var(--lab-primary)" /></div>
              <h2 className="step-title">Étape 2 : Comment l'IA « voit »</h2>
              <p className="step-description">
                Pour une IA, une image n'est pas un objet. C'est une grille de nombres.
              </p>

              <div className="vision-grid">
                <div className="vision-card">
                  <canvas ref={canvasRef} className="pixel-canvas"></canvas>
                </div>
                <div className="vision-controls" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
                  <button 
                    className={`feature-btn ${visionMode === 'normal' ? 'selected' : ''}`}
                    onClick={() => setVisionMode('normal')}
                  >
                    Image Normale
                  </button>
                  <button 
                    className={`feature-btn ${visionMode === 'pixel' ? 'selected' : ''}`}
                    onClick={() => setVisionMode('pixel')}
                  >
                    Vision Pixels (Zoom)
                  </button>
                  <button 
                    className={`feature-btn ${visionMode === 'edges' ? 'selected' : ''}`}
                    onClick={() => setVisionMode('edges')}
                  >
                    Vision Contours (Maths)
                  </button>
                </div>
              </div>
              
              <p className="step-description">
                L'ordinateur analyse chaque pixel (couleur, luminosité) pour trouver des formes.
              </p>
            </>
          )}

          {/* STEP 3: Learning Game */}
          {step === 3 && (
            <>
              <div className="step-icon"><Gamepad2 size={48} color="var(--lab-primary)" /></div>
              <h2 className="step-title">Étape 3 : Apprends à la machine</h2>
              <p className="step-description">
                Voici des chaises. Quels sont leurs points communs ? (Sélectionnez les bonnes réponses)
              </p>

              <div className="features-game">
                <div className="images-row">
                  <img src="https://placehold.co/100x100/png?text=Chaise+1" className="game-img" />
                  <img src="https://placehold.co/100x100/png?text=Chaise+2" className="game-img" />
                  <img src="https://placehold.co/100x100/png?text=Chaise+3" className="game-img" />
                </div>

                <div className="features-options">
                  {['4 pieds', 'Un moteur', 'Une surface plane', 'Des plumes', 'Un dossier'].map(feature => (
                    <button
                      key={feature}
                      className={`feature-btn ${selectedFeatures.includes(feature) ? 'selected' : ''}`}
                      onClick={() => {
                        if (selectedFeatures.includes(feature)) {
                          setSelectedFeatures(prev => prev.filter(f => f !== feature));
                        } else {
                          setSelectedFeatures(prev => [...prev, feature]);
                        }
                      }}
                    >
                      {feature}
                    </button>
                  ))}
                </div>

                <button 
                  className="btn-primary" 
                  style={{ marginTop: '2rem' }}
                  onClick={() => {
                    const correct = ['4 pieds', 'Une surface plane', 'Un dossier'];
                    const userCorrect = selectedFeatures.filter(f => correct.includes(f));
                    if (userCorrect.length >= 2 && !selectedFeatures.includes('Un moteur') && !selectedFeatures.includes('Des plumes')) {
                      setGameFeedback("Bravo ! Tu as trouvé les 'Features' (caractéristiques) importantes.");
                    } else {
                      setGameFeedback("Essaie encore. Cherche ce qui définit une chaise.");
                    }
                  }}
                >
                  Vérifier
                </button>

                {gameFeedback && (
                  <div className="feedback-section">
                    {gameFeedback}
                  </div>
                )}
              </div>
            </>
          )}

          {/* STEP 4: Camera & MobileNet */}
          {step === 4 && (
            <>
              <div className="step-icon"><Camera size={48} color="var(--lab-primary)" /></div>
              <h2 className="step-title">Étape 4 : L'IA en Action</h2>
              <p className="step-description">
                Maintenant, testons le modèle <strong>MobileNet</strong>. Montrez un objet à la caméra.
              </p>

              <div className="camera-layout">
                <div className="webcam-wrapper">
                  {isLoading && <div className="loading-overlay"><div className="spinner"></div><p>Chargement...</p></div>}
                  {scanState === 'countdown' && (
                    <div className="loading-overlay">
                      <div style={{ fontSize: '5rem', fontWeight: 'bold' }}>{countdown}</div>
                      <p>Ne bougez plus !</p>
                    </div>
                  )}
                  {scanState === 'analyzing' && (
                    <div className="loading-overlay"><div className="spinner"></div><p>Analyse en cours...</p></div>
                  )}
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    className="webcam-video"
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ facingMode: "user", width: 640, height: 480 }}
                  />
                </div>

                <div className="analysis-sidebar">
                  <button 
                    className="btn-primary" 
                    style={{ width: '100%', marginBottom: '1rem' }}
                    onClick={startScan}
                    disabled={isLoading || scanState === 'countdown' || scanState === 'analyzing'}
                  >
                    {scanState === 'idle' ? '📸 Scanner (3s)' : '📸 Scanner à nouveau'}
                  </button>

                  <div className="prediction-list">
                    {predictions.map((pred, idx) => (
                      <div key={idx} className="prediction-item">
                        <div className="pred-header">
                          <span>{pred.className}</span>
                          <span>{(pred.probability * 100).toFixed(0)}%</span>
                        </div>
                        <div className="pred-bar-bg">
                          <div className="pred-bar-fill" style={{ width: `${pred.probability * 100}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {scanState === 'complete' && (
                    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                      <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Êtes-vous d'accord avec l'IA ?</p>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button 
                          className={`feature-btn ${userAgreement === 'yes' ? 'selected' : ''}`}
                          onClick={() => setUserAgreement('yes')}
                        >
                          ✅ OUI
                        </button>
                        <button 
                          className={`feature-btn ${userAgreement === 'no' ? 'selected' : ''}`}
                          onClick={() => setUserAgreement('no')}
                        >
                          ❌ NON
                        </button>
                      </div>
                      {userAgreement === 'no' && (
                        <p style={{ fontSize: '0.8rem', color: 'orange', marginTop: '0.5rem' }}>
                          C'est normal ! L'IA peut se tromper si elle n'a jamais vu cet objet sous cet angle.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* STEP 5: Conclusion */}
          {step === 5 && (
            <>
              <div className="step-icon"><CheckCircle size={48} color="var(--lab-primary)" /></div>
              <h2 className="step-title">Étape 5 : Pourquoi l'IA a décidé ça ?</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', textAlign: 'left', maxWidth: '800px' }}>
                <div className="edu-card">
                  <div className="edu-title">🧠 Analyse des Features</div>
                  <p className="edu-text">
                    L'IA a comparé les <strong>formes</strong> (bords droits, courbes) et les <strong>textures</strong> de votre objet avec les millions d'images de sa base de données.
                  </p>
                </div>
                <div className="edu-card">
                  <div className="edu-title">⚠️ Les Biais</div>
                  <p className="edu-text">
                    Si l'IA se trompe, c'est peut-être parce qu'elle a été entraînée surtout sur des photos américaines ou européennes. Elle ne connaît que ce qu'on lui a montré !
                  </p>
                </div>
              </div>

              <div style={{ marginTop: '2rem', padding: '1rem', background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '0.5rem', color: '#92400e' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                  <AlertTriangle size={20} /> Conclusion
                </h3>
                <p>
                  L'IA n'est pas magique. C'est un outil mathématique puissant qui apprend par l'exemple.
                  Comme nous, elle a besoin de bons professeurs (données) pour réussir.
                </p>
              </div>
            </>
          )}

        </main>

        {/* Navigation Footer */}
        <footer className="nav-buttons">
          <button 
            className="btn-secondary" 
            onClick={prevStep}
            disabled={step === 1}
          >
            <ArrowLeft size={16} style={{ marginRight: '0.5rem', display: 'inline' }} /> Précédent
          </button>
          
          <button 
            className="btn-primary" 
            onClick={nextStep}
            disabled={step === totalSteps}
          >
            {step === totalSteps ? 'Terminé' : 'Suivant'} <ArrowRight size={16} style={{ marginLeft: '0.5rem', display: 'inline' }} />
          </button>
        </footer>

      </div>
    </div>
  );
}

