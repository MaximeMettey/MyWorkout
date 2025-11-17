import { NavigatorScreenParams } from '@react-navigation/native';

// Types pour la navigation principale
export type RootStackParamList = {
  Auth: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
};

// Types pour les onglets principaux
export type MainTabParamList = {
  Home: undefined;
  Exercises: undefined;
  Nutrition: undefined;
  Statistics: undefined;
  Profile: undefined;
};

// Types pour la navigation des écrans Home
export type HomeStackParamList = {
  HomeScreen: undefined;
  StartWorkout: undefined;
  ActiveWorkout: { workoutId: string };
  WorkoutHistory: undefined;
  WorkoutDetail: { workoutId: string };
  CreateTemplate: undefined;
  TemplateDetail: { templateId: string };
};

// Types pour la navigation des exercices
export type ExercisesStackParamList = {
  ExercisesList: undefined;
  ExerciseDetail: { exerciseId: string };
  AddExercise: undefined;
};

// Types pour la navigation nutrition
export type NutritionStackParamList = {
  NutritionDashboard: undefined;
  AddMeal: undefined;
  MealDetail: { mealId: string };
  CaloriesCalculator: undefined;
};

// Types pour les statistiques
export type StatisticsStackParamList = {
  StatisticsDashboard: undefined;
  ExerciseProgress: { exerciseId: string };
  BodyMeasurements: undefined;
  WorkoutStats: undefined;
};

// Types pour le profil
export type ProfileStackParamList = {
  ProfileScreen: undefined;
  EditProfile: undefined;
  Settings: undefined;
  BodyMeasurementEntry: undefined;
};
