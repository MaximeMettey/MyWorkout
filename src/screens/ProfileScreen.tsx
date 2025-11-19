import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  List,
  Avatar,
  Button,
  useTheme,
  Divider,
} from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { calculateBMI, interpretBMI } from '../utils/calculations';

const ProfileScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const { user, signOut } = useAuth();

  // Données de démonstration
  const profileData = {
    height: 178,
    weight: 77,
    age: 28,
    gender: 'male' as const,
    activityLevel: 'moderate' as const,
    goal: 'gain-muscle' as const,
  };

  const bmi = calculateBMI(profileData.weight, profileData.height);
  const bmiInterpretation = interpretBMI(bmi);

  const activityLevelLabels = {
    sedentary: 'Sédentaire',
    light: 'Légèrement actif',
    moderate: 'Modérément actif',
    'very-active': 'Très actif',
    'extra-active': 'Extrêmement actif',
  };

  const goalLabels = {
    'lose-weight': 'Perdre du poids',
    maintain: 'Maintenir',
    'gain-muscle': 'Prendre du muscle',
    'gain-weight': 'Prendre du poids',
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* En-tête profil */}
        <Card style={styles.card}>
          <Card.Content style={styles.profileHeader}>
            <Avatar.Text
              size={80}
              label={user?.displayName?.substring(0, 2).toUpperCase() || 'U'}
              style={{ backgroundColor: theme.colors.primary }}
            />
            <Title style={styles.profileName}>{user?.displayName || 'Utilisateur'}</Title>
            <Paragraph>{user?.email}</Paragraph>
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => console.log('Edit profile')}>Modifier le profil</Button>
          </Card.Actions>
        </Card>

        {/* Informations physiques */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Informations physiques</Title>
          </Card.Content>
          <List.Item
            title="Taille"
            description={`${profileData.height} cm`}
            left={(props) => <List.Icon {...props} icon="human-male-height" />}
          />
          <Divider />
          <List.Item
            title="Poids actuel"
            description={`${profileData.weight} kg`}
            left={(props) => <List.Icon {...props} icon="weight-kilogram" />}
          />
          <Divider />
          <List.Item
            title="IMC"
            description={`${bmi} (${bmiInterpretation})`}
            left={(props) => <List.Icon {...props} icon="calculator" />}
          />
          <Divider />
          <List.Item
            title="Âge"
            description={`${profileData.age} ans`}
            left={(props) => <List.Icon {...props} icon="cake-variant" />}
          />
          <Divider />
          <List.Item
            title="Sexe"
            description={profileData.gender === 'male' ? 'Homme' : 'Femme'}
            left={(props) => <List.Icon {...props} icon="gender-male-female" />}
          />
        </Card>

        {/* Objectifs */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Activité et objectifs</Title>
          </Card.Content>
          <List.Item
            title="Niveau d'activité"
            description={activityLevelLabels[profileData.activityLevel]}
            left={(props) => <List.Icon {...props} icon="run" />}
          />
          <Divider />
          <List.Item
            title="Objectif"
            description={goalLabels[profileData.goal]}
            left={(props) => <List.Icon {...props} icon="target" />}
          />
        </Card>

        {/* Mensurations corporelles */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Mensurations</Title>
            <Paragraph>Suivez l'évolution de vos mensurations</Paragraph>
          </Card.Content>
          <List.Item
            title="Tour de poitrine"
            description="98 cm"
            left={(props) => <List.Icon {...props} icon="tape-measure" />}
          />
          <Divider />
          <List.Item
            title="Tour de taille"
            description="82 cm"
            left={(props) => <List.Icon {...props} icon="tape-measure" />}
          />
          <Divider />
          <List.Item
            title="Tour de bras"
            description="38 cm"
            left={(props) => <List.Icon {...props} icon="tape-measure" />}
          />
          <Card.Actions>
            <Button onPress={() => navigation.navigate('BodyMeasurement')}>
              Ajouter une mesure
            </Button>
          </Card.Actions>
        </Card>

        {/* Paramètres */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Paramètres</Title>
          </Card.Content>
          <List.Item
            title="Notifications"
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('Notifications')}
          />
          <Divider />
          <List.Item
            title="Unités"
            description="Métrique (kg, cm)"
            left={(props) => <List.Icon {...props} icon="ruler" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('Units')}
          />
          <Divider />
          <List.Item
            title="Sauvegarde et synchronisation"
            left={(props) => <List.Icon {...props} icon="cloud-sync" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('Backup')}
          />
          <Divider />
          <List.Item
            title="À propos"
            left={(props) => <List.Icon {...props} icon="information" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('About')}
          />
        </Card>

        {/* Déconnexion */}
        <Card style={styles.card}>
          <Card.Actions>
            <Button
              mode="outlined"
              onPress={signOut}
              style={styles.signOutButton}
              textColor={theme.colors.error}
            >
              Se déconnecter
            </Button>
          </Card.Actions>
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
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  profileName: {
    marginTop: 16,
    marginBottom: 4,
  },
  signOutButton: {
    flex: 1,
  },
});

export default ProfileScreen;
