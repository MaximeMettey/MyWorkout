# Changelog - MyWorkout

## [Version 2.0] - 2025-11-19

### ✨ Nouveaux écrans interactifs

#### 🏋️ Écran de séance active (ActiveWorkoutScreen)
- **Chronomètre automatique** : Démarre automatiquement au lancement de la séance
- **Statistiques en temps réel** :
  - Durée de la séance
  - Nombre d'exercices
  - Total de séries
  - Volume total (kg)
  - Barre de progression des séries complétées
- **Gestion des séries** :
  - Ajout dynamique de séries
  - Edition de répétitions et poids
  - Marquage série comme complétée
  - Notes par série
- **Timer de repos** : Compte à rebours automatique entre les séries
- **Sauvegarde de séance** : Dialog de confirmation avec résumé

#### 📚 Écran de détail d'exercice (ExerciseDetailScreen)
- **Informations complètes** :
  - Description détaillée
  - Groupes musculaires ciblés
  - Équipement nécessaire
  - Niveau de difficulté
- **Statistiques personnelles** :
  - Dernier poids utilisé
  - 1RM estimé (meilleur)
  - Volume maximum
  - Nombre de séances
- **Graphique de progression** : Évolution du poids dans le temps
- **Historique récent** : Liste des 10 dernières performances
- **Recommandations** : Temps de repos, répétitions, fréquence

#### 🎯 Écran de sélection d'exercices (ExerciseSelectionScreen)
- **Sélection multiple** : Checkbox pour chaque exercice
- **Filtres avancés** :
  - Par groupe musculaire
  - Par type d'équipement
  - Recherche textuelle
- **Badge de sélection** : Indicateur visuel "✓ Sélectionné"
- **Compteur dynamique** : Affichage du nombre d'exercices sélectionnés
- **Ajout en masse** : Ajoute tous les exercices sélectionnés à la séance

#### 🧮 Calculateur de calories (CaloriesCalculatorScreen)
- **Informations personnelles** :
  - Poids, taille, âge, sexe
  - Niveau d'activité (5 niveaux)
  - Objectif (perdre, maintenir, prendre du muscle/poids)
- **Calculs automatiques** :
  - **IMC** avec interprétation
  - **BMR** (métabolisme de base) - Formule Mifflin-St Jeor
  - **TDEE** (dépense énergétique totale)
  - **Objectif calorique** ajusté selon le but
- **Répartition macros** :
  - Protéines (g et kcal)
  - Glucides (g et kcal)
  - Lipides (g et kcal)
  - Optimisé selon l'objectif
- **Sauvegarde** : Enregistrement des objectifs dans le profil

#### 🍽️ Écran d'ajout de repas (AddMealScreen)
- **Types de repas** : Petit-déj, Déjeuner, Dîner, Collation (avec emojis)
- **Saisie nutritionnelle** :
  - Calories totales
  - Protéines, glucides, lipides (en grammes)
- **Calculateur automatique** : Calcule les calories depuis les macros
- **Exemples pré-remplis** : 4 repas types avec valeurs nutritionnelles
- **Validation** : Vérification des champs obligatoires

#### 📏 Écran de mensurations (BodyMeasurementScreen)
- **Poids et composition** :
  - Poids avec calcul IMC automatique
  - Taux de masse grasse
  - Masse musculaire
- **Mensurations détaillées** :
  - Cou, poitrine, taille, hanches
  - Bras (biceps), cuisses, mollets
  - Toutes les mesures sont optionnelles
- **Calculateur de masse grasse** : Méthode US Navy
- **Notes libres** : Contexte de la mesure
- **Conseils** : Guide pour prendre les mesures correctement

### 🎨 Nouveaux composants réutilisables

#### ExerciseCard
- Carte d'exercice avec toutes les informations
- Badge de difficulté coloré
- Icône selon le type d'équipement
- Support nom français/anglais
- Click pour naviguer vers les détails

#### Timer
- Compte à rebours personnalisable
- Affichage en cercle avec état visuel
- Changement de couleur à 10 secondes
- Boutons Play/Pause et Reset
- Callback à la fin du timer

