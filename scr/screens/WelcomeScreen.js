import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import colors from '../theme/colors';

export default function WelcomeScreen({ navigation }) {
  // Efecto para cambiar automáticamente a Register después de 4 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Register');
    }, 4000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
      {/* Silueta de hamburguesa */}
      <Image
        source={require('../../assets/burger-icon.png')}
        style={{ width: 260, height: 260, tintColor: colors.primary, marginBottom: 6 }}
        resizeMode="contain"
      />

      {/* Texto de bienvenida */}
      <Text style={{ color: colors.primary, fontSize: 34, fontWeight: '900', letterSpacing: 1.5 }}>
        BIENVENIDO
      </Text>
    </View>
  );
}