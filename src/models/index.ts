// Types principaux de l'application MyWorkout

export type MuscleGroup =
  | 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps'
  | 'legs' | 'quadriceps' | 'hamstrings' | 'calves' | 'glutes'
  | 'abs' | 'forearms' | 'trapezius' | 'lats';

export type EquipmentType =
  | 'barbell' | 'dumbbell' | 'machine' | 'cable'
  | 'bodyweight' | 'kettlebell' | 'resistance-band' | 'other';

export type ExerciseDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Exercise {
  id: string;
  name: string;
  nameEn?: string;
  description: string;
  muscleGroup: MuscleGroup[];
  equipment: EquipmentType;
  difficulty: ExerciseDifficulty;
  instructions?: string[];
  videoUrl?: string;
  imageUrl?: string;
}

export interface WorkoutSet {
  id: string;
  exerciseId: string;
  setNumber: number;
  reps: number;
  weight: number; // en kg
  restTime?: number; // en secondes
  completed: boolean;
  notes?: string;
  rpe?: number; // Rate of Perceived Exertion (1-10)
}

export type SetType = 'normal' | 'warmup' | 'dropset' | 'superset' | 'triset';

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  exercise?: Exercise;
  sets: WorkoutSet[];
  setType: SetType;
  supersetGroup?: number; // pour grouper les exercices en biset/triset
  order: number;
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  date: string; // ISO date string
  duration?: number; // en minutes
  exercises: WorkoutExercise[];
  completed: boolean;
  notes?: string;
  templateId?: string; // si créé depuis un template
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  description?: string;
  exercises: Omit<WorkoutExercise, 'id'>[];
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other';
  height?: number; // en cm
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'very-active' | 'extra-active';
  goal?: 'lose-weight' | 'maintain' | 'gain-muscle' | 'gain-weight';
  createdAt: string;
  updatedAt: string;
}

export interface BodyMeasurement {
  id: string;
  userId: string;
  date: string;
  weight?: number; // en kg
  bodyFat?: number; // en %
  muscleMass?: number; // en kg
  neck?: number; // en cm
  chest?: number;
  waist?: number;
  hips?: number;
  biceps?: number;
  thighs?: number;
  calves?: number;
  notes?: string;
}

export interface NutritionEntry {
  id: string;
  userId: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  description: string;
  calories: number;
  protein: number; // en g
  carbs: number; // en g
  fat: number; // en g
  time?: string;
}

export interface DailyNutritionGoal {
  userId: string;
  date: string;
  caloriesGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
}

export interface PerformanceRecord {
  exerciseId: string;
  exercise?: Exercise;
  date: string;
  maxWeight: number;
  maxReps: number;
  estimated1RM: number;
  volume: number; // poids total (sets x reps x weight)
}

export interface WorkoutStatistics {
  totalWorkouts: number;
  totalDuration: number;
  totalVolume: number;
  averageWorkoutsPerWeek: number;
  currentStreak: number;
  longestStreak: number;
  favoriteExercises: { exerciseId: string; count: number }[];
}
