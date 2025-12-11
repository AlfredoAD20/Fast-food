import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PedidoScreen from '../screens/PedidoScreen';
import HistorialPedidosScreen from '../screens/HistorialPedidosScreen';

const Stack = createNativeStackNavigator();

export default function PedidosStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PedidoMain" component={PedidoScreen} />
      <Stack.Screen name="HistorialPedidos" component={HistorialPedidosScreen} />
    </Stack.Navigator>
  );
}
