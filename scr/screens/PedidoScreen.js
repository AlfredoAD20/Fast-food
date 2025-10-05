import React from 'react';
import { View, Text } from 'react-native';

export default function PedidoScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 18, fontWeight: '600' }}>Pedido</Text>
    </View>
  );
}