// auth/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // 🔐 Aquí luego conectaremos con la API (login real)
    if (!correo || !password) {
      alert('Por favor llena tu correo y contraseña');
      return;
    }

    // Por ahora, solo simulamos login correcto
    // y tú después navegas a MainTabs desde el Stack padre.
    alert('Inicio de sesión simulado ✅ (luego lo haremos real)');
  };

  const irARegistro = () => {
    navigation.navigate('Register'); // 👈 va a la pantalla de registro del AuthStack
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.titulo}>Iniciar sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.boton} onPress={handleLogin}>
        <Text style={styles.botonTexto}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={irARegistro}>
        <Text style={styles.linkTexto}>
          ¿No tienes cuenta? <Text style={{ fontWeight: 'bold' }}>Regístrate</Text>
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffaf2',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#e85c1e',
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  boton: {
    width: '100%',
    backgroundColor: '#e85c1e',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  botonTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  linkTexto: {
    marginTop: 15,
    color: '#555',
    fontSize: 14,
  },
});

export default LoginScreen;
