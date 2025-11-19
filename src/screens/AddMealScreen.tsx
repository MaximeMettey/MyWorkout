import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import {
  Appbar,
  Card,
  Title,
  TextInput,
  Button,
  SegmentedButtons,
  useTheme,
  Text,
  Snackbar,
} from 'react-native-paper';

export const AddMealScreen = ({ navigation, route }: any) => {
  const theme = useTheme();
  const { date } = route.params || { date: new Date().toISOString().split('T')[0] };

  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>(
    'breakfast'
  );
  const [description, setDescription] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const mealTypeLabels = {
    breakfast: 'Petit déjeuner',
    lunch: 'Déjeuner',
    dinner: 'Dîner',
    snack: 'Collation',
  };

  const calculateCaloriesFromMacros = () => {
    const p = parseFloat(protein) || 0;
    const c = parseFloat(carbs) || 0;
    const f = parseFloat(fat) || 0;

    const totalCalories = p * 4 + c * 4 + f * 9;
    setCalories(Math.round(totalCalories).toString());
  };

  const handleSave = async () => {
    if (!description.trim()) {
      setSnackbarMessage('Veuillez entrer une description');
      setSnackbarVisible(true);
      return;
    }

    if (!calories || parseFloat(calories) <= 0) {
      setSnackbarMessage('Veuillez entrer les calories');
      setSnackbarVisible(true);
      return;
    }

    // TODO: Sauvegarder dans la base de données
    const newEntry = {
      id: `meal-${Date.now()}`,
      userId: 'test-user-1',
      date,
      mealType,
      description,
      calories: parseFloat(calories),
      protein: parseFloat(protein) || 0,
      carbs: parseFloat(carbs) || 0,
      fat: parseFloat(fat) || 0,
      time: new Date().toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    console.log('Saving meal:', newEntry);

    setSnackbarMessage('Repas ajouté avec succès !');
    setSnackbarVisible(true);

    setTimeout(() => {
      navigation.goBack();
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Ajouter un repas" />
        <Appbar.Action icon="check" onPress={handleSave} />
      </Appbar.Header>

      <ScrollView>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Type de repas</Title>
            <SegmentedButtons
              value={mealType}
              onValueChange={(value) => setMealType(value as any)}
              buttons={[
                {
                  value: 'breakfast',
                  label: '🍳',
                  style: { paddingHorizontal: 8 },
                },
                {
                  value: 'lunch',
                  label: '🍽️',
                  style: { paddingHorizontal: 8 },
                },
                {
                  value: 'dinner',
                  label: '🍲',
                  style: { paddingHorizontal: 8 },
                },
                {
                  value: 'snack',
                  label: '🍎',
                  style: { paddingHorizontal: 8 },
                },
              ]}
              style={styles.segmentedButtons}
            />
            <Text variant="bodyMedium" style={styles.mealTypeLabel}>
              {mealTypeLabels[mealType]}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Description</Title>
            <TextInput
              label="Qu'avez-vous mangé ?"
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
              placeholder="Ex: Poulet grillé, riz brun, brocoli"
              left={<TextInput.Icon icon="food" />}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Informations nutritionnelles</Title>

            <TextInput
              label="Calories (kcal)"
              value={calories}
              onChangeText={setCalories}
              keyboardType="decimal-pad"
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="fire" />}
            />

            <View style={styles.macrosRow}>
              <TextInput
                label="Protéines (g)"
                value={protein}
                onChangeText={setProtein}
                keyboardType="decimal-pad"
                mode="outlined"
                style={[styles.input, styles.macroInput]}
                left={<TextInput.Icon icon="food-steak" />}
              />

              <TextInput
                label="Glucides (g)"
                value={carbs}
                onChangeText={setCarbs}
                keyboardType="decimal-pad"
                mode="outlined"
                style={[styles.input, styles.macroInput]}
                left={<TextInput.Icon icon="bread-slice" />}
              />
            </View>

            <TextInput
              label="Lipides (g)"
              value={fat}
              onChangeText={setFat}
              keyboardType="decimal-pad"
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="water" />}
            />

            <Button
              mode="outlined"
              onPress={calculateCaloriesFromMacros}
              icon="calculator"
              style={styles.calculateButton}
            >
              Calculer les calories à partir des macros
            </Button>

            {protein && carbs && fat && (
              <View style={styles.macrosSummary}>
                <Text variant="bodySmall" style={styles.summaryText}>
                  💡 Total calculé :{' '}
                  {Math.round(
                    (parseFloat(protein) || 0) * 4 +
                      (parseFloat(carbs) || 0) * 4 +
                      (parseFloat(fat) || 0) * 9
                  )}{' '}
                  kcal
                </Text>
                <Text variant="bodySmall" style={styles.summaryBreakdown}>
                  {protein}g × 4 + {carbs}g × 4 + {fat}g × 9
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Exemples de repas</Title>
            <Text variant="bodySmall" style={styles.exampleTitle}>
              Cliquez pour pré-remplir :
            </Text>

            <Button
              mode="outlined"
              style={styles.exampleButton}
              onPress={() => {
                setDescription('3 œufs brouillés, pain complet, avocat');
                setCalories('520');
                setProtein('35');
                setCarbs('45');
                setFat('18');
              }}
            >
              🍳 Petit déjeuner protéiné
            </Button>

            <Button
              mode="outlined"
              style={styles.exampleButton}
              onPress={() => {
                setDescription('Poulet grillé 150g, riz brun 200g, légumes');
                setCalories('680');
                setProtein('55');
                setCarbs('75');
                setFat('12');
              }}
            >
              🍗 Déjeuner équilibré
            </Button>

            <Button
              mode="outlined"
              style={styles.exampleButton}
              onPress={() => {
                setDescription('Saumon 120g, patate douce 150g, brocoli');
                setCalories('520');
                setProtein('42');
                setCarbs('48');
                setFat('14');
              }}
            >
              🐟 Dîner sain
            </Button>

            <Button
              mode="outlined"
              style={styles.exampleButton}
              onPress={() => {
                setDescription('Yaourt grec 200g, fruits rouges, amandes');
                setCalories('280');
                setProtein('20');
                setCarbs('25');
                setFat('12');
              }}
            >
              🥤 Collation post-training
            </Button>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.saveButton}
          icon="check-circle"
        >
          Enregistrer le repas
        </Button>

        <View style={{ height: 50 }} />
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
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
  segmentedButtons: {
    marginVertical: 16,
  },
  mealTypeLabel: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 8,
  },
  input: {
    marginBottom: 16,
  },
  macrosRow: {
    flexDirection: 'row',
    gap: 12,
  },
  macroInput: {
    flex: 1,
  },
  calculateButton: {
    marginVertical: 8,
  },
  macrosSummary: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  summaryText: {
    fontWeight: 'bold',
  },
  summaryBreakdown: {
    marginTop: 4,
    opacity: 0.7,
  },
  exampleTitle: {
    marginBottom: 12,
    opacity: 0.7,
  },
  exampleButton: {
    marginBottom: 8,
    justifyContent: 'flex-start',
  },
  saveButton: {
    marginHorizontal: 16,
    marginVertical: 16,
    paddingVertical: 8,
  },
});

export default AddMealScreen;
