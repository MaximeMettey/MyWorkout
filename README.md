# MyWorkout 💪

Application mobile cross-platform de gestion d'entraînements en salle de sport, nutrition et suivi de performances.

## 🎯 Fonctionnalités

### 🏋️ Entraînements
- **Liste exhaustive d'exercices** : Plus de 80 exercices pré-configurés couvrant tous les groupes musculaires
- **Planification de séances** : Création de programmes d'entraînement personnalisés
- **Mode live** : Suivi en temps réel de votre séance avec chronomètre et temps de repos
- **Surcharge progressive** : Visualisation des performances passées pour gérer la progression
- **Techniques avancées** : Support pour biset, triset, dropset
- **Calcul 1RM** : Estimation automatique de votre one-rep max théorique
- **Historique complet** : Consultation de tous vos entraînements passés

### 📊 Statistiques
- Graphiques d'évolution (poids, volume, performances)
- Suivi de la progression par exercice
- Statistiques globales (fréquence, durée, volume)
- Records personnels

### 🍎 Nutrition
- **Suivi des calories** : Enregistrement des repas quotidiens
- **Macros détaillées** : Suivi des protéines, glucides et lipides
- **Calculateur de besoins** : Estimation des besoins caloriques selon objectif
- **Objectifs personnalisés** : Définition de cibles nutritionnelles
- **Progression visuelle** : Barres de progression pour chaque macro

### 📐 Mensurations et Profil
- Suivi du poids corporel
- Calcul automatique de l'IMC
- Enregistrement des mensurations (tour de poitrine, taille, bras, etc.)
- Estimation du taux de masse grasse
- Gestion du profil utilisateur

### 🔐 Authentification
- Connexion via email/mot de passe
- Connexion via Google
- Sauvegarde sécurisée des données

## 🛠️ Stack Technique

- **Framework** : React Native avec Expo
- **Langage** : TypeScript
- **Base de données** : SQLite (expo-sqlite) - stockage local offline-first
- **UI** : React Native Paper (Material Design)
- **Navigation** : React Navigation v6
- **Graphiques** : React Native Chart Kit
- **État global** : React Context API
- **Dates** : date-fns

## 📱 Installation

### Prérequis
- Node.js (v16 ou supérieur)
- npm ou yarn
- Expo CLI
- Application Expo Go sur votre mobile (pour le développement)

### Étapes

1. **Cloner le repository**
```bash
git clone <repository-url>
cd MyWorkout
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Lancer l'application**
```bash
npm start
```

4. **Scanner le QR code**
   - Ouvrez l'application Expo Go sur votre téléphone
   - Scannez le QR code affiché dans le terminal
   - L'application se lancera sur votre mobile

## 🚀 Scripts disponibles

```bash
npm start        # Démarre le serveur de développement
npm run android  # Lance sur émulateur/appareil Android
npm run ios      # Lance sur émulateur/appareil iOS
npm run web      # Lance la version web
```

## 📁 Structure du projet

```
MyWorkout/
├── src/
│   ├── screens/          # Écrans de l'application
│   │   ├── HomeScreen.tsx
│   │   ├── ExercisesScreen.tsx
│   │   ├── NutritionScreen.tsx
│   │   ├── StatisticsScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── components/       # Composants réutilisables
│   ├── navigation/       # Configuration de la navigation
│   │   ├── AppNavigator.tsx
│   │   └── types.ts
│   ├── services/         # Services (base de données, API)
│   │   └── database.ts
│   ├── models/          # Types TypeScript
│   │   └── index.ts
│   ├── utils/           # Fonctions utilitaires
│   │   └── calculations.ts
│   ├── data/            # Données statiques
│   │   └── exercises.ts
│   ├── hooks/           # Custom React hooks
│   └── contexts/        # React contexts
│       ├── AuthContext.tsx
│       └── WorkoutContext.tsx
├── assets/              # Images, fonts
├── App.tsx             # Point d'entrée
├── app.json            # Configuration Expo
├── package.json
└── tsconfig.json
```

## 🎨 Fonctionnalités détaillées

### Calculs implémentés

#### 1RM (One Rep Max)
- Formule d'Epley : `1RM = weight × (1 + reps/30)`
- Formule de Brzycki : `1RM = weight × (36 / (37 - reps))`
- Formule de Lombardi : `1RM = weight × reps^0.1`
- Moyenne des 3 formules pour plus de précision

#### IMC (Indice de Masse Corporelle)
- `IMC = poids (kg) / taille (m)²`
- Interprétation automatique

#### Métabolisme de base (BMR)
- Formule de Mifflin-St Jeor
- Hommes : `BMR = 10 × poids + 6.25 × taille - 5 × âge + 5`
- Femmes : `BMR = 10 × poids + 6.25 × taille - 5 × âge - 161`

#### TDEE (Total Daily Energy Expenditure)
- Basé sur le BMR et le niveau d'activité
- Multiplicateurs selon l'activité (1.2 à 1.9)

#### Macronutriments
- Répartition optimale selon l'objectif
- Perte de poids : 35% protéines, 40% glucides, 25% lipides
- Prise de muscle : 30% protéines, 45% glucides, 25% lipides
- Prise de poids : 25% protéines, 45% glucides, 30% lipides

## 🔄 Prochaines étapes

- [ ] Intégration Firebase pour l'authentification
- [ ] Synchronisation cloud des données
- [ ] Mode hors ligne complet
- [ ] Partage de programmes entre utilisateurs
- [ ] Photos de progression
- [ ] Rappels et notifications
- [ ] Widget pour l'écran d'accueil
- [ ] Support Apple Watch / Wear OS
- [ ] Thème sombre

## 📝 License

MIT

## 👥 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

---

Développé avec ❤️ et TypeScript
