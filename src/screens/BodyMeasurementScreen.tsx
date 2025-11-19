import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import {
  Appbar,
  Card,
  Title,
  Paragraph,
  TextInput,
  Button,
  useTheme,
  Text,
  Snackbar,
  Divider,
} from 'react-native-paper';
import {
  calculateBMI,
  interpretBMI,
  calculateBodyFatMale,
  calculateBodyFatFemale,
} from '../utils/calculations';
import { useAuth } from '../contexts/AuthContext';

export const BodyMeasurementScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const { user } = useAuth();

  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [muscleMass, setMuscleMass] = useState('');
  const [neck, setNeck] = useState('');
  const [chest, setChest] = useState('');
  const [waist, setWaist] = useState('');
  const [hips, setHips] = useState('');
  const [biceps, setBiceps] = useState('');
  const [thighs, setThighs] = useState('');
  const [calves, setCalves] = useState('');
  const [notes, setNotes] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Valeurs de test pour la hauteur et le sexe
  const userHeight = 178; // TODO: Récupérer du profil utilisateur
  const userGender = 'male'; // TODO: Récupérer du profil utilisateur

  const handleSave = async () => {
    if (!weight) {
      setSnackbarMessage('Veuillez entrer au moins votre poids');
      setSnackbarVisible(true);
      return;
    }

    const measurement = {
      id: `measurement-${Date.now()}`,
      userId: user?.id || 'test-user-1',
      date: new Date().toISOString().split('T')[0],
      weight: parseFloat(weight) || undefined,
      bodyFat: parseFloat(bodyFat) || undefined,
      muscleMass: parseFloat(muscleMass) || undefined,
      neck: parseFloat(neck) || undefined,
      chest: parseFloat(chest) || undefined,
      waist: parseFloat(waist) || undefined,
      hips: parseFloat(hips) || undefined,
      biceps: parseFloat(biceps) || undefined,
      thighs: parseFloat(thighs) || undefined,
      calves: parseFloat(calves) || undefined,
      notes: notes || undefined,
    };

    console.log('Saving measurement:', measurement);
    // TODO: Sauvegarder dans la base de données

    setSnackbarMessage('Mensurations enregistrées avec succès !');
    setSnackbarVisible(true);

    setTimeout(() => {
      navigation.goBack();
    }, 1500);
  };

  const calculateBodyFatEstimate = () => {
    const w = parseFloat(waist);
    const n = parseFloat(neck);
    const h = parseFloat(hips);

    if (!w || !n) {
      setSnackbarMessage('Entrez au moins le tour de taille et de cou');
      setSnackbarVisible(true);
      return;
    }

    let estimatedBodyFat: number;
    if (userGender === 'male') {
      estimatedBodyFat = calculateBodyFatMale(w, n, userHeight);
    } else {
      if (!h) {
        setSnackbarMessage('Entrez également le tour de hanches');
        setSnackbarVisible(true);
        return;
      }
      estimatedBodyFat = calculateBodyFatFemale(w, h, n, userHeight);
    }

    setBodyFat(estimatedBodyFat.toFixed(1));
    setSnackbarMessage(`Masse grasse estimée: ${estimatedBodyFat.toFixed(1)}%`);
    setSnackbarVisible(true);
  };

  const bmi = weight && userHeight ? calculateBMI(parseFloat(weight), userHeight) : null;
  const bmiInterpretation = bmi ? interpretBMI(bmi) : null;

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Ajouter des mensurations" />
        <Appbar.Action icon="check" onPress={handleSave} />
      </Appbar.Header>

      <ScrollView>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Poids et composition corporelle</Title>

            <TextInput
              label="Poids (kg) *"
              value={weight}
              onChangeText={setWeight}
              keyboardType="decimal-pad"
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="weight-kilogram" />}
            />

            {bmi && (
              <View style={styles.bmiCard}>
                <Text variant="bodyMedium">
                  IMC: <Text style={styles.boldText}>{bmi.toFixed(1)}</Text>
                </Text>
                <Text variant="bodySmall" style={styles.bmiInterpretation}>
                  {bmiInterpretation}
                </Text>
              </View>
            )}

            <TextInput
              label="Taux de masse grasse (%)"
              value={bodyFat}
              onChangeText={setBodyFat}
              keyboardType="decimal-pad"
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="percent" />}
            />

            <TextInput
              label="Masse musculaire (kg)"
              value={muscleMass}
              onChangeText={setMuscleMass}
              keyboardType="decimal-pad"
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="arm-flex" />}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Mensurations corporelles (cm)</Title>
            <Paragraph style={styles.description}>
              Mesurez à l'aide d'un ruban métrique. Toutes les mesures sont optionnelles.
            </Paragraph>

            <TextInput
              label="Tour de cou"
              value={neck}
              onChangeText={setNeck}
              keyboardType="decimal-pad"
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="tape-measure" />}
            />

            <TextInput
              label="Tour de poitrine"
              value={chest}
              onChangeText={setChest}
              keyboardType="decimal-pad"
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="tape-measure" />}
            />

            <TextInput
              label="Tour de taille"
              value={waist}
              onChangeText={setWaist}
              keyboardType="decimal-pad"
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="tape-measure" />}
            />

            <TextInput
              label="Tour de hanches"
              value={hips}
              onChangeText={setHips}
              keyboardType="decimal-pad"
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="tape-measure" />}
            />

            <TextInput
              label="Tour de bras"
              value={biceps}
              onChangeText={setBiceps}
              keyboardType="decimal-pad"
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="tape-measure" />}
              placeholder="Mesurez le biceps contracté"
            />

            <TextInput
              label="Tour de cuisses"
              value={thighs}
              onChangeText={setThighs}
              keyboardType="decimal-pad"
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="tape-measure" />}
            />

            <TextInput
              label="Tour de mollets"
              value={calves}
              onChangeText={setCalves}
              keyboardType="decimal-pad"
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="tape-measure" />}
            />

            <Button
              mode="outlined"
              onPress={calculateBodyFatEstimate}
              icon="calculator"
              style={styles.calculateButton}
            >
              Estimer le taux de masse grasse
            </Button>

            <View style={styles.infoBox}>
              <Text variant="bodySmall">
                💡 L'estimation du taux de masse grasse utilise la méthode de la Marine US et
                nécessite les mesures du cou et de la taille.
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Notes</Title>
            <TextInput
              label="Notes (optionnel)"
              value={notes}
              onChangeText={setNotes}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={styles.input}
              placeholder="Ex: Première mesure, après 3 mois d'entraînement, etc."
              left={<TextInput.Icon icon="note-text" />}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Conseils de mesure</Title>
            <View style={styles.tipsList}>
              <Text variant="bodyMedium" style={styles.tip}>
                📏 Mesurez toujours au même moment de la journée (idéalement le matin)
              </Text>
              <Text variant="bodyMedium" style={styles.tip}>
                🧍 Restez debout et détendu pour toutes les mesures
              </Text>
              <Text variant="bodyMedium" style={styles.tip}>
                📸 Prenez des photos de progression en complément
              </Text>
              <Text variant="bodyMedium" style={styles.tip}>
                📅 Mesurez-vous toutes les 2-4 semaines pour suivre l'évolution
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.saveButton}
          icon="content-save"
        >
          Enregistrer les mensurations
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
  description: {
    marginBottom: 16,
    opacity: 0.7,
  },
  input: {
    marginBottom: 16,
  },
  bmiCard: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  bmiInterpretation: {
    marginTop: 4,
    opacity: 0.8,
  },
  calculateButton: {
    marginVertical: 8,
  },
  infoBox: {
    backgroundColor: '#FFF9C4',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  tipsList: {
    gap: 12,
  },
  tip: {
    lineHeight: 24,
  },
  saveButton: {
    marginHorizontal: 16,
    marginVertical: 16,
    paddingVertical: 8,
  },
});

export default BodyMeasurementScreen;
