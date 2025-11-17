/**
 * Utilitaires de calcul pour MyWorkout
 */

import { UserProfile } from '../models';

// ==================== CALCULS 1RM (One Rep Max) ====================

/**
 * Calcule le 1RM théorique avec la formule d'Epley
 * 1RM = weight × (1 + reps/30)
 */
export function calculate1RMEpley(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}

/**
 * Calcule le 1RM théorique avec la formule de Brzycki
 * 1RM = weight × (36 / (37 - reps))
 */
export function calculate1RMBrzycki(weight: number, reps: number): number {
  if (reps === 1) return weight;
  if (reps >= 37) return weight; // Formule non applicable
  return Math.round((weight * 36) / (37 - reps) * 10) / 10;
}

/**
 * Calcule le 1RM théorique avec la formule de Lombardi
 * 1RM = weight × reps^0.1
 */
export function calculate1RMLombardi(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return Math.round(weight * Math.pow(reps, 0.1) * 10) / 10;
}

/**
 * Calcule le 1RM moyen en utilisant les 3 formules principales
 */
export function calculate1RMAverage(weight: number, reps: number): number {
  const epley = calculate1RMEpley(weight, reps);
  const brzycki = calculate1RMBrzycki(weight, reps);
  const lombardi = calculate1RMLombardi(weight, reps);
  return Math.round(((epley + brzycki + lombardi) / 3) * 10) / 10;
}

/**
 * Calcule le poids recommandé pour un nombre de répétitions donné
 * basé sur un 1RM connu
 */
export function calculateWeightForReps(oneRM: number, targetReps: number): number {
  // Utilisation du tableau de correspondance % 1RM
  const percentages: { [key: number]: number } = {
    1: 100,
    2: 95,
    3: 93,
    4: 90,
    5: 87,
    6: 85,
    7: 83,
    8: 80,
    9: 77,
    10: 75,
    11: 73,
    12: 70,
    15: 65,
    20: 60,
  };

  let percentage = percentages[targetReps];
  if (!percentage) {
    // Interpolation linéaire pour les valeurs non définies
    if (targetReps > 20) percentage = 60;
    else percentage = 100 - targetReps * 2;
  }

  return Math.round((oneRM * percentage) / 100 * 2.5) / 2.5; // Arrondi à 2.5kg
}

// ==================== CALCULS IMC ET COMPOSITION CORPORELLE ====================

/**
 * Calcule l'IMC (Indice de Masse Corporelle)
 * IMC = poids (kg) / taille (m)²
 */
export function calculateBMI(weight: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return Math.round((weight / (heightM * heightM)) * 10) / 10;
}

/**
 * Interprète la valeur de l'IMC
 */
export function interpretBMI(bmi: number): string {
  if (bmi < 18.5) return 'Sous-poids';
  if (bmi < 25) return 'Poids normal';
  if (bmi < 30) return 'Surpoids';
  if (bmi < 35) return 'Obésité modérée';
  if (bmi < 40) return 'Obésité sévère';
  return 'Obésité morbide';
}

/**
 * Calcule le taux de masse grasse avec la méthode de la Marine US
 * Pour les hommes
 */
export function calculateBodyFatMale(
  waistCm: number,
  neckCm: number,
  heightCm: number
): number {
  const bodyFat =
    495 /
      (1.0324 -
        0.19077 * Math.log10(waistCm - neckCm) +
        0.15456 * Math.log10(heightCm)) -
    450;
  return Math.round(bodyFat * 10) / 10;
}

/**
 * Calcule le taux de masse grasse avec la méthode de la Marine US
 * Pour les femmes
 */
export function calculateBodyFatFemale(
  waistCm: number,
  hipsCm: number,
  neckCm: number,
  heightCm: number
): number {
  const bodyFat =
    495 /
      (1.29579 -
        0.35004 * Math.log10(waistCm + hipsCm - neckCm) +
        0.221 * Math.log10(heightCm)) -
    450;
  return Math.round(bodyFat * 10) / 10;
}

// ==================== CALCULS NUTRITION ====================

/**
 * Calcule le métabolisme de base (BMR) avec la formule de Mifflin-St Jeor
 * Hommes: BMR = 10 × poids(kg) + 6.25 × taille(cm) - 5 × âge(années) + 5
 * Femmes: BMR = 10 × poids(kg) + 6.25 × taille(cm) - 5 × âge(années) - 161
 */
export function calculateBMR(
  weight: number,
  heightCm: number,
  age: number,
  gender: 'male' | 'female'
): number {
  const baseBMR = 10 * weight + 6.25 * heightCm - 5 * age;
  return Math.round(gender === 'male' ? baseBMR + 5 : baseBMR - 161);
}

