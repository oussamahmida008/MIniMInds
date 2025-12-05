# Niveau 4 : Comprendre les LLM

## Vue d'ensemble
Le Niveau 4 explore les Large Language Models (LLM) et les technologies de traitement du langage naturel. Ce niveau comprend 2 expériences qui démystifient le fonctionnement interne des IA conversationnelles comme ChatGPT.

## Jeux et Fonctionnalités

### 1. La Machine à Mots
**Modèle IA utilisé :** Simulation personnalisée (pas de vrai LLM)
**Source des données :** Base de données mock avec prédictions pré-définies

**Fonctionnement :**
- Simulation de prédiction de mots suivante
- Interface interactive de construction de phrases
- Explication des concepts clés des LLM :
  - Tokenization (découpage en tokens)
  - Context window (fenêtre de contexte)
  - Training (entraînement)
- Visualisations pédagogiques pour chaque concept

**Étapes de réalisation :**
1. Création de la base de données mock de prédictions
2. Développement de l'interface de construction de phrases
3. Implémentation des trois laboratoires interactifs :
   - Laboratoire de tokenization
   - Laboratoire de fenêtre de contexte
   - Laboratoire d'entraînement
4. Création des animations et transitions

**Difficulties rencontrées :**
- Conception d'exemples pédagogiques compréhensibles
- Gestion de l'état complexe de l'interface
- Synchronisation des animations avec les explications
- Équilibre entre simplification et précision technique

### 2. L'Œil qui Lit (OCR)
**Modèle IA utilisé :** Simulation OCR (pas de vrai modèle OCR)
**Source des données :** Image LLM.png intégrée au projet

**Fonctionnement :**
- Simulation du processus OCR étape par étape :
  - Image originale
  - Détection de contours
  - Reconnaissance de caractères
  - Texte final extrait
- Utilisation de canvas pour les transformations visuelles
- Extraction simulée du texte contenu dans l'image

**Étapes de réalisation :**
1. Analyse de l'image LLM.png pour extraction du texte
2. Développement des filtres canvas pour simulation OCR
3. Création de l'animation séquentielle des étapes
4. Implémentation de l'extraction de texte progressive

**Difficulties rencontrées :**
- Simulation réaliste des étapes OCR
- Gestion des timings d'animation
- Extraction précise du texte de l'image
- Synchronisation entre visualisation et texte extrait

## Intégration dans "Défi National"
Ce niveau fait partie du "Défi MiniMind 2025" et aborde des concepts avancés d'IA générative, essentiels pour comprendre les technologies d'IA conversationnelle modernes.

## Technologies utilisées
- **Frontend :** Next.js 16, React 19, TypeScript
- **Canvas :** HTML5 Canvas pour visualisations OCR
- **Animations :** CSS transitions et animations React
- **Mock Data :** Base de données JSON pour simulations

## Concepts pédagogiques clés

### Tokenization
- Découpage du texte en unités plus petites (tokens)
- Simulation simplifiée : découpage en 2-3 caractères
- Concept essentiel pour le traitement du langage

### Context Window
- Mémoire limitée de l'IA pour le contexte
- Glissement de fenêtre (sliding window)
- Impact sur la compréhension à long terme

### Training
- Apprentissage par exposition massive à des textes
- Création de connexions entre mots
- Visualisation des probabilités apprises

### OCR (Optical Character Recognition)
- Conversion image → texte
- Étapes : préprocessing, segmentation, reconnaissance, post-processing
- Applications pratiques dans la numérisation

## Métriques d'apprentissage
- Compréhension des mécanismes internes des LLM
- Notions de traitement du langage naturel
- Introduction aux technologies OCR
- Sensibilité aux limitations des IA génératives