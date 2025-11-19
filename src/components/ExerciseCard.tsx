import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, IconButton, Chip, useTheme } from 'react-native-paper';
import { Exercise } from '../models';

interface ExerciseCardProps {
  exercise: Exercise;
  onPress?: () => void;
  showMuscleGroups?: boolean;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onPress,
  showMuscleGroups = true,
}) => {
  const theme = useTheme();

  const muscleLabels: Record<string, string> = {
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

  const equipmentLabels: Record<string, string> = {
    barbell: 'Barre',
    dumbbell: 'Haltères',
    machine: 'Machine',
    cable: 'Poulie',
    bodyweight: 'Poids du corps',
    kettlebell: 'Kettlebell',
    'resistance-band': 'Bande',
    other: 'Autre',
  };

  const difficultyColors = {
    beginner: '#4CAF50',
    intermediate: '#FF9800',
    advanced: '#F44336',
  };

  const getEquipmentIcon = (equipment: string) => {
    switch (equipment) {
      case 'barbell':
        return 'barbell';
      case 'dumbbell':
        return 'dumbbell';
      case 'bodyweight':
        return 'human';
      case 'cable':
      case 'machine':
        return 'cog';
      default:
        return 'weight-lifter';
    }
  };

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <IconButton
              icon={getEquipmentIcon(exercise.equipment)}
              size={24}
              iconColor={theme.colors.primary}
            />
            <View>
              <Text variant="titleMedium" style={styles.title}>
                {exercise.name}
              </Text>
              {exercise.nameEn && (
                <Text variant="bodySmall" style={styles.subtitle}>
                  {exercise.nameEn}
                </Text>
              )}
            </View>
          </View>
          <Chip
            style={[
              styles.difficultyChip,
              { backgroundColor: difficultyColors[exercise.difficulty] + '20' },
            ]}
            textStyle={{ color: difficultyColors[exercise.difficulty] }}
          >
            {exercise.difficulty === 'beginner'
              ? 'Débutant'
              : exercise.difficulty === 'intermediate'
              ? 'Intermédiaire'
              : 'Avancé'}
          </Chip>
        </View>

        <Text variant="bodyMedium" style={styles.description}>
          {exercise.description}
        </Text>

        <View style={styles.footer}>
          <Chip icon="weight-lifter" style={styles.chip}>
            {equipmentLabels[exercise.equipment]}
          </Chip>
          {showMuscleGroups && (
            <Chip icon="arm-flex" style={styles.chip}>
              {muscleLabels[exercise.muscleGroup[0]]}
            </Chip>
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    flex: 1,
  },
  subtitle: {
    opacity: 0.6,
    fontStyle: 'italic',
  },
  description: {
    marginBottom: 12,
    opacity: 0.8,
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginRight: 8,
  },
  difficultyChip: {
    marginLeft: 8,
  },
});
