import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView, Keyboard, TouchableWithoutFeedback, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../theme/colors';

export default function RegisterScreen({ navigation }) {
  const [usuario, setUsuario] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');

  const goToInicio = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs', params: { screen: 'Inicio' } }],
    });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <LinearGradient
          colors={['#FFE5CC', '#FFF8DC', '#FFE5CC']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ flex: 1, paddingHorizontal: 24, paddingTop: 60, paddingBottom: 24 }}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }} keyboardShouldPersistTaps="handled">
            {/* Ícono hamburguesa */}
            <Image
              source={require('../../assets/burger-icon.png')}
              style={{ width: 200, height: 200, tintColor: colors.primaryDark, marginBottom: 5 }}
              resizeMode="contain"
            />

            {/* Título */}
            <Text style={{ fontSize: 34, fontWeight: '900', color: colors.primaryDark, marginBottom: 30 }}>
              Registrate
            </Text>

            {/* Campos de entrada */}
            <View style={{ width: '100%', gap: 18 }}>
              <TextInput
                value={usuario}
                onChangeText={setUsuario}
                placeholder="Usuario"
                placeholderTextColor={colors.primary}
                style={{ borderWidth: 2, borderColor: colors.primary, borderRadius: 25, paddingHorizontal: 20, paddingVertical: 12, backgroundColor: 'transparent', color: colors.text, fontSize: 16 }}
              />

              <TextInput
                value={correo}
                onChangeText={setCorreo}
                placeholder="Correo"
                placeholderTextColor={colors.primary}
                keyboardType="email-address"
                style={{ borderWidth: 2, borderColor: colors.primary, borderRadius: 25, paddingHorizontal: 20, paddingVertical: 12, backgroundColor: 'transparent', color: colors.text, fontSize: 16 }}
              />

              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Contraseña"
                placeholderTextColor={colors.primary}
                secureTextEntry
                style={{ borderWidth: 2, borderColor: colors.primary, borderRadius: 25, paddingHorizontal: 20, paddingVertical: 12, backgroundColor: 'transparent', color: colors.text, fontSize: 16 }}
              />
            </View>

            {/* Botón Registrarse */}
            <Pressable
              onPress={goToInicio}
              style={({ pressed }) => ({
                marginTop: 40,
                borderWidth: 2,
                borderColor: colors.primaryDark,
                borderRadius: 25,
                paddingVertical: 10,
                paddingHorizontal: 35,
                backgroundColor: pressed ? 'rgba(255,255,255,0.2)' : 'transparent',
              })}
            >
              <Text style={{ color: colors.primaryDark, fontSize: 18, fontWeight: '700' }}>Registrarse</Text>
            </Pressable>
          </ScrollView>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}