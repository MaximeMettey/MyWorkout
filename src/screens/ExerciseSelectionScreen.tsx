import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, FlatList } from 'react-native';
import {
  Appbar,
  Searchbar,
  Chip,
  FAB,
  useTheme,
  Text,
  Snackbar,
} from 'react-native-paper';
import { EXERCISES } from '../data/exercises';
import { ExerciseCard } from '../components/ExerciseCard';
import { useWorkout } from '../contexts/WorkoutContext';
import { MuscleGroup, EquipmentType, Exercise } from '../models';

interface ExerciseSelectionScreenProps {
  navigation: any;
}

export const ExerciseSelectionScreen: React.FC<ExerciseSelectionScreenProps> = ({
  navigation,
}) => {
  const theme = useTheme();
  const { addExercise } = useWorkout();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType | null>(null);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const muscleGroups: MuscleGroup[] = [
    'chest',
    'back',
    'shoulders',
    'biceps',
    'triceps',
    'legs',
    'abs',
  ];

  const equipmentTypes: EquipmentType[] = [
    'barbell',
    'dumbbell',
    'machine',
    'cable',
    'bodyweight',
  ];

  const muscleLabels: Record<MuscleGroup, string> = {
    chest: 'Pectoraux',
    back: 'Dos',
    shoulders: 'Épaules',
    biceps: 'Biceps',
    triceps: 'Triceps',
    legs: 'Jambes',
    quadriceps: 'Quadriceps',
    hamstrings: 'Ischio',
    calves: 'Mollets',
    glutes: 'Fessiers',
    abs: 'Abdos',
    forearms: 'Avant-bras',
    trapezius: 'Trapèzes',
    lats: 'Dorsaux',
  };

  const equipmentLabels: Record<EquipmentType, string> = {
    barbell: 'Barre',
    dumbbell: 'Haltères',
    machine: 'Machine',
    cable: 'Poulie',
    bodyweight: 'Poids du corps',
    kettlebell: 'Kettlebell',
    'resistance-band': 'Bande',
    other: 'Autre',
  };

  // Filtrer les exercices
  const filteredExercises = EXERCISES.filter((exercise) => {
    const matchesSearch =
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.nameEn?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMuscle = !selectedMuscle || exercise.muscleGroup.includes(selectedMuscle);
    const matchesEquipment = !selectedEquipment || exercise.equipment === selectedEquipment;

    return matchesSearch && matchesMuscle && matchesEquipment;
  });

  const toggleExerciseSelection = (exercise: Exercise) => {
    const isSelected = selectedExercises.some((ex) => ex.id === exercise.id);

    if (isSelected) {
      setSelectedExercises(selectedExercises.filter((ex) => ex.id !== exercise.id));
    } else {
      setSelectedExercises([...selectedExercises, exercise]);
    }
  };

  const handleAddExercises = () => {
    if (selectedExercises.length === 0) {
      setSnackbarVisible(true);
      return;
    }

    selectedExercises.forEach((exercise) => {
      const workoutExercise = {
        id: `workout-ex-${Date.now()}-${exercise.id}`,
        exerciseId: exercise.id,
        sets: [
          {
            id: `set-${Date.now()}-1`,
            exerciseId: exercise.id,
            setNumber: 1,
            reps: 10,
            weight: 20,
            restTime: 90,
            completed: false,
          },
        ],
        setType: 'normal' as const,
        order: 0,
      };

      addExercise(workoutExercise);
    });

    navigation.goBack();
  };

  const renderExercise = ({ item }: { item: Exercise }) => {
    const isSelected = selectedExercises.some((ex) => ex.id === item.id);

    return (
      <View style={[styles.exerciseItem, isSelected && styles.selectedExercise]}>
        <ExerciseCard
          exercise={item}
          onPress={() => toggleExerciseSelection(item)}
          showMuscleGroups={true}
        />
        {isSelected && (
          <View style={styles.selectedBadge}>
            <Text style={styles.selectedText}>✓ Sélectionné</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Ajouter des exercices" />
        {selectedExercises.length > 0 && (
          <Appbar.Action
            icon="check"
            onPress={handleAddExercises}
          />
        )}
      </Appbar.Header>

      {/* Barre de recherche */}
      <Searchbar
        placeholder="Rechercher un exercice..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      {/* Filtres groupes musculaires */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
      >
        <Chip
          selected={!selectedMuscle}
          onPress={() => setSelectedMuscle(null)}
          style={styles.filterChip}
        >
          Tous
        </Chip>
        {muscleGroups.map((muscle) => (
          <Chip
            key={muscle}
            selected={selectedMuscle === muscle}
            onPress={() => setSelectedMuscle(muscle)}
            style={styles.filterChip}
          >
            {muscleLabels[muscle]}
          </Chip>
        ))}
      </ScrollView>

      {/* Filtres équipement */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.equipmentFilters}
      >
        <Chip
          selected={!selectedEquipment}
          onPress={() => setSelectedEquipment(null)}
          style={styles.filterChip}
          icon="weight-lifter"
        >
          Tout équipement
        </Chip>
        {equipmentTypes.map((equipment) => (
          <Chip
            key={equipment}
            selected={selectedEquipment === equipment}
            onPress={() => setSelectedEquipment(equipment)}
            style={styles.filterChip}
          >
            {equipmentLabels[equipment]}
          </Chip>
        ))}
      </ScrollView>

      {/* Compteur de sélection */}
      {selectedExercises.length > 0 && (
        <View style={[styles.selectionBanner, { backgroundColor: theme.colors.primaryContainer }]}>
          <Text variant="titleMedium">
            {selectedExercises.length} exercice{selectedExercises.length > 1 ? 's' : ''}{' '}
            sélectionné{selectedExercises.length > 1 ? 's' : ''}
          </Text>
        </View>
      )}

      {/* Liste des exercices */}
      <FlatList
        data={filteredExercises}
        renderItem={renderExercise}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge">Aucun exercice trouvé</Text>
          </View>
        }
      />

      {/* FAB pour ajouter */}
      {selectedExercises.length > 0 && (
        <FAB
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          icon="check"
          label={`Ajouter (${selectedExercises.length})`}
          onPress={handleAddExercises}
        />
      )}

      {/* Snackbar */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
      >
        Veuillez sélectionner au moins un exercice
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchbar: {
    margin: 16,
    marginBottom: 8,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  equipmentFilters: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  selectionBanner: {
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 100,
  },
  exerciseItem: {
    position: 'relative',
  },
  selectedExercise: {
    opacity: 0.8,
  },
  selectedBadge: {
    position: 'absolute',
    top: 16,
    right: 24,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  selectedText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default ExerciseSelectionScreen;