/**
 * Calcule le TDEE (Total Daily Energy Expenditure)
 * basé sur le BMR et le niveau d'activité
 */
export function calculateTDEE(
  bmr: number,
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very-active' | 'extra-active'
): number {
  const multipliers = {
    sedentary: 1.2, // Peu ou pas d'exercice
    light: 1.375, // Exercice léger 1-3 jours/semaine
    moderate: 1.55, // Exercice modéré 3-5 jours/semaine
    'very-active': 1.725, // Exercice intense 6-7 jours/semaine
    'extra-active': 1.9, // Exercice très intense 2x par jour
  };

  return Math.round(bmr * multipliers[activityLevel]);
}

/**
 * Calcule les besoins caloriques journaliers selon l'objectif
 */
export function calculateDailyCalories(
  profile: UserProfile,
  currentWeight: number
): number {
  if (!profile.height || !profile.birthDate || !profile.activityLevel) {
    throw new Error('Profil incomplet pour le calcul des calories');
  }

  const age = calculateAge(profile.birthDate);
  const gender = profile.gender || 'male';

  const bmr = calculateBMR(currentWeight, profile.height, age, gender);
  const tdee = calculateTDEE(bmr, profile.activityLevel);

  // Ajustement selon l'objectif
  switch (profile.goal) {
    case 'lose-weight':
      return Math.round(tdee * 0.8); // Déficit de 20%
    case 'gain-muscle':
    case 'gain-weight':
      return Math.round(tdee * 1.1); // Surplus de 10%
    case 'maintain':
    default:
      return tdee;
  }
}

/**
 * Calcule la répartition des macronutriments en grammes
 */
export function calculateMacros(
  dailyCalories: number,
  weight: number,
  goal: 'lose-weight' | 'maintain' | 'gain-muscle' | 'gain-weight' = 'maintain'
): { protein: number; carbs: number; fat: number } {
  let proteinRatio: number;
  let fatRatio: number;

  switch (goal) {
    case 'lose-weight':
      proteinRatio = 0.35; // 35% protéines
      fatRatio = 0.25; // 25% lipides
      break;
    case 'gain-muscle':
      proteinRatio = 0.3; // 30% protéines
      fatRatio = 0.25; // 25% lipides
      break;
    case 'gain-weight':
      proteinRatio = 0.25; // 25% protéines
      fatRatio = 0.3; // 30% lipides
      break;
    case 'maintain':
    default:
      proteinRatio = 0.3; // 30% protéines
      fatRatio = 0.25; // 25% lipides
      break;
  }

  const carbsRatio = 1 - proteinRatio - fatRatio;

  return {
    protein: Math.round((dailyCalories * proteinRatio) / 4), // 4 cal/g
    carbs: Math.round((dailyCalories * carbsRatio) / 4), // 4 cal/g
    fat: Math.round((dailyCalories * fatRatio) / 9), // 9 cal/g
  };
}

/**
 * Calcule l'âge à partir de la date de naissance
 */
export function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

// ==================== CALCULS VOLUME ET PROGRESSION ====================

/**
 * Calcule le volume total d'un exercice (sets × reps × weight)
 */
export function calculateVolume(sets: number, reps: number, weight: number): number {
  return sets * reps * weight;
}

/**
 * Calcule le pourcentage de progression entre deux valeurs
 */
export function calculateProgress(oldValue: number, newValue: number): number {
  if (oldValue === 0) return 0;
  return Math.round(((newValue - oldValue) / oldValue) * 100 * 10) / 10;
}

/**
 * Suggère une progression de poids (surcharge progressive)
 * Augmentation de 2.5kg pour le haut du corps, 5kg pour le bas du corps
 */
export function suggestWeightProgression(
  currentWeight: number,
  muscleGroup: string
): number {
  const lowerBodyGroups = ['legs', 'quadriceps', 'hamstrings', 'glutes', 'calves'];
  const increment = lowerBodyGroups.includes(muscleGroup) ? 5 : 2.5;

  return Math.round((currentWeight + increment) * 10) / 10;
}

// ==================== CALCULS TEMPS DE REPOS ====================

/**
 * Recommande un temps de repos selon l'objectif et l'intensité
 */
export function recommendRestTime(
  goal: 'strength' | 'hypertrophy' | 'endurance',
  intensity: 'low' | 'medium' | 'high'
): number {
  // Temps en secondes
  const restTimes = {
    strength: { low: 180, medium: 240, high: 300 }, // 3-5 min
    hypertrophy: { low: 60, medium: 90, high: 120 }, // 1-2 min
    endurance: { low: 30, medium: 45, high: 60 }, // 30-60 sec
  };

  return restTimes[goal][intensity];
}
