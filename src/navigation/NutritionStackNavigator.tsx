import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NutritionScreen from '../screens/NutritionScreen';
import AddMealScreen from '../screens/AddMealScreen';
import CaloriesCalculatorScreen from '../screens/CaloriesCalculatorScreen';

const Stack = createStackNavigator();

export const NutritionStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="NutritionMain" component={NutritionScreen} />
      <Stack.Screen name="AddMeal" component={AddMealScreen} />
      <Stack.Screen name="CaloriesCalculator" component={CaloriesCalculatorScreen} />
    </Stack.Navigator>
  );
};
