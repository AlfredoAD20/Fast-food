import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { CartProvider } from './scr/CartContext';
import WelcomeScreen from './scr/screens/WelcomeScreen';
import MainTabs from './scr/navigation/MainTabs';
import AuthStack from './scr/auth';
import { AuthProvider } from './scr/auth/AuthContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
   <AuthProvider> 
    <CartProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Auth" component={AuthStack} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  </AuthProvider>
  );
}
