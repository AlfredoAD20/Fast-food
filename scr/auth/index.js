import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import LoginVendedorScreen from '../screens/LoginVendedorScreen';
import VendedorPanelScreen from '../screens/VendedorPanelScreen';
import AgregarProductoScreen from '../screens/AgregarProductoScreen';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="LoginVendedor" component={LoginVendedorScreen} />
      <Stack.Screen name="VendedorPanel" component={VendedorPanelScreen} />
      <Stack.Screen name="AgregarProducto" component={AgregarProductoScreen} />
    </Stack.Navigator>
  );
}
