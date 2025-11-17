import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import {
  Searchbar,
  Card,
  List,
  Chip,
  useTheme,
  Title,
  Paragraph,
} from 'react-native-paper';
import { EXERCISES } from '../data/exercises';
import { MuscleGroup, EquipmentType } from '../models';

const ExercisesScreen = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType | null>(null);

  const muscleGroups: MuscleGroup[] = [
    'chest',
    'back',
    'shoulders',
    'biceps',
    'triceps',
    'legs',
    'abs',
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

  return (
    <View style={styles.container}>
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
          style={styles.chip}
        >
          Tous
        </Chip>
        {muscleGroups.map((muscle) => (
          <Chip
            key={muscle}
            selected={selectedMuscle === muscle}
            onPress={() => setSelectedMuscle(muscle)}
            style={styles.chip}
          >
            {muscleLabels[muscle]}
          </Chip>
        ))}
      </ScrollView>

      {/* Liste d'exercices */}
      <ScrollView>
        <Card style={styles.card}>
          <Card.Content>
            <Title>
              {filteredExercises.length} exercice{filteredExercises.length > 1 ? 's' : ''}
            </Title>
          </Card.Content>
          {filteredExercises.map((exercise) => (
            <List.Item
              key={exercise.id}
              title={exercise.name}
              description={`${muscleLabels[exercise.muscleGroup[0]]} • ${
                equipmentLabels[exercise.equipment]
              }`}
              left={(props) => (
                <List.Icon
                  {...props}
                  icon={
                    exercise.equipment === 'barbell'
                      ? 'barbell'
                      : exercise.equipment === 'dumbbell'
                      ? 'dumbbell'
                      : 'weight-lifter'
                  }
                />
              )}
              onPress={() => console.log('Exercise detail', exercise.id)}
            />
          ))}
        </Card>
      </ScrollView>
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
  },
  filtersContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
  },
  card: {
    margin: 16,
    marginTop: 0,
  },
});

export default ExercisesScreen;
