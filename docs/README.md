# AI Learning Lab - Documentation

## Vue d'ensemble de l'application

**AI Learning Lab** est une application éducative interactive développée pour le **Défi MiniMind 2025**, un défi national tunisien pour l'éducation à l'intelligence artificielle. L'application propose 4 niveaux d'apprentissage progressif pour découvrir le fonctionnement de l'IA de manière ludique.

## Structure des niveaux

### 🏗️ Architecture générale
- **Framework :** Next.js 16 avec React 19 et TypeScript
- **Styling :** Tailwind CSS avec composants Radix UI
- **IA :** TensorFlow.js pour les modèles côté client
- **Animations :** Transitions CSS et animations React

### 📚 Niveaux disponibles

| Niveau | Thème | Jeux | Technologies IA |
|--------|-------|------|-----------------|
| **1** | Reconnais les Objets | 3 jeux | MobileNet, PoseNet, COCO-SSD |
| **2** | Analyse d'Images et Formes | 2 jeux | COCO-SSD, algorithmes personnalisés |
| **4** | Comprendre les LLM | 2 expériences | Simulations pédagogiques |
| **5** | Pourquoi l'IA fait des Erreurs | 1 expérience | Visualisations canvas |

## Modèles IA utilisés

### Modèles TensorFlow.js utilisés

Voir le fichier détaillé [`modeles-tensorflow.md`](modeles-tensorflow.md) pour une explication complète de chaque modèle.

#### **Aperçu rapide :**
- **MobileNet v2.1.1** : Classification d'images (Niveau 1)
- **PoseNet v2.2.2** : Détection de poses (Niveau 1)
- **COCO-SSD v2.2.3** : Détection d'objets (Niveau 1 & 2)
- **Pose Detection v2.1.3** : Poses avancées (support)

### Algorithmes personnalisés
- **Analyse de formes :** Géométrie algorithmique (Level 2)
- **Calcul IoU :** Métriques d'évaluation (Level 2)
- **Simulations pédagogiques :** LLM et OCR (Level 4)

## Sources de données

### Données d'entraînement des modèles
- **ImageNet :** Pour MobileNet (classification générale)
- **COCO Dataset :** Pour COCO-SSD (détection d'objets)
- **Données propriétaires :** Pour PoseNet (poses humaines)

### Données intégrées à l'application
- **Mock data :** Prédictions LLM simulées
- **Images statiques :** LLM.png pour démonstration OCR
- **Données canvas :** Dessins utilisateur pour analyse de formes

## Fonctionnement de l'application

### Architecture technique
```
AI Learning Lab
├── app/                    # Pages Next.js
│   ├── page.tsx           # Page d'accueil
│   ├── level-1/           # Niveau 1
│   ├── level-2/           # Niveau 2
│   ├── level-4/           # Niveau 4
│   └── level-5/           # Niveau 5
├── components/            # Composants React
│   ├── level1/            # Composants niveau 1
│   ├── level2/            # Composants niveau 2
│   ├── level4/            # Composants niveau 4
│   └── level5/            # Composants niveau 5
└── docs/                  # Documentation
```

### Flux utilisateur
1. **Page d'accueil :** Sélection du niveau
2. **Menu du niveau :** Choix du jeu/expérience
3. **Expérience interactive :** Apprentissage par la pratique
4. **Retour :** Navigation fluide entre niveaux

## Intégration "Défi National"

L'application est spécifiquement conçue pour le **Défi MiniMind 2025**, un événement éducatif national tunisien. Elle s'intègre parfaitement dans l'écosystème du défi en :

- **Éducation ludique :** Apprentissage de l'IA par le jeu
- **Progression pédagogique :** Concepts de base vers avancés
- **Accessibilité :** Interface adaptée aux jeunes apprenants
- **Culture locale :** Contenu en français, références tunisiennes

## Métriques d'impact éducatif

### Objectifs pédagogiques
- **Compréhension technique :** Démystifier le fonctionnement de l'IA
- **Pensée critique :** Développer l'esprit critique vis-à-vis des technologies
- **Éthique :** Sensibilité aux implications sociales de l'IA
- **Créativité :** Encourager l'expérimentation et l'innovation

### Concepts clés enseignés
- Vision par ordinateur (classification, détection, segmentation)
- Traitement du langage naturel (tokenization, context windows)
- Métriques d'évaluation (IoU, précision, rappel)
- Limitations et biais des systèmes d'IA

## Technologies et dépendances

### Core Dependencies
```json
{
  "@tensorflow/tfjs": "^4.22.0",
  "@tensorflow-models/mobilenet": "^2.1.1",
  "@tensorflow-models/coco-ssd": "^2.2.3",
  "@tensorflow-models/posenet": "^2.2.2",
  "react-webcam": "^7.2.0",
  "next": "16.0.3",
  "react": "19.2.0"
}
```

### Développement
- **Build :** Next.js avec optimisation automatique
- **Déploiement :** Vercel avec analytics intégrés
- **Performance :** Optimisations TensorFlow.js pour le web
- **Accessibilité :** Support multilingue et responsive design

## Défis techniques rencontrés

### Performance
- **Optimisation IA :** Modèles TensorFlow.js optimisés pour le navigateur
- **Latence :** Gestion des délais entre analyses d'images
- **Mémoire :** Gestion des ressources canvas et modèles

### Pédagogie
- **Simplification :** Traduction de concepts complexes en expériences ludiques
- **Engagement :** Maintenir l'attention des jeunes apprenants
- **Progression :** Équilibre entre challenge et accessibilité

### Technique
- **Canvas interactions :** Gestion complexe des événements souris
- **Synchronisation :** Coordination entre IA et interface utilisateur
- **Responsive :** Adaptation aux différents appareils

## Perspectives d'évolution

### Améliorations possibles
- **Niveau 3 :** Ajout d'un niveau intermédiaire
- **Multijoueur :** Fonctionnalités collaboratives
- **Personnalisation :** Adaptation au niveau de l'apprenant
- **Analytics :** Suivi détaillé de la progression

### Extensions
- **API externes :** Intégration de vrais LLM (OpenAI, etc.)
- **Base de données :** Stockage des progrès utilisateurs
- **Gamification :** Système de badges et récompenses
- **Multilingue :** Support d'autres langues

---

*Cette documentation détaille l'architecture et le fonctionnement de AI Learning Lab, développé pour le Défi MiniMind 2025.*