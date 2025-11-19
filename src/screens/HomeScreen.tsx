import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  FAB,
  List,
  useTheme,
  Text,
} from 'react-native-paper';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useWorkout } from '../contexts/WorkoutContext';

const HomeScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const { startWorkout, isWorkoutInProgress, currentWorkout } = useWorkout();
  const [recentWorkouts] = useState([
    {
      id: '1',
      name: 'Push Day',
      date: new Date().toISOString(),
      exercises: 5,
      duration: 65,
    },
    {
      id: '2',
      name: 'Pull Day',
      date: new Date(Date.now() - 86400000).toISOString(),
      exercises: 6,
      duration: 72,
    },
  ]);

  const handleStartWorkout = () => {
    startWorkout('Nouvelle Séance');
    navigation.navigate('ActiveWorkout');
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Stats rapides */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content>
              <Paragraph style={styles.statLabel}>Cette semaine</Paragraph>
              <Title style={styles.statValue}>3</Title>
              <Paragraph style={styles.statUnit}>séances</Paragraph>
            </Card.Content>
          </Card>
          <Card style={styles.statCard}>
            <Card.Content>
              <Paragraph style={styles.statLabel}>Temps total</Paragraph>
              <Title style={styles.statValue}>3h 45m</Title>
              <Paragraph style={styles.statUnit}>d'entraînement</Paragraph>
            </Card.Content>
          </Card>
        </View>

        {/* Séance en cours */}
        {isWorkoutInProgress && currentWorkout && (
          <Card style={styles.card}>
            <Card.Content>
              <Title>🏋️ Séance en cours</Title>
              <Paragraph>{currentWorkout.name}</Paragraph>
              <Paragraph>{currentWorkout.exercises.length} exercices</Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button mode="contained" onPress={() => navigation.navigate('ActiveWorkout')}>
                Reprendre
              </Button>
            </Card.Actions>
          </Card>
        )}

        {/* Entraînements récents */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Entraînements récents</Title>
          </Card.Content>
          {recentWorkouts.map((workout) => (
            <List.Item
              key={workout.id}
              title={workout.name}
              description={`${workout.exercises} exercices • ${workout.duration} min`}
              left={(props) => <List.Icon {...props} icon="dumbbell" />}
              right={(props) => (
                <Text {...props}>
                  {format(new Date(workout.date), 'dd MMM', { locale: fr })}
                </Text>
              )}
              onPress={() => console.log('View workout', workout.id)}
            />
          ))}
          <Card.Actions>
            <Button onPress={() => console.log('View all')}>Voir tout</Button>
          </Card.Actions>
        </Card>

        {/* Templates */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Programmes d'entraînement</Title>
          </Card.Content>
          <List.Item
            title="Push Day"
            description="5 exercices • Pectoraux, Épaules, Triceps"
            left={(props) => <List.Icon {...props} icon="format-list-bulleted" />}
            onPress={() => console.log('Load template')}
          />
          <List.Item
            title="Pull Day"
            description="6 exercices • Dos, Biceps"
            left={(props) => <List.Icon {...props} icon="format-list-bulleted" />}
            onPress={() => console.log('Load template')}
          />
          <List.Item
            title="Leg Day"
            description="7 exercices • Jambes complet"
            left={(props) => <List.Icon {...props} icon="format-list-bulleted" />}
            onPress={() => console.log('Load template')}
          />
          <Card.Actions>
            <Button onPress={() => console.log('Create template')}>
              Créer un programme
            </Button>
          </Card.Actions>
        </Card>
      </ScrollView>

      {/* FAB pour démarrer une séance */}
      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        label="Démarrer"
        onPress={handleStartWorkout}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  statCard: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  statUnit: {
    fontSize: 12,
    opacity: 0.7,
  },
  card: {
    margin: 16,
    marginTop: 0,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
