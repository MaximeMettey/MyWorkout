import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import {
  Appbar,
  Card,
  Title,
  Paragraph,
  TextInput,
  Button,
  RadioButton,
  SegmentedButtons,
  useTheme,
  Text,
  Divider,
} from 'react-native-paper';
import {
  calculateBMR,
  calculateTDEE,
  calculateMacros,
  calculateBMI,
  interpretBMI,
} from '../utils/calculations';

export const CaloriesCalculatorScreen = ({ navigation }: any) => {
  const theme = useTheme();

  const [weight, setWeight] = useState('75');
  const [height, setHeight] = useState('175');
  const [age, setAge] = useState('28');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activityLevel, setActivityLevel] = useState<
    'sedentary' | 'light' | 'moderate' | 'very-active' | 'extra-active'
  >('moderate');
  const [goal, setGoal] = useState<'lose-weight' | 'maintain' | 'gain-muscle' | 'gain-weight'>(
    'maintain'
  );

  const [results, setResults] = useState<{
    bmr: number;
    tdee: number;
    dailyCalories: number;
    macros: { protein: number; carbs: number; fat: number };
    bmi: number;
    bmiInterpretation: string;
  } | null>(null);

  const activityLevels = {
    sedentary: { label: 'Sédentaire', description: 'Peu ou pas d\'exercice' },
    light: { label: 'Légèrement actif', description: '1-3 jours/semaine' },
    moderate: { label: 'Modérément actif', description: '3-5 jours/semaine' },
    'very-active': { label: 'Très actif', description: '6-7 jours/semaine' },
    'extra-active': { label: 'Extrêmement actif', description: '2x par jour' },
  };

  const goals = {
    'lose-weight': { label: 'Perdre du poids', description: 'Déficit calorique de 20%' },
    maintain: { label: 'Maintenir', description: 'Maintien du poids actuel' },
    'gain-muscle': { label: 'Prendre du muscle', description: 'Surplus calorique de 10%' },
    'gain-weight': { label: 'Prendre du poids', description: 'Surplus calorique de 15%' },
  };

  const handleCalculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age);

    if (!w || !h || !a) {
      return;
    }

    const bmr = calculateBMR(w, h, a, gender);
    const tdee = calculateTDEE(bmr, activityLevel);

    let dailyCalories: number;
    switch (goal) {
      case 'lose-weight':
        dailyCalories = Math.round(tdee * 0.8);
        break;
      case 'gain-muscle':
        dailyCalories = Math.round(tdee * 1.1);
        break;
      case 'gain-weight':
        dailyCalories = Math.round(tdee * 1.15);
        break;
      default:
        dailyCalories = tdee;
    }

    const macros = calculateMacros(dailyCalories, w, goal);
    const bmi = calculateBMI(w, h);
    const bmiInterpretation = interpretBMI(bmi);

    setResults({
      bmr,
      tdee,
      dailyCalories,
      macros,
      bmi,
      bmiInterpretation,
    });
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Calculateur de calories" />
      </Appbar.Header>

      <ScrollView>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Informations personnelles</Title>

            <TextInput
              label="Poids (kg)"
              value={weight}
              onChangeText={setWeight}
              keyboardType="decimal-pad"
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="weight-kilogram" />}
            />

            <TextInput
              label="Taille (cm)"
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="human-male-height" />}
            />

            <TextInput
              label="Âge (années)"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="cake-variant" />}
            />

            <Text variant="titleSmall" style={styles.sectionTitle}>
              Sexe
            </Text>
            <RadioButton.Group onValueChange={(value) => setGender(value as any)} value={gender}>
              <View style={styles.radioGroup}>
                <RadioButton.Item label="Homme" value="male" />
                <RadioButton.Item label="Femme" value="female" />
              </View>
            </RadioButton.Group>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Niveau d'activité</Title>
            <Paragraph style={styles.description}>
              Sélectionnez votre niveau d'activité physique hebdomadaire
            </Paragraph>

            <RadioButton.Group
              onValueChange={(value) => setActivityLevel(value as any)}
              value={activityLevel}
            >
              {Object.entries(activityLevels).map(([key, value]) => (
                <View key={key}>
                  <RadioButton.Item
                    label={value.label}
                    value={key}
                    status={activityLevel === key ? 'checked' : 'unchecked'}
                  />
                  <Paragraph style={styles.activityDescription}>
                    {value.description}
                  </Paragraph>
                </View>
              ))}
            </RadioButton.Group>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Objectif</Title>
            <Paragraph style={styles.description}>
              Quel est votre objectif principal ?
            </Paragraph>

            <RadioButton.Group onValueChange={(value) => setGoal(value as any)} value={goal}>
              {Object.entries(goals).map(([key, value]) => (
                <View key={key}>
                  <RadioButton.Item
                    label={value.label}
                    value={key}
                    status={goal === key ? 'checked' : 'unchecked'}
                  />
                  <Paragraph style={styles.activityDescription}>
                    {value.description}
                  </Paragraph>
                </View>
              ))}
            </RadioButton.Group>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={handleCalculate}
          style={styles.calculateButton}
          icon="calculator"
        >
          Calculer mes besoins
        </Button>

        {results && (
          <>
            <Card style={styles.card}>
              <Card.Content>
                <Title>Vos résultats</Title>

                <View style={styles.resultRow}>
                  <Text variant="bodyLarge">IMC</Text>
                  <Text variant="headlineSmall" style={styles.resultValue}>
                    {results.bmi.toFixed(1)}
                  </Text>
                </View>
                <Paragraph style={styles.bmiInterpretation}>
                  {results.bmiInterpretation}
                </Paragraph>

                <Divider style={styles.divider} />

                <View style={styles.resultRow}>
                  <Text variant="bodyLarge">Métabolisme de base (BMR)</Text>
                  <Text variant="headlineSmall" style={styles.resultValue}>
                    {results.bmr} kcal
                  </Text>
                </View>
                <Paragraph style={styles.resultDescription}>
                  Calories brûlées au repos
                </Paragraph>

                <Divider style={styles.divider} />

                <View style={styles.resultRow}>
                  <Text variant="bodyLarge">Dépense totale (TDEE)</Text>
                  <Text variant="headlineSmall" style={styles.resultValue}>
                    {results.tdee} kcal
                  </Text>
                </View>
                <Paragraph style={styles.resultDescription}>
                  Calories brûlées par jour
                </Paragraph>

                <Divider style={styles.divider} />

                <View style={styles.resultRow}>
                  <Text variant="titleLarge" style={styles.highlightText}>
                    Objectif calorique
                  </Text>
                  <Text
                    variant="displaySmall"
                    style={[styles.resultValue, { color: theme.colors.primary }]}
                  >
                    {results.dailyCalories}
                  </Text>
                </View>
                <Paragraph style={[styles.resultDescription, { fontWeight: 'bold' }]}>
                  kcal par jour pour {goals[goal].label.toLowerCase()}
                </Paragraph>
              </Card.Content>
            </Card>

            <Card style={styles.card}>
              <Card.Content>
                <Title>Répartition des macronutriments</Title>

                <View style={styles.macroCard}>
                  <View style={styles.macroItem}>
                    <Text variant="displaySmall" style={styles.macroValue}>
                      {results.macros.protein}g
                    </Text>
                    <Text variant="bodyMedium" style={styles.macroLabel}>
                      Protéines
                    </Text>
                    <Text variant="bodySmall" style={styles.macroCalories}>
                      {results.macros.protein * 4} kcal
                    </Text>
                  </View>

                  <View style={styles.macroItem}>
                    <Text variant="displaySmall" style={styles.macroValue}>
                      {results.macros.carbs}g
                    </Text>
                    <Text variant="bodyMedium" style={styles.macroLabel}>
                      Glucides
                    </Text>
                    <Text variant="bodySmall" style={styles.macroCalories}>
                      {results.macros.carbs * 4} kcal
                    </Text>
                  </View>

                  <View style={styles.macroItem}>
                    <Text variant="displaySmall" style={styles.macroValue}>
                      {results.macros.fat}g
                    </Text>
                    <Text variant="bodyMedium" style={styles.macroLabel}>
                      Lipides
                    </Text>
                    <Text variant="bodySmall" style={styles.macroCalories}>
                      {results.macros.fat * 9} kcal
                    </Text>
                  </View>
                </View>

                <Paragraph style={styles.macroNote}>
                  💡 Ces valeurs sont des recommandations basées sur votre profil et votre
                  objectif.
                </Paragraph>
              </Card.Content>

              <Card.Actions>
                <Button
                  mode="contained"
                  onPress={() => {
                    // TODO: Sauvegarder les objectifs dans le profil
                    navigation.goBack();
                  }}
                >
                  Enregistrer ces objectifs
                </Button>
              </Card.Actions>
            </Card>
          </>
        )}

        <View style={{ height: 50 }} />
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
  input: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  radioGroup: {
    flexDirection: 'row',
  },
  description: {
    marginBottom: 12,
    opacity: 0.7,
  },
  activityDescription: {
    marginLeft: 56,
    marginTop: -8,
    marginBottom: 8,
    fontSize: 12,
    opacity: 0.6,
  },
  calculateButton: {
    marginHorizontal: 16,
    marginVertical: 8,
    paddingVertical: 6,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  resultValue: {
    fontWeight: 'bold',
  },
  resultDescription: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 8,
  },
  bmiInterpretation: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: -4,
    marginBottom: 8,
  },
  divider: {
    marginVertical: 16,
  },
  highlightText: {
    fontWeight: 'bold',
  },
  macroCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontWeight: 'bold',
    color: '#6200EE',
  },
  macroLabel: {
    marginTop: 8,
    fontWeight: '600',
  },
  macroCalories: {
    opacity: 0.6,
    marginTop: 4,
  },
  macroNote: {
    marginTop: 16,
    fontSize: 13,
    fontStyle: 'italic',
    backgroundColor: '#FFF9C4',
    padding: 12,
    borderRadius: 8,
  },
});

export default CaloriesCalculatorScreen;
