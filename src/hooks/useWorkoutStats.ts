import { useMemo } from 'react';
import { Workout, WorkoutExercise } from '../models';
import { calculateVolume } from '../utils/calculations';

interface WorkoutStats {
  totalSets: number;
  totalReps: number;
  totalVolume: number;
  completedSets: number;
  completionRate: number;
  exerciseCount: number;
}

export const useWorkoutStats = (workout: Workout | null): WorkoutStats => {
  return useMemo(() => {
    if (!workout) {
      return {
        totalSets: 0,
        totalReps: 0,
        totalVolume: 0,
        completedSets: 0,
        completionRate: 0,
        exerciseCount: 0,
      };
    }

    let totalSets = 0;
    let totalReps = 0;
    let totalVolume = 0;
    let completedSets = 0;

    workout.exercises.forEach((exercise: WorkoutExercise) => {
      exercise.sets.forEach((set) => {
        totalSets++;
        totalReps += set.reps;
        totalVolume += set.weight * set.reps;
        if (set.completed) {
          completedSets++;
        }
      });
    });

    return {
      totalSets,
      totalReps,
      totalVolume,
      completedSets,
      completionRate: totalSets > 0 ? (completedSets / totalSets) * 100 : 0,
      exerciseCount: workout.exercises.length,
    };
  }, [workout]);
};
