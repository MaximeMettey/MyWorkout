import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import {
  Appbar,
  Card,
  Title,
  Paragraph,
  Button,
  FAB,
  Dialog,
  Portal,
  Text,
  IconButton,
  useTheme,
  ProgressBar,
} from 'react-native-paper';
import { useWorkout } from '../contexts/WorkoutContext';
import { useTimer } from '../hooks/useTimer';
import { useWorkoutStats } from '../hooks/useWorkoutStats';
import { SetCard } from '../components/SetCard';
import { Timer } from '../components/Timer';
import { EXERCISES } from '../data/exercises';
import { WorkoutSet } from '../models';

export const ActiveWorkoutScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const { currentWorkout, updateSet, addSet, endWorkout, saveWorkout } = useWorkout();
  const { seconds, isRunning, start, pause, formatTime } = useTimer();
  const stats = useWorkoutStats(currentWorkout);

  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restDuration, setRestDuration] = useState(90);
  const [showFinishDialog, setShowFinishDialog] = useState(false);

  React.useEffect(() => {
    start(); // Démarrer le chronomètre automatiquement
  }, []);

  if (!currentWorkout) {
    return (
      <View style={styles.emptyContainer}>
        <Text>Aucune séance en cours</Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Retour
        </Button>
      </View>
    );
  }

  const handleSetUpdate = (exerciseId: string, setId: string, updates: Partial<WorkoutSet>) => {
    updateSet(exerciseId, setId, updates);

    // Si la série est complétée et qu'il y a un temps de repos, lancer le timer
    if (updates.completed && updates.restTime) {
      setRestDuration(updates.restTime);
      setShowRestTimer(true);
    }
  };

  const handleAddSet = (exerciseId: string) => {
    const exercise = currentWorkout.exercises.find((ex) => ex.id === exerciseId);
    if (!exercise) return;

    const lastSet = exercise.sets[exercise.sets.length - 1];
    const newSet: WorkoutSet = {
      id: `set-${Date.now()}`,
      exerciseId: exercise.exerciseId,
      setNumber: exercise.sets.length + 1,
      reps: lastSet?.reps || 10,
      weight: lastSet?.weight || 20,
      restTime: lastSet?.restTime || 90,
      completed: false,
    };

    addSet(exerciseId, newSet);
  };

  const handleFinishWorkout = () => {
    setShowFinishDialog(true);
  };

  const confirmFinishWorkout = async () => {
    endWorkout();
    await saveWorkout();
    setShowFinishDialog(false);
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={currentWorkout.name} />
        <Appbar.Action
          icon={isRunning ? 'pause' : 'play'}
          onPress={isRunning ? pause : start}
        />
      </Appbar.Header>

      {/* En-tête avec stats */}
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text variant="displaySmall" style={styles.statValue}>
                {formatTime(seconds)}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Durée
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text variant="displaySmall" style={styles.statValue}>
                {stats.exerciseCount}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Exercices
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text variant="displaySmall" style={styles.statValue}>
                {stats.totalSets}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Séries
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text variant="displaySmall" style={styles.statValue}>
                {Math.round(stats.totalVolume)}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Volume (kg)
              </Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <Text variant="bodySmall" style={styles.progressText}>
              Progression: {stats.completedSets}/{stats.totalSets} séries (
              {Math.round(stats.completionRate)}%)
            </Text>
            <ProgressBar
              progress={stats.completionRate / 100}
              color={theme.colors.primary}
              style={styles.progressBar}
            />
          </View>
        </Card.Content>
      </Card>

      {/* Liste des exercices */}
      <ScrollView style={styles.exercisesList}>
        {currentWorkout.exercises.map((workoutExercise, index) => {
          const exercise = EXERCISES.find((ex) => ex.id === workoutExercise.exerciseId);
          if (!exercise) return null;

          return (
            <Card key={workoutExercise.id} style={styles.exerciseCard}>
              <Card.Content>
                <View style={styles.exerciseHeader}>
                  <Title>{exercise.name}</Title>
                  <IconButton
                    icon="plus-circle"
                    size={24}
                    onPress={() => handleAddSet(workoutExercise.id)}
                  />
                </View>

                {workoutExercise.sets.map((set, setIndex) => (
                  <SetCard
                    key={set.id}
                    set={set}
                    setNumber={setIndex + 1}
                    onUpdate={(updates) =>
                      handleSetUpdate(workoutExercise.id, set.id, updates)
                    }
                    editable={true}
                  />
                ))}
              </Card.Content>
            </Card>
          );
        })}
      </ScrollView>

      {/* Timer de repos */}
      <Portal>
        <Dialog visible={showRestTimer} onDismiss={() => setShowRestTimer(false)}>
          <Dialog.Title>Temps de repos</Dialog.Title>
          <Dialog.Content>
            <Timer
              duration={restDuration}
              onComplete={() => setShowRestTimer(false)}
              autoStart={true}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowRestTimer(false)}>Fermer</Button>
          </Dialog.Actions>
        </Dialog>

        {/* Dialog de confirmation de fin */}
        <Dialog visible={showFinishDialog} onDismiss={() => setShowFinishDialog(false)}>
          <Dialog.Title>Terminer la séance ?</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Durée: {formatTime(seconds)}
            </Paragraph>
            <Paragraph>
              Séries complétées: {stats.completedSets}/{stats.totalSets}
            </Paragraph>
            <Paragraph>
              Volume total: {Math.round(stats.totalVolume)} kg
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowFinishDialog(false)}>Annuler</Button>
            <Button mode="contained" onPress={confirmFinishWorkout}>
              Terminer
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* FAB pour terminer la séance */}
      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="check"
        label="Terminer"
        onPress={handleFinishWorkout}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerCard: {
    margin: 16,
    elevation: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  statLabel: {
    opacity: 0.6,
    fontSize: 10,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressText: {
    marginBottom: 8,
    opacity: 0.7,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  exercisesList: {
    flex: 1,
  },
  exerciseCard: {
    margin: 16,
    marginTop: 0,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default ActiveWorkoutScreen;
