# Niveau 1 : Reconnais les Objets !

## Vue d'ensemble
Le Niveau 1 de AI Learning Lab introduit les concepts fondamentaux de l'intelligence artificielle appliquée à la vision par ordinateur. Ce niveau comprend 3 expériences interactives qui permettent aux utilisateurs d'explorer comment l'IA traite et comprend les images.

## Jeux et Fonctionnalités

### 1. Qu'est-ce que l'IA voit ?
**Modèle IA utilisé :** MobileNet (TensorFlow.js)
**Source des données :** Webcam en temps réel

**Fonctionnement :**
- Capture d'image en continu via la webcam
- Classification d'objets avec MobileNet
- Visualisation des différentes étapes de traitement :
  - Image normale
  - Analyse des motifs (contours, flou, contraste, points clés, zones, carte de chaleur)
  - Classification finale avec probabilités

**Étapes de réalisation :**
1. Intégration de TensorFlow.js et MobileNet
2. Implémentation de la capture webcam avec react-webcam
3. Création de visualisations canvas pour les filtres d'image
4. Développement de l'interface utilisateur avec contrôles de visualisation

**Difficulties rencontrées :**
- Optimisation des performances pour l'analyse en temps réel
- Gestion de la latence entre captures d'images
- Création de visualisations pédagogiques compréhensibles

### 2. Miroir Magique
**Modèle IA utilisé :** PoseNet (TensorFlow.js)
**Source des données :** Webcam en temps réel

**Fonctionnement :**
- Détection de 17 points clés du corps humain
- Jeu interactif : toucher son nez avec la main
- Calcul de distance euclidienne pour détecter le contact
- Explication mathématique du calcul de distance

**Étapes de réalisation :**
1. Configuration de PoseNet avec MediaPipe
2. Implémentation de la détection de keypoints
3. Développement du jeu de toucher de nez
4. Création de l'explication mathématique interactive

**Difficulties rencontrées :**
- Calibration de la sensibilité de détection du contact
- Gestion des variations d'éclairage et de position
- Optimisation pour les performances en temps réel

### 3. Détecteur d'Objets
**Modèle IA utilisé :** COCO-SSD (TensorFlow.js)
**Source des données :** Webcam en temps réel, entraîné sur COCO dataset

**Fonctionnement :**
- Détection d'objets multiples avec bounding boxes
- Affichage des scores de confiance
- Codage couleur pour différents types d'objets
- Statistiques en temps réel

**Étapes de réalisation :**
1. Intégration de COCO-SSD
2. Implémentation du rendu des bounding boxes
3. Système de codage couleur pour les classes
4. Interface de statistiques

**Difficulties rencontrées :**
- Gestion des performances avec détection multiple
- Optimisation du rendu des boîtes en temps réel
- Gestion des chevauchements de détections

## Intégration dans "Défi National"
Ce niveau fait partie du "Défi MiniMind 2025", un défi national tunisien pour l'éducation à l'IA. Il introduit les concepts de base de l'IA de manière ludique et accessible aux jeunes apprenants.

## Technologies utilisées
- **Frontend :** Next.js 16, React 19, TypeScript
- **IA :** TensorFlow.js avec 4 modèles spécialisés
- **UI :** Tailwind CSS, Radix UI
- **Webcam :** react-webcam
- **Animations :** CSS transitions

## Modèles TensorFlow.js détaillés

### MobileNet v2.1.1 - Classification d'images
**Utilisé dans :** "Qu'est-ce que l'IA voit ?"
- **Architecture :** Réseau neuronal convolutif optimisé pour mobile
- **Taille :** ~17MB (version légère pour le web)
- **Précision :** Top-1 accuracy de ~70% sur ImageNet
- **Latence :** ~50-100ms par inférence
- **Fonctionnement :** Transforme l'image en vecteur de caractéristiques, compare avec base d'apprentissage

### PoseNet v2.2.2 - Détection de poses
**Utilisé dans :** "Miroir Magique"
- **Points clés :** 17 points anatomiques détectés
- **Précision :** ~75% de précision sur les poses communes
- **Temps réel :** 10-30 FPS selon l'appareil
- **Application :** Calcul de distance euclidienne entre points (nez-poignet)
- **Formule :** Distance = √((x₂-x₁)² + (y₂-y₁)²)

### COCO-SSD v2.2.3 - Détection d'objets
**Utilisé dans :** "Détecteur d'Objets"
- **Dataset :** Entraîné sur COCO (80 classes d'objets)
- **Architecture :** Single Shot MultiBox Detector
- **Sortie :** Bounding boxes + scores de confiance + labels
- **Performance :** ~20-40 FPS sur appareils modernes
- **Classes :** person, car, dog, cat, chair, bottle, etc.

## Métriques d'apprentissage
- Compréhension des concepts de base de la vision par ordinateur
- Introduction aux modèles de classification et détection
- Notions mathématiques appliquées (distance euclidienne, probabilités)
- Sensibilité aux limitations de l'IA