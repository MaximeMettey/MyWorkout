import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import ExercisesScreen from '../screens/ExercisesScreen';
import NutritionScreen from '../screens/NutritionScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import ProfileScreen from '../screens/ProfileScreen';

import { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const AppNavigator = () => {
  const theme = useTheme();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.onSurfaceDisabled,
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: '#fff',
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Entraînements',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="dumbbell" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Exercises"
          component={ExercisesScreen}
          options={{
            title: 'Exercices',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="weight-lifter" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Nutrition"
          component={NutritionScreen}
          options={{
            title: 'Nutrition',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="food-apple" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Statistics"
          component={StatisticsScreen}
          options={{
            title: 'Statistiques',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="chart-line" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: 'Profil',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
