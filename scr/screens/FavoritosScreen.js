import React from 'react';
import { View, Text } from 'react-native';

export default function FavoritosScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 18, fontWeight: '600' }}>Favoritos</Text>
    </View>
  );
}