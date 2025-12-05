import React from 'react';
import { Brain, Database, Layers, Zap } from 'lucide-react';

export interface ModelInfo {
    name: string;
    version: string;
    type: string;
    size: string;
    layers?: number;
    parameters?: string;
}

export interface DatasetInfo {
    name: string;
    classes: number;
    images?: string;
    examples?: string[];
}

export interface ProcessingStep {
    step: string;
    progress: number;
    time?: number;
}

export interface Prediction {
    class: string;
    confidence: number;
    explanation?: string;
}

export interface AIBrainPanelProps {
    modelInfo: ModelInfo;
    datasetInfo?: DatasetInfo;
    processing?: ProcessingStep;
    predictions?: Prediction[];
    rawOutput?: number[];
    threshold?: number;
}

export function AIBrainPanel({
    modelInfo,
    datasetInfo,
    processing,
    predictions,
    rawOutput,
    threshold = 0.1
}: AIBrainPanelProps) {
    return (
        <div className="h-full overflow-y-auto p-6 bg-slate-900/50 backdrop-blur-sm border-l border-white/10">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                        <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Cerveau de l'IA</h3>
                        <p className="text-xs text-purple-300">Comment l'IA décide</p>
                    </div>
                </div>

                {/* Model Info */}
                <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                        <Layers className="w-4 h-4 text-purple-400" />
                        Modèle Utilisé
                    </h4>
                    <div className="bg-white/5 rounded-lg p-4 space-y-2 border border-white/10">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-white/60">Nom</span>
                            <span className="text-sm font-medium text-white">{modelInfo.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-white/60">Version</span>
                            <span className="text-sm font-medium text-purple-300">{modelInfo.version}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-white/60">Type</span>
                            <span className="text-sm font-medium text-white">{modelInfo.type}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-white/60">Taille</span>
                            <span className="text-sm font-medium text-white">{modelInfo.size}</span>
                        </div>
                        {modelInfo.layers && (
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-white/60">Couches</span>
                                <span className="text-sm font-medium text-white">{modelInfo.layers}</span>
                            </div>
                        )}
                        {modelInfo.parameters && (
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-white/60">Paramètres</span>
                                <span className="text-sm font-medium text-white">{modelInfo.parameters}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Dataset Info */}
                {datasetInfo && (
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                            <Database className="w-4 h-4 text-blue-400" />
                            Dataset d'Entraînement
                        </h4>
                        <div className="bg-white/5 rounded-lg p-4 space-y-2 border border-white/10">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-white/60">Nom</span>
                                <span className="text-sm font-medium text-white">{datasetInfo.name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-white/60">Classes</span>
                                <span className="text-sm font-medium text-white">{datasetInfo.classes}</span>
                            </div>
                            {datasetInfo.images && (
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-white/60">Images</span>
                                    <span className="text-sm font-medium text-white">{datasetInfo.images}</span>
                                </div>
                            )}
                            {datasetInfo.examples && datasetInfo.examples.length > 0 && (
                                <div className="mt-2">
                                    <span className="text-xs text-white/60 block mb-2">Exemples</span>
                                    <div className="flex flex-wrap gap-1">
                                        {datasetInfo.examples.slice(0, 6).map((example, i) => (
                                            <span key={i} className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-300">
                                                {example}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Processing Status */}
                {processing && (
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                            <Zap className="w-4 h-4 text-yellow-400" />
                            Traitement en Cours
                        </h4>
                        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-white">{processing.step}</span>
                                {processing.time && (
                                    <span className="text-xs text-white/60">{processing.time}ms</span>
                                )}
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-600 transition-all duration-300"
                                    style={{ width: `${processing.progress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Predictions */}
                {predictions && predictions.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-white">Top Prédictions</h4>
                        <div className="space-y-2">
                            {predictions.map((pred, i) => (
                                <div key={i} className="bg-white/5 rounded-lg p-3 border border-white/10">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-white">{pred.class}</span>
                                        <span className="text-sm font-bold text-purple-400">
                                            {(pred.confidence * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-purple-500 to-pink-600"
                                            style={{ width: `${pred.confidence * 100}%` }}
                                        ></div>
                                    </div>
                                    {pred.explanation && (
                                        <p className="text-xs text-white/60 mt-2">{pred.explanation}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Raw Output (simplified) */}
                {rawOutput && rawOutput.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-white">Sortie Brute</h4>
                        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                            <p className="text-xs text-white/60 mb-2">
                                Vecteur de {rawOutput.length} probabilités
                            </p>
                            <div className="flex flex-wrap gap-1">
                                {rawOutput.slice(0, 20).map((val, i) => (
                                    <div
                                        key={i}
                                        className="w-1 h-8 bg-gradient-to-t from-purple-500 to-pink-600 rounded-sm"
                                        style={{ opacity: val }}
                                        title={`${(val * 100).toFixed(1)}%`}
                                    ></div>
                                ))}
                                {rawOutput.length > 20 && (
                                    <span className="text-xs text-white/40 self-center ml-1">
                                        +{rawOutput.length - 20}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
