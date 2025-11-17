import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import { WorkoutProvider } from './src/contexts/WorkoutContext';
import AppNavigator from './src/navigation/AppNavigator';
import { database } from './src/services/database';

// Thème personnalisé
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6200EE',
    secondary: '#03DAC6',
    tertiary: '#018786',
    error: '#B00020',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    onSurface: '#000000',
    onSurfaceVariant: '#49454F',
    onSurfaceDisabled: '#1C1B1F61',
  },
};

export default function App() {
  useEffect(() => {
    // Initialiser la base de données au démarrage
    const initDatabase = async () => {
      try {
        await database.init();
        console.log('✅ Base de données initialisée');
      } catch (error) {
        console.error('❌ Erreur initialisation base de données:', error);
      }
    };

    initDatabase();
  }, []);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <WorkoutProvider>
            <StatusBar style="auto" />
            <AppNavigator />
          </WorkoutProvider>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
