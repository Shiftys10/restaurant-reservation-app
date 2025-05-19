import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Εισαγωγή των οθονών
import LoginScreen from './UI/login';
import RestaurantsScreen from './UI/restaurants';
import ReservationsScreen from './UI/reservations';
import RegisterScreen from './UI/register';
import HistoryScreen from './UI/history';
import EditReservationScreen from './UI/editReservation';
import ProfileScreen from './UI/profile';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Σύνδεση Χρήστη' }}
        />
        <Stack.Screen
          name="Restaurants"
          component={RestaurantsScreen}
          options={{ title: 'Λίστα Εστιατορίων' }}
        />
        <Stack.Screen
          name="Reservations"
          component={ReservationsScreen}
          options={{ title: 'Κάνε Κράτηση' }}
        />
        <Stack.Screen 
        name="Register" 
        component={RegisterScreen} 
        />
        <Stack.Screen 
        name="History" 
        component={HistoryScreen} 
        />
        <Stack.Screen 
        name="EditReservation" 
        component={EditReservationScreen} 
        />
        <Stack.Screen 
        name="Profile" 
        component={ProfileScreen} 
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
