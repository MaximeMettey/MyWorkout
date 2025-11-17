# Guide de développement - MyWorkout

## 🚀 Démarrage rapide

### Installation initiale
```bash
npm install
```

### Lancer l'application
```bash
npm start
```

Scannez le QR code avec l'application Expo Go sur votre mobile.

## 📖 Documentation technique

### Architecture

L'application suit une architecture modulaire avec séparation des responsabilités :

- **Screens** : Composants de page complète
- **Components** : Composants réutilisables
- **Services** : Logique métier et accès aux données
- **Contexts** : Gestion d'état global avec React Context
- **Utils** : Fonctions utilitaires pures
- **Models** : Définitions TypeScript des types de données

### Base de données

L'application utilise SQLite via `expo-sqlite` pour un stockage local offline-first.

#### Tables principales :
- `user_profile` : Profil utilisateur
- `workouts` : Séances d'entraînement
- `workout_exercises` : Exercices d'une séance
- `workout_sets` : Sets d'un exercice
- `body_measurements` : Mensurations corporelles
- `nutrition_entries` : Entrées nutritionnelles
- `daily_nutrition_goals` : Objectifs nutritionnels

### État global

Deux contextes principaux :
- **AuthContext** : Authentification et profil utilisateur
- **WorkoutContext** : Gestion de la séance en cours

### Bibliothèque d'exercices

Plus de 80 exercices pré-configurés dans `src/data/exercises.ts`, organisés par :
- Groupe musculaire
- Type d'équipement
- Niveau de difficulté

## 🛠️ Développement

### Ajouter un nouvel exercice

Éditez `src/data/exercises.ts` :

```typescript
{
  id: 'unique-id',
  name: 'Nom de l\'exercice',
  nameEn: 'English name',
  description: 'Description détaillée',
  muscleGroup: ['chest', 'triceps'],
  equipment: 'barbell',
  difficulty: 'intermediate',
}
```

### Ajouter un nouvel écran

1. Créez le fichier dans `src/screens/`
2. Ajoutez le type de navigation dans `src/navigation/types.ts`
3. Ajoutez la route dans le navigateur approprié
4. Importez et utilisez les hooks/contextes nécessaires

### Utiliser les calculs

Importez depuis `src/utils/calculations.ts` :

```typescript
import {
  calculate1RMAverage,
  calculateBMI,
  calculateDailyCalories,
  calculateMacros,
} from '@/utils/calculations';
```

## 🎨 UI/UX

L'application utilise **React Native Paper** avec Material Design 3.

### Thème

Le thème est défini dans `App.tsx`. Pour personnaliser :

```typescript
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6200EE', // Couleur principale
    // ...
  },
};
```

### Composants principaux

- `Card` : Conteneur de contenu
- `List.Item` : Élément de liste
- `Button` : Bouton d'action
- `FAB` : Floating Action Button
- `ProgressBar` : Barre de progression
- `Searchbar` : Barre de recherche
- `Chip` : Filtre/tag

## 🧪 Tests

À implémenter :
- Tests unitaires avec Jest
- Tests de composants avec React Native Testing Library
- Tests E2E avec Detox

## 📱 Build et déploiement

### Build Android (APK)
```bash
eas build --platform android
```

### Build iOS (IPA)
```bash
eas build --platform ios
```

### Configuration EAS
Créez un fichier `eas.json` :

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {}
  }
}
```

## 🔐 Sécurité

- Les mots de passe doivent être hashés avant stockage
- Les tokens d'authentification doivent être stockés de manière sécurisée
- Validation des entrées utilisateur
- Protection contre les injections SQL (utilisation de requêtes préparées)

## 📊 Performance

- Utilisation de `React.memo` pour éviter les re-renders inutiles
- Lazy loading des images
- Pagination des listes longues
- Optimisation des requêtes base de données avec indexes

## 🐛 Debugging

### Logs
```typescript
console.log('Message de debug');
console.error('Erreur');
```

### React DevTools
Installez React DevTools pour Chrome/Firefox

### Expo DevTools
Accessible via `npm start` puis `d` dans le terminal

## 📝 Conventions de code

- **Naming** : camelCase pour variables/fonctions, PascalCase pour composants
- **Fichiers** : PascalCase pour composants, camelCase pour utilitaires
- **Imports** : Triés par ordre (React, libraries, local)
- **TypeScript** : Typage strict, pas de `any`

## 🔄 Git workflow

1. Créer une branche feature : `git checkout -b feature/nom-feature`
2. Commit réguliers avec messages clairs
3. Push et créer une PR
4. Review et merge

## 📚 Ressources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [React Navigation](https://reactnavigation.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🆘 Support

En cas de problème :
1. Vérifier les logs
2. Nettoyer le cache : `expo start -c`
3. Réinstaller les dépendances : `rm -rf node_modules && npm install`
4. Consulter la documentation Expo
