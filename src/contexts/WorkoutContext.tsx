import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Workout, WorkoutExercise, WorkoutSet } from '../models';

interface WorkoutContextType {
  currentWorkout: Workout | null;
  isWorkoutInProgress: boolean;
  startWorkout: (name: string) => void;
  endWorkout: () => void;
  addExercise: (exercise: WorkoutExercise) => void;
  updateExercise: (exerciseId: string, updates: Partial<WorkoutExercise>) => void;
  removeExercise: (exerciseId: string) => void;
  addSet: (exerciseId: string, set: WorkoutSet) => void;
  updateSet: (exerciseId: string, setId: string, updates: Partial<WorkoutSet>) => void;
  completeSet: (exerciseId: string, setId: string) => void;
  saveWorkout: () => Promise<void>;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);

  const startWorkout = (name: string) => {
    const newWorkout: Workout = {
      id: 'workout-' + Date.now(),
      name,
      date: new Date().toISOString(),
      exercises: [],
      completed: false,
    };
    setCurrentWorkout(newWorkout);
    setStartTime(new Date());
  };

  const endWorkout = () => {
    if (currentWorkout && startTime) {
      const duration = Math.round((new Date().getTime() - startTime.getTime()) / 60000); // en minutes
      setCurrentWorkout({
        ...currentWorkout,
        duration,
        completed: true,
      });
    }
  };

  const addExercise = (exercise: WorkoutExercise) => {
    if (!currentWorkout) return;

    setCurrentWorkout({
      ...currentWorkout,
      exercises: [...currentWorkout.exercises, exercise],
    });
  };

  const updateExercise = (exerciseId: string, updates: Partial<WorkoutExercise>) => {
    if (!currentWorkout) return;

    setCurrentWorkout({
      ...currentWorkout,
      exercises: currentWorkout.exercises.map((ex) =>
        ex.id === exerciseId ? { ...ex, ...updates } : ex
      ),
    });
  };

  const removeExercise = (exerciseId: string) => {
    if (!currentWorkout) return;

    setCurrentWorkout({
      ...currentWorkout,
      exercises: currentWorkout.exercises.filter((ex) => ex.id !== exerciseId),
    });
  };

  const addSet = (exerciseId: string, set: WorkoutSet) => {
    if (!currentWorkout) return;

    setCurrentWorkout({
      ...currentWorkout,
      exercises: currentWorkout.exercises.map((ex) =>
        ex.id === exerciseId
          ? { ...ex, sets: [...ex.sets, set] }
          : ex
      ),
    });
  };

  const updateSet = (exerciseId: string, setId: string, updates: Partial<WorkoutSet>) => {
    if (!currentWorkout) return;

    setCurrentWorkout({
      ...currentWorkout,
      exercises: currentWorkout.exercises.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.map((s) => (s.id === setId ? { ...s, ...updates } : s)),
            }
          : ex
      ),
    });
  };

  const completeSet = (exerciseId: string, setId: string) => {
    updateSet(exerciseId, setId, { completed: true });
  };

  const saveWorkout = async () => {
    if (!currentWorkout) return;

    try {
      // TODO: Sauvegarder dans la base de données
      console.log('Saving workout:', currentWorkout);
      setCurrentWorkout(null);
      setStartTime(null);
    } catch (error) {
      console.error('Error saving workout:', error);
      throw error;
    }
  };

  return (
    <WorkoutContext.Provider
      value={{
        currentWorkout,
        isWorkoutInProgress: !!currentWorkout,
        startWorkout,
        endWorkout,
        addExercise,
        updateExercise,
        removeExercise,
        addSet,
        updateSet,
        completeSet,
        saveWorkout,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};