#### SetCard
- Carte de série complètement éditable
- Affichage des performances précédentes
- Checkbox pour marquer comme complétée
- Inputs pour reps et poids
- Affichage du temps de repos
- Support RPE et notes

#### ProgressChart
- Graphique de ligne avec React Native Chart Kit
- Courbe lissée (Bezier)
- Labels et unités personnalisables
- Couleurs thématiques

### ⚙️ Custom Hooks

#### useTimer
- Gestion complète d'un chronomètre
- Start/Pause/Reset
- Formatage automatique du temps
- Compte ascendant en secondes

#### useWorkoutStats
- Calculs en temps réel :
  - Total de séries
  - Total de répétitions
  - Volume total
  - Séries complétées
  - Taux de complétion
  - Nombre d'exercices

#### usePreviousPerformance
- Récupération des performances précédentes
- Par exercice
- Avec gestion du loading

### 🧭 Navigation enrichie

#### Stack Navigators
- **HomeStackNavigator** : Entraînements, Séance active, Sélection exercices, Détails
- **ExercisesStackNavigator** : Liste exercices, Détails exercice
- **NutritionStackNavigator** : Dashboard nutrition, Ajout repas, Calculateur
- **ProfileStackNavigator** : Profil, Mensurations

#### Intégrations
- Tous les boutons connectés à la navigation
- Passage de paramètres entre écrans
- Navigation cohérente et fluide
- Headers personnalisés par écran

### 📊 Nouvelles fonctionnalités

#### Gestion de séance
- Démarrage automatique du chrono
- Ajout d'exercices en cours de séance
- Ajout dynamique de séries
- Édition en temps réel
- Sauvegarde avec confirmation

#### Calculs avancés
- 3 formules de 1RM (Epley, Brzycki, Lombardi)
- Moyenne des formules
- BMR avec Mifflin-St Jeor
- TDEE avec 5 niveaux d'activité
- Macros optimisés par objectif
- Masse grasse méthode US Navy
- Volume d'entraînement

#### Expérience utilisateur
- Exemples de repas pré-remplis
- Validation des formulaires
- Snackbars de confirmation
- Dialogs de confirmation
- États de chargement
- Messages d'erreur clairs

### 📁 Structure du code

```
Nouveaux fichiers créés : 22
Lignes de code ajoutées : 2980
```

**Composants** :
- `src/components/ExerciseCard.tsx`
- `src/components/Timer.tsx`
- `src/components/SetCard.tsx`
- `src/components/ProgressChart.tsx`

**Hooks** :
- `src/hooks/useTimer.ts`
- `src/hooks/useWorkoutStats.ts`
- `src/hooks/usePreviousPerformance.ts`

**Écrans** :
- `src/screens/ActiveWorkoutScreen.tsx`
- `src/screens/ExerciseDetailScreen.tsx`
- `src/screens/ExerciseSelectionScreen.tsx`
- `src/screens/CaloriesCalculatorScreen.tsx`
- `src/screens/AddMealScreen.tsx`
- `src/screens/BodyMeasurementScreen.tsx`

**Navigation** :
- `src/navigation/HomeStackNavigator.tsx`
- `src/navigation/ExercisesStackNavigator.tsx`
- `src/navigation/NutritionStackNavigator.tsx`
- `src/navigation/ProfileStackNavigator.tsx`

---

## [Version 1.0] - 2025-11-19

### 🎯 Version initiale

#### Fonctionnalités de base
- Architecture React Native + Expo
- Navigation par onglets
- 5 écrans principaux
- 80+ exercices pré-configurés
- Base de données SQLite
- Contextes Auth et Workout
- Calculs utilitaires (1RM, IMC, calories, macros)

#### Écrans initiaux
- HomeScreen : Dashboard entraînements
- ExercisesScreen : Liste d'exercices avec filtres
- NutritionScreen : Dashboard nutrition
- StatisticsScreen : Graphiques et stats
- ProfileScreen : Profil utilisateur

#### Infrastructure
- TypeScript strict
- React Native Paper (Material Design 3)
- Expo SQLite pour stockage
- React Navigation v6
- Context API pour état global
- date-fns pour les dates
