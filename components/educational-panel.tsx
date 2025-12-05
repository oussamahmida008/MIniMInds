import React from 'react';
import { BookOpen, Lightbulb, AlertTriangle, HelpCircle } from 'lucide-react';

export interface ConceptInfo {
    title: string;
    description: string;
    analogy?: string;
}

export interface DecisionExplanation {
    why: string;
    how: string;
    confidence?: string;
}

export interface GlossaryTerm {
    term: string;
    definition: string;
    example?: string;
}

export interface EducationalPanelProps {
    concept: ConceptInfo;
    decisionExplanation?: DecisionExplanation;
    limitations?: string[];
    glossary?: GlossaryTerm[];
}

export function EducationalPanel({
    concept,
    decisionExplanation,
    limitations,
    glossary
}: EducationalPanelProps) {
    const [expandedTerm, setExpandedTerm] = React.useState<string | null>(null);

    return (
        <div className="h-full overflow-y-auto p-6 bg-slate-900/50 backdrop-blur-sm border-l border-white/10">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Pédagogie</h3>
                        <p className="text-xs text-blue-300">Comprendre l'IA</p>
                    </div>
                </div>

                {/* Concept */}
                <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-400" />
                        {concept.title}
                    </h4>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10 space-y-3">
                        <p className="text-sm text-white/90 leading-relaxed">{concept.description}</p>
                        {concept.analogy && (
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                                <p className="text-xs text-blue-300">
                                    <span className="font-semibold">💡 Analogie : </span>
                                    {concept.analogy}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Decision Explanation */}
                {decisionExplanation && (
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                            <HelpCircle className="w-4 h-4 text-purple-400" />
                            Pourquoi cette Décision ?
                        </h4>
                        <div className="space-y-3">
                            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <p className="text-xs font-semibold text-purple-300 mb-2">🎯 Pourquoi ?</p>
                                <p className="text-sm text-white/90">{decisionExplanation.why}</p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <p className="text-xs font-semibold text-blue-300 mb-2">⚙️ Comment ?</p>
                                <p className="text-sm text-white/90">{decisionExplanation.how}</p>
                            </div>
                            {decisionExplanation.confidence && (
                                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                    <p className="text-xs font-semibold text-green-300 mb-2">📊 Confiance</p>
                                    <p className="text-sm text-white/90">{decisionExplanation.confidence}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Limitations */}
                {limitations && limitations.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-orange-400" />
                            Limites du Modèle
                        </h4>
                        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                            <ul className="space-y-2">
                                {limitations.map((limitation, i) => (
                                    <li key={i} className="text-sm text-orange-200 flex items-start gap-2">
                                        <span className="text-orange-400 mt-0.5">❌</span>
                                        <span>{limitation}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Glossary */}
                {glossary && glossary.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-white">📚 Glossaire</h4>
                        <div className="space-y-2">
                            {glossary.map((item, i) => (
                                <div key={i} className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                                    <button
                                        onClick={() => setExpandedTerm(expandedTerm === item.term ? null : item.term)}
                                        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                                    >
                                        <span className="text-sm font-medium text-white">{item.term}</span>
                                        <span className="text-xs text-white/60">
                                            {expandedTerm === item.term ? '−' : '+'}
                                        </span>
                                    </button>
                                    {expandedTerm === item.term && (
                                        <div className="px-4 pb-3 space-y-2">
                                            <p className="text-sm text-white/80">{item.definition}</p>
                                            {item.example && (
                                                <div className="bg-blue-500/10 border border-blue-500/20 rounded p-2">
                                                    <p className="text-xs text-blue-300">
                                                        <span className="font-semibold">Exemple : </span>
                                                        {item.example}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
