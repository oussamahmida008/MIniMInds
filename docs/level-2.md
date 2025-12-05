# Niveau 2 : Analyse d'Images et Formes

## Vue d'ensemble
Le Niveau 2 approfondit les concepts de vision par ordinateur en se concentrant sur l'analyse d'images et la reconnaissance de formes. Ce niveau comprend 2 jeux interactifs qui explorent les techniques avancées de traitement d'images et les métriques d'évaluation en IA.

## Jeux et Fonctionnalités

### 1. Jeu des Boîtes
**Modèle IA utilisé :** COCO-SSD (TensorFlow.js)
**Source des données :** Webcam en temps réel, entraîné sur COCO dataset

**Fonctionnement :**
- Détection d'objets avec COCO-SSD en arrière-plan
- Interface utilisateur pour dessiner des bounding boxes
- Évaluation basée sur l'Intersection over Union (IoU)
- Système de scoring et feedback en temps réel

**Étapes de réalisation :**
1. Intégration de COCO-SSD pour la détection de référence
2. Implémentation de l'interface de dessin canvas
3. Développement de l'algorithme IoU personnalisé
4. Création du système de scoring et feedback

**Difficulties rencontrées :**
- Implémentation précise du calcul IoU
- Gestion des interactions souris sur canvas
- Synchronisation entre détection IA et input utilisateur
- Calibration des seuils de scoring

### 2. Reconnaître les Formes
**Modèle IA utilisé :** Algorithme personnalisé (pas de modèle pré-entraîné)
**Source des données :** Dessins utilisateur sur canvas

**Fonctionnement :**
- Analyse pixel par pixel des dessins utilisateur
- Calcul de propriétés géométriques :
  - Rondeur (roundness)
  - Symétrie (symmetry)
  - Nombre de coins (corners)
  - Fermeture de forme (closed)
- Classification basée sur des seuils mathématiques
- Visualisation des étapes d'analyse

**Étapes de réalisation :**
1. Développement de l'algorithme d'analyse de formes personnalisé
2. Implémentation de la conversion pixel-grid
3. Création de l'extraction de contours
4. Développement des métriques de forme (rondeur, symétrie, coins)
5. Système de classification basé sur règles

**Difficulties rencontrées :**
- Algorithme robuste de détection de contours
- Calcul précis des propriétés géométriques
- Gestion des dessins enfants (imprécis)
- Définition de seuils appropriés pour la classification

## Intégration dans "Défi National"
Ce niveau fait partie du "Défi MiniMind 2025" et introduit des concepts plus avancés de métriques d'évaluation en IA, essentiels pour comprendre comment mesurer la performance des modèles de vision par ordinateur.

## Technologies utilisées
- **Frontend :** Next.js 16, React 19, TypeScript
- **IA :** TensorFlow.js, COCO-SSD v2.2.3
- **Canvas :** HTML5 Canvas API pour dessins et visualisations
- **Mathématiques :** Algorithmes géométriques personnalisés
- **UI :** Tailwind CSS, animations CSS

## Modèle TensorFlow.js détaillé

### COCO-SSD v2.2.3 - Détection d'objets pour évaluation
**Utilisé dans :** "Jeu des Boîtes"
- **Architecture :** Single Shot MultiBox Detector (SSD)
- **Base d'entraînement :** COCO dataset (Common Objects in Context)
- **Classes d'objets :** 80 catégories (person, car, chair, dog, etc.)
- **Sortie :** [x, y, width, height, class, score]
- **Métrique d'évaluation :** Intersection over Union (IoU)
- **Formule IoU :** IoU = Intersection / Union des rectangles
- **Seuil de succès :** IoU > 0.5 pour validation

## Concepts pédagogiques clés

### Intersection over Union (IoU)
- Métrique standard pour évaluer la précision des bounding boxes
- Calcul : IoU = Intersection / Union
- Utilisé dans les compétitions d'IA (COCO, PASCAL VOC)

### Analyse de formes
- **Rondeur :** Basée sur la variance des distances du centroïde
- **Symétrie :** Comparaison de pixels miroir horizontal/vertical
- **Coins :** Détection de changements significatifs de direction
- **Fermeture :** Vérification de la continuité du contour

## Métriques d'apprentissage
- Compréhension des métriques d'évaluation en IA
- Notions de géométrie algorithmique
- Introduction aux techniques de classification par règles
- Sensibilité aux défis du traitement d'images