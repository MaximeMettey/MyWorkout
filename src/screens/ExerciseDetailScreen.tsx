import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import {
  Appbar,
  Card,
  Title,
  Paragraph,
  Chip,
  List,
  Button,
  useTheme,
  Text,
  Divider,
} from 'react-native-paper';
import { EXERCISES } from '../data/exercises';
import { ProgressChart } from '../components/ProgressChart';
import { calculate1RMAverage } from '../utils/calculations';

interface ExerciseDetailScreenProps {
  route: {
    params: {
      exerciseId: string;
    };
  };
  navigation: any;
}

export const ExerciseDetailScreen: React.FC<ExerciseDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const theme = useTheme();
  const { exerciseId } = route.params;
  const exercise = EXERCISES.find((ex) => ex.id === exerciseId);

  // Données de démonstration pour l'historique
  const [history] = useState([
    { date: '2024-01-15', sets: 4, reps: 10, weight: 80, volume: 3200 },
    { date: '2024-01-18', sets: 4, reps: 8, weight: 85, volume: 2720 },
    { date: '2024-01-22', sets: 5, reps: 6, weight: 90, volume: 2700 },
    { date: '2024-01-25', sets: 4, reps: 10, weight: 82.5, volume: 3300 },
  ]);

  const muscleLabels: Record<string, string> = {
    chest: 'Pectoraux',
    back: 'Dos',
    shoulders: 'Épaules',
    biceps: 'Biceps',
    triceps: 'Triceps',
    legs: 'Jambes',
    quadriceps: 'Quadriceps',
    hamstrings: 'Ischio-jambiers',
    calves: 'Mollets',
    glutes: 'Fessiers',
    abs: 'Abdominaux',
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
    'resistance-band': 'Bande de résistance',
    other: 'Autre',
  };

  if (!exercise) {
    return (
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Exercice introuvable" />
        </Appbar.Header>
        <View style={styles.emptyContainer}>
          <Text>Exercice non trouvé</Text>
        </View>
      </View>
    );
  }

  const latestRecord = history[history.length - 1];
  const best1RM = Math.max(
    ...history.map((h) => calculate1RMAverage(h.weight, h.reps))
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={exercise.name} />
        <Appbar.Action icon="star-outline" onPress={() => {}} />
      </Appbar.Header>

      <ScrollView>
        {/* Informations générales */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>{exercise.name}</Title>
            {exercise.nameEn && (
              <Paragraph style={styles.subtitle}>{exercise.nameEn}</Paragraph>
            )}

            <Paragraph style={styles.description}>{exercise.description}</Paragraph>

            <View style={styles.chipsContainer}>
              <Chip icon="weight-lifter" style={styles.chip}>
                {equipmentLabels[exercise.equipment]}
              </Chip>
              <Chip
                icon="signal"
                style={styles.chip}
                textStyle={{
                  color:
                    exercise.difficulty === 'beginner'
                      ? '#4CAF50'
                      : exercise.difficulty === 'intermediate'
                      ? '#FF9800'
                      : '#F44336',
                }}
              >
                {exercise.difficulty === 'beginner'
                  ? 'Débutant'
                  : exercise.difficulty === 'intermediate'
                  ? 'Intermédiaire'
                  : 'Avancé'}
              </Chip>
            </View>

            <Divider style={styles.divider} />

            <Text variant="titleSmall" style={styles.sectionTitle}>
              Muscles ciblés
            </Text>
            <View style={styles.musclesContainer}>
              {exercise.muscleGroup.map((muscle) => (
                <Chip key={muscle} style={styles.muscleChip}>
                  {muscleLabels[muscle]}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Stats personnelles */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Vos statistiques</Title>

            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text variant="headlineMedium" style={styles.statValue}>
                  {latestRecord.weight}kg
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Dernier poids
                </Text>
              </View>

              <View style={styles.statBox}>
                <Text variant="headlineMedium" style={styles.statValue}>
                  {Math.round(best1RM)}kg
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  1RM estimé
                </Text>
              </View>

              <View style={styles.statBox}>
                <Text variant="headlineMedium" style={styles.statValue}>
                  {latestRecord.volume}kg
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Volume max
                </Text>
              </View>

              <View style={styles.statBox}>
                <Text variant="headlineMedium" style={styles.statValue}>
                  {history.length}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Séances
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Graphique de progression */}
        <ProgressChart
          title="Progression du poids"
          data={history.map((h) => h.weight)}
          labels={history.map((h) => h.date.split('-')[2])}
          unit="kg"
          color={theme.colors.primary}
        />

        {/* Historique */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Historique récent</Title>
          </Card.Content>
          {history.reverse().map((record, index) => {
            const oneRM = calculate1RMAverage(record.weight, record.reps);
            return (
              <List.Item
                key={index}
                title={`${record.sets} × ${record.reps} @ ${record.weight}kg`}
                description={`1RM: ${Math.round(oneRM)}kg • Volume: ${record.volume}kg`}
                left={(props) => <List.Icon {...props} icon="calendar" />}
                right={() => (
                  <Text variant="bodySmall" style={styles.dateText}>
                    {new Date(record.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </Text>
                )}
              />
            );
          })}
        </Card>

        {/* Instructions (si disponibles) */}
        {exercise.instructions && (
          <Card style={styles.card}>
            <Card.Content>
              <Title>Instructions</Title>
              {exercise.instructions.map((instruction, index) => (
                <View key={index} style={styles.instructionItem}>
                  <Text variant="bodyMedium">
                    {index + 1}. {instruction}
                  </Text>
                </View>
              ))}
            </Card.Content>
          </Card>
        )}

        {/* Recommandations */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Recommandations</Title>
            <List.Item
              title="Temps de repos"
              description="90-120 secondes entre les séries"
              left={(props) => <List.Icon {...props} icon="timer" />}
            />
            <List.Item
              title="Répétitions"
              description="8-12 pour l'hypertrophie, 4-6 pour la force"
              left={(props) => <List.Icon {...props} icon="counter" />}
            />
            <List.Item
              title="Fréquence"
              description="2-3 fois par semaine"
              left={(props) => <List.Icon {...props} icon="calendar-week" />}
            />
          </Card.Content>
        </Card>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bouton pour ajouter à la séance */}
      <View style={styles.bottomActions}>
        <Button
          mode="contained"
          icon="plus"
          onPress={() => {
            // TODO: Ajouter à la séance en cours
            navigation.goBack();
          }}
          style={styles.addButton}
        >
          Ajouter à la séance
        </Button>
      </View>
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
  },
  card: {
    margin: 16,
  },
  subtitle: {
    fontStyle: 'italic',
    opacity: 0.7,
    marginBottom: 8,
  },
  description: {
    marginVertical: 12,
    lineHeight: 22,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  musclesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  muscleChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  statBox: {
    width: '50%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statValue: {
    fontWeight: 'bold',
    color: '#6200EE',
  },
  statLabel: {
    opacity: 0.6,
    marginTop: 4,
  },
  dateText: {
    opacity: 0.6,
    alignSelf: 'center',
  },
  instructionItem: {
    marginBottom: 12,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  addButton: {
    paddingVertical: 8,
  },
});

export default ExerciseDetailScreen;
