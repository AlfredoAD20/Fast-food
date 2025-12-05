import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../theme/colors';
import { API_URL } from '@env'; 
import { AuthContext } from '../auth/AuthContext'; 


export default function LoginScreen({ navigation }) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext); 

  const handleLogin = async () => {
    if (!correo || !password) {
      Alert.alert('Campos incompletos', 'Ingresa tu correo y contraseña');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: correo, 
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert('Error al iniciar sesión', data.message || 'No se pudo iniciar sesión');
        return;
      }

       login(data.user, data.token);

      console.log('TOKEN:', data.token);
      console.log('USER:', data.user);

      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs', params: { screen: 'Inicio' } }],
      });
    } catch (error) {
      console.error('Error en login:', error);
      Alert.alert('Error de conexión', 'No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const irARegistro = () => {
    navigation.navigate('Register');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <LinearGradient
          colors={['#FFE5CC', '#FFF8DC', '#FFE5CC']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ flex: 1, paddingHorizontal: 24, paddingTop: 60, paddingBottom: 24 }}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Ícono hamburguesa */}
            <Image
              source={require('../../assets/burger-icon.png')}
              style={{ width: 200, height: 200, tintColor: colors.primaryDark, marginBottom: 5 }}
              resizeMode="contain"
            />

            {/* Título */}
            <Text
              style={{
                fontSize: 34,
                fontWeight: '900',
                color: colors.primaryDark,
                marginBottom: 30,
              }}
            >
              Inicia sesión
            </Text>

            {/* Campos de entrada */}
            <View style={{ width: '100%', gap: 18 }}>
              <TextInput
                value={correo}
                onChangeText={setCorreo}
                placeholder="Correo electrónico"
                placeholderTextColor={colors.primary}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{
                  borderWidth: 2,
                  borderColor: colors.primary,
                  borderRadius: 25,
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  backgroundColor: 'transparent',
                  color: colors.text,
                  fontSize: 16,
                }}
              />

              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Contraseña"
                placeholderTextColor={colors.primary}
                secureTextEntry
                style={{
                  borderWidth: 2,
                  borderColor: colors.primary,
                  borderRadius: 25,
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  backgroundColor: 'transparent',
                  color: colors.text,
                  fontSize: 16,
                }}
              />
            </View>

            {/* Botón Entrar */}
            <Pressable
              onPress={handleLogin}
              style={({ pressed }) => ({
                marginTop: 40,
                borderWidth: 2,
                borderColor: colors.primaryDark,
                borderRadius: 25,
                paddingVertical: 10,
                paddingHorizontal: 35,
                backgroundColor: pressed ? 'rgba(255,255,255,0.2)' : 'transparent',
                opacity: loading ? 0.6 : 1,
              })}
              disabled={loading}
            >
              <Text style={{ color: colors.primaryDark, fontSize: 18, fontWeight: '700' }}>
                {loading ? 'Entrando...' : 'Entrar'}
              </Text>
            </Pressable>

            {/* Link a registro */}
            <Pressable onPress={irARegistro} style={{ marginTop: 20 }}>
              <Text style={{ color: colors.primaryDark, fontSize: 14 }}>
                ¿No tienes cuenta? <Text style={{ fontWeight: 'bold' }}>Regístrate</Text>
              </Text>
            </Pressable>
          </ScrollView>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}