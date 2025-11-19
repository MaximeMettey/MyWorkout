import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  FAB,
  ProgressBar,
  List,
  useTheme,
  Text,
} from 'react-native-paper';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const NutritionScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const [selectedDate] = useState(new Date());

  // Données de démonstration
  const dailyGoals = {
    calories: 2400,
    protein: 180,
    carbs: 270,
    fat: 65,
  };

  const consumed = {
    calories: 1650,
    protein: 125,
    carbs: 180,
    fat: 45,
  };

  const meals = [
    {
      id: '1',
      type: 'breakfast',
      name: 'Petit déjeuner',
      description: 'Oeufs, pain complet, avocat',
      calories: 520,
      protein: 35,
      carbs: 45,
      fat: 18,
      time: '08:30',
    },
    {
      id: '2',
      type: 'lunch',
      name: 'Déjeuner',
      description: 'Poulet, riz, légumes',
      calories: 680,
      protein: 55,
      carbs: 75,
      fat: 12,
      time: '12:45',
    },
    {
      id: '3',
      type: 'snack',
      name: 'Collation',
      description: 'Yaourt grec, fruits',
      calories: 280,
      protein: 20,
      carbs: 35,
      fat: 8,
      time: '16:00',
    },
    {
      id: '4',
      type: 'dinner',
      name: 'Dîner',
      description: 'Saumon, patate douce, brocoli',
      calories: 170,
      protein: 15,
      carbs: 25,
      fat: 7,
      time: '19:30',
    },
  ];

  const getProgress = (consumed: number, goal: number) => consumed / goal;

  const getProgressColor = (progress: number) => {
    if (progress >= 0.9 && progress <= 1.1) return theme.colors.primary;
    if (progress < 0.9) return '#FFA500';
    return '#FF6B6B';
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Sélection de date */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>{format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}</Title>
          </Card.Content>
        </Card>

        {/* Résumé des macros */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Objectifs nutritionnels</Title>

            {/* Calories */}
            <View style={styles.macroRow}>
              <View style={styles.macroHeader}>
                <Text style={styles.macroLabel}>Calories</Text>
                <Text style={styles.macroValue}>
                  {consumed.calories} / {dailyGoals.calories} kcal
                </Text>
              </View>
              <ProgressBar
                progress={getProgress(consumed.calories, dailyGoals.calories)}
                color={getProgressColor(getProgress(consumed.calories, dailyGoals.calories))}
                style={styles.progressBar}
              />
            </View>

            {/* Protéines */}
            <View style={styles.macroRow}>
              <View style={styles.macroHeader}>
                <Text style={styles.macroLabel}>Protéines</Text>
                <Text style={styles.macroValue}>
                  {consumed.protein}g / {dailyGoals.protein}g
                </Text>
              </View>
              <ProgressBar
                progress={getProgress(consumed.protein, dailyGoals.protein)}
                color={getProgressColor(getProgress(consumed.protein, dailyGoals.protein))}
                style={styles.progressBar}
              />
            </View>

            {/* Glucides */}
            <View style={styles.macroRow}>
              <View style={styles.macroHeader}>
                <Text style={styles.macroLabel}>Glucides</Text>
                <Text style={styles.macroValue}>
                  {consumed.carbs}g / {dailyGoals.carbs}g
                </Text>
              </View>
              <ProgressBar
                progress={getProgress(consumed.carbs, dailyGoals.carbs)}
                color={getProgressColor(getProgress(consumed.carbs, dailyGoals.carbs))}
                style={styles.progressBar}
              />
            </View>

            {/* Lipides */}
            <View style={styles.macroRow}>
              <View style={styles.macroHeader}>
                <Text style={styles.macroLabel}>Lipides</Text>
                <Text style={styles.macroValue}>
                  {consumed.fat}g / {dailyGoals.fat}g
                </Text>
              </View>
              <ProgressBar
                progress={getProgress(consumed.fat, dailyGoals.fat)}
                color={getProgressColor(getProgress(consumed.fat, dailyGoals.fat))}
                style={styles.progressBar}
              />
            </View>
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => console.log('Adjust goals')}>
              Ajuster les objectifs
            </Button>
          </Card.Actions>
        </Card>

        {/* Repas du jour */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Repas du jour</Title>
          </Card.Content>
          {meals.map((meal) => (
            <List.Item
              key={meal.id}
              title={meal.name}
              description={`${meal.description} • ${meal.calories} kcal`}
              left={(props) => (
                <List.Icon
                  {...props}
                  icon={
                    meal.type === 'breakfast'
                      ? 'coffee'
                      : meal.type === 'lunch'
                      ? 'food'
                      : meal.type === 'dinner'
                      ? 'food-variant'
                      : 'food-apple'
                  }
                />
              )}
              right={(props) => <Text {...props}>{meal.time}</Text>}
              onPress={() => console.log('View meal', meal.id)}
            />
          ))}
        </Card>

        {/* Calculateur de calories */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Calculateur de besoins</Title>
            <Paragraph>
              Calculez vos besoins caloriques journaliers en fonction de votre profil et de vos
              objectifs.
            </Paragraph>
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => navigation.navigate('CaloriesCalculator')}>
              Ouvrir le calculateur
            </Button>
          </Card.Actions>
        </Card>
      </ScrollView>

      {/* FAB pour ajouter un repas */}
      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        label="Ajouter repas"
        onPress={() => navigation.navigate('AddMeal', { date: selectedDate.toISOString().split('T')[0] })}
      />
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
  macroRow: {
    marginVertical: 12,
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  macroLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  macroValue: {
    fontSize: 14,
    opacity: 0.7,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default NutritionScreen;
