# Modèles TensorFlow.js utilisés dans AI Learning Lab

## Vue d'ensemble

AI Learning Lab utilise 4 modèles TensorFlow.js spécialisés pour différentes tâches d'intelligence artificielle. Ces modèles sont optimisés pour fonctionner directement dans le navigateur web sans nécessiter de serveur backend.

## 1. MobileNet v2.1.1 - Classification d'images

### Description technique
- **Type :** Réseau neuronal convolutif (CNN)
- **Architecture :** MobileNetV2 avec depthwise separable convolutions
- **Taille :** ~17MB (version optimisée pour le web)
- **Précision :** Top-1 accuracy ~70% sur ImageNet
- **Latence :** 50-100ms par inférence

### Utilisation dans l'application
- **Niveau :** 1 - "Qu'est-ce que l'IA voit ?"
- **Fonction :** Classification d'objets en temps réel
- **Entrée :** Image webcam (640x480 pixels)
- **Sortie :** Liste de prédictions avec probabilités

### Fonctionnement
```javascript
// Chargement du modèle
const model = await mobilenet.load();

// Classification
const predictions = await model.classify(videoElement);
// Retourne: [{className: "cat", probability: 0.87}, ...]
```

### Avantages
- ✅ Léger et rapide
- ✅ Pas besoin de serveur
- ✅ Fonctionne offline
- ✅ 1000 classes d'objets

## 2. PoseNet v2.2.2 - Détection de poses corporelles

### Description technique
- **Type :** Réseau neuronal pour estimation de poses
- **Points clés :** 17 points anatomiques
- **Précision :** ~75% sur poses communes
- **Performance :** 10-30 FPS
- **Taille :** ~8MB

### Points anatomiques détectés
1. Nez (nose)
2. Œil gauche (leftEye)
3. Œil droit (rightEye)
4. Oreille gauche (leftEar)
5. Oreille droite (rightEar)
6. Épaule gauche (leftShoulder)
7. Épaule droite (rightShoulder)
8. Coude gauche (leftElbow)
9. Coude droit (rightElbow)
10. Poignet gauche (leftWrist)
11. Poignet droit (rightWrist)
12. Hanche gauche (leftHip)
13. Hanche droite (rightHip)
14. Genou gauche (leftKnee)
15. Genou droit (rightKnee)
16. Cheville gauche (leftAnkle)
17. Cheville droite (rightAnkle)

### Utilisation dans l'application
- **Niveau :** 1 - "Miroir Magique"
- **Fonction :** Détection du toucher de nez
- **Calcul :** Distance euclidienne entre nez et poignets

### Formule mathématique
```
Distance = √((x_nose - x_wrist)² + (y_nose - y_wrist)²)
Seuil = 60 pixels (ajustable)
```

## 3. COCO-SSD v2.2.3 - Détection d'objets

### Description technique
- **Type :** Single Shot MultiBox Detector (SSD)
- **Base :** Architecture MobileNetV2 + SSD
- **Dataset :** COCO (Common Objects in Context)
- **Classes :** 80 catégories d'objets
- **Performance :** 20-40 FPS sur navigateurs modernes

### Classes d'objets détectées
**Personnes :** person
**Véhicules :** car, truck, bus, motorcycle, bicycle
**Animaux :** dog, cat, horse, cow, bird, sheep
**Mobilier :** chair, couch, bed, dining table
**Électronique :** tv, laptop, mouse, keyboard, cell phone
**Ustensiles :** bottle, cup, fork, knife, spoon
**Et plus :** 80 classes au total

### Utilisation dans l'application
- **Niveau 1 :** "Détecteur d'Objets" - Affichage des bounding boxes
- **Niveau 2 :** "Jeu des Boîtes" - Évaluation IoU des boîtes utilisateur

### Sortie du modèle
```javascript
[
  {
    bbox: [x, y, width, height],  // Coordonnées du rectangle
    class: "person",               // Nom de la classe
    score: 0.87                    // Confiance (0-1)
  }
]
```

### Métrique IoU (Intersection over Union)
```
IoU = Aire(Intersection) / Aire(Union)
Seuil de succès = 0.5 (50% de chevauchement)
```

## 4. Pose Detection v2.1.3 - Détection avancée de poses

### Description technique
- **Type :** API unifiée pour détection de poses
- **Frameworks :** BlazePose, MoveNet, PoseNet
- **Précision :** Supérieure à PoseNet classique
- **Robustesse :** Meilleure gestion des variations d'éclairage/angle

### Utilisation dans l'application
- **Statut :** Inclus dans les dépendances
- **Usage :** Support pour futures améliorations
- **Avantages :** Plus précis et stable que PoseNet v2.2.2

## Architecture technique commune

### Backend TensorFlow.js
- **Moteur :** WebGL (accélération GPU)
- **Fallback :** WebAssembly (CPU)
- **Chargement :** Modèles pré-entraînés depuis CDN
- **Cache :** Stockage local automatique

### Optimisations
- **Quantization :** Réduction de précision pour taille
- **Pruning :** Suppression de connexions inutiles
- **Compression :** Formats optimisés pour le web

### Limitations
- **Mémoire :** Contrainte des navigateurs (~2-4GB)
- **CPU/GPU :** Dépend de l'appareil utilisateur
- **Précision :** Inférieure aux modèles serveur
- **Latence :** Variable selon la puissance

## Intégration dans l'application

### Chargement des modèles
```javascript
// Chargement asynchrone
await tf.ready();  // Initialisation TensorFlow.js
const model = await cocoSsd.load();  // Chargement du modèle
```

### Pipeline de traitement
1. **Capture :** Webcam → Canvas
2. **Prétraitement :** Redimensionnement, normalisation
3. **Inférence :** Passage dans le modèle
4. **Post-traitement :** Interprétation des résultats
5. **Affichage :** Rendu visuel des prédictions

### Gestion des performances
- **Limitation :** 3 objets max pour COCO-SSD (optimisation)
- **Fréquence :** 2 secondes entre analyses (réduction charge)
- **Fallback :** Messages d'erreur si modèle non chargé

## Comparaison des modèles

| Modèle | Tâche | Précision | Vitesse | Taille |
|--------|-------|-----------|---------|-------|
| MobileNet | Classification | ~70% | Très rapide | ~17MB |
| PoseNet | Poses | ~75% | Rapide | ~8MB |
| COCO-SSD | Objets | ~60-80% | Moyen | ~25MB |
| Pose Detection | Poses avancées | ~80% | Moyen | ~15MB |

## Sources et références

- **TensorFlow.js :** https://www.tensorflow.org/js
- **MobileNet :** Howard et al. (2017)
- **PoseNet :** Papandreou et al. (2018)
- **COCO-SSD :** Liu et al. (2016)
- **COCO Dataset :** Lin et al. (2014)