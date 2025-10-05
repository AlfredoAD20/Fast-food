import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import InicioScreen from '../screens/InicioScreen';
import PedidoScreen from '../screens/PedidoScreen';
import FavoritosScreen from '../screens/FavoritosScreen';
import PerfilScreen from '../screens/PerfilScreen';
import colors from '../theme/colors';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#B0B0B0',
        tabBarStyle: {
          height: 60,
          paddingTop: 6,
          paddingBottom: 10,
          backgroundColor: '#FFF',
        },
        tabBarLabelStyle: { fontSize: 12 },
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home-outline';
          if (route.name === 'Inicio') iconName = 'home-outline';
          if (route.name === 'Pedido') iconName = 'cart-outline';
          if (route.name === 'Favoritos') iconName = 'heart-outline';
          if (route.name === 'Perfil') iconName = 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Inicio" component={InicioScreen} />
      <Tab.Screen name="Pedido" component={PedidoScreen} />
      <Tab.Screen name="Favoritos" component={FavoritosScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}