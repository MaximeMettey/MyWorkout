import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  SegmentedButtons,
  List,
  useTheme,
} from 'react-native-paper';
import { LineChart, BarChart } from 'react-native-chart-kit';

const StatisticsScreen = () => {
  const theme = useTheme();
  const [timePeriod, setTimePeriod] = useState('week');

  const screenWidth = Dimensions.get('window').width;

  const chartConfig = {
    backgroundColor: theme.colors.surface,
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: theme.colors.primary,
    },
  };

  // Données de poids
  const weightData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      {
        data: [78, 77.8, 77.5, 77.7, 77.4, 77.2, 77],
      },
    ],
  };

  // Données de volume d'entraînement
  const volumeData = {
    labels: ['Lun', 'Mer', 'Ven'],
    datasets: [
      {
        data: [8500, 9200, 8800],
      },
    ],
  };

  // Exercices avec progression
  const exerciseProgress = [
    {
      name: 'Développé couché',
      current1RM: 95,
      previous1RM: 90,
      progression: '+5.6%',
    },
    {
      name: 'Squat',
      current1RM: 120,
      previous1RM: 115,
      progression: '+4.3%',
    },
    {
      name: 'Soulevé de terre',
      current1RM: 140,
      previous1RM: 135,
      progression: '+3.7%',
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Sélection de période */}
        <Card style={styles.card}>
          <Card.Content>
            <SegmentedButtons
              value={timePeriod}
              onValueChange={setTimePeriod}
              buttons={[
                { value: 'week', label: 'Semaine' },
                { value: 'month', label: 'Mois' },
                { value: 'year', label: 'Année' },
              ]}
            />
          </Card.Content>
        </Card>

        {/* Stats globales */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Vue d'ensemble</Title>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Paragraph style={styles.statValue}>12</Paragraph>
                <Paragraph style={styles.statLabel}>Entraînements</Paragraph>
              </View>
              <View style={styles.statItem}>
                <Paragraph style={styles.statValue}>14h 30m</Paragraph>
                <Paragraph style={styles.statLabel}>Temps total</Paragraph>
              </View>
              <View style={styles.statItem}>
                <Paragraph style={styles.statValue}>108,450</Paragraph>
                <Paragraph style={styles.statLabel}>Volume (kg)</Paragraph>
              </View>
              <View style={styles.statItem}>
                <Paragraph style={styles.statValue}>7</Paragraph>
                <Paragraph style={styles.statLabel}>Jours de suite</Paragraph>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Graphique de poids */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Évolution du poids</Title>
            <LineChart
              data={weightData}
              width={screenWidth - 64}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </Card.Content>
        </Card>

        {/* Graphique de volume */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Volume d'entraînement</Title>
            <BarChart
              data={volumeData}
              width={screenWidth - 64}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              yAxisSuffix=" kg"
            />
          </Card.Content>
        </Card>

        {/* Progression des exercices */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Progression 1RM</Title>
          </Card.Content>
          {exerciseProgress.map((exercise, index) => (
            <List.Item
              key={index}
              title={exercise.name}
              description={`${exercise.current1RM}kg (${exercise.progression})`}
              left={(props) => <List.Icon {...props} icon="trending-up" />}
              right={() => (
                <Paragraph style={styles.progressionText}>
                  {exercise.progression}
                </Paragraph>
              )}
            />
          ))}
        </Card>

        {/* Mensurations */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Mensurations corporelles</Title>
            <Paragraph>Suivez l'évolution de vos mensurations corporelles</Paragraph>
          </Card.Content>
          <List.Item
            title="Poids"
            description="77.0 kg"
            left={(props) => <List.Icon {...props} icon="weight-kilogram" />}
          />
          <List.Item
            title="IMC"
            description="23.5 (Poids normal)"
            left={(props) => <List.Icon {...props} icon="human" />}
          />
          <List.Item
            title="Masse grasse"
            description="15.2%"
            left={(props) => <List.Icon {...props} icon="percent" />}
          />
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
  card: {
    margin: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  statItem: {
    width: '50%',
    marginBottom: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  progressionText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});

export default StatisticsScreen;
