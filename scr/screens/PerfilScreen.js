import React, { useContext } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../auth/AuthContext';
import colors from '../theme/colors';

export default function PerfilScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Auth' }],
    });
  };

  return (
    <LinearGradient
      colors={['#FFE5CC', '#FFF8DC', '#FFE5CC']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.gradient}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Ícono hamburguesa */}
        <Image
          source={require('../../assets/burger-icon.png')}
          style={styles.burger}
          resizeMode="contain"
        />

        {/* Título */}
        <Text style={styles.title}>Mi perfil</Text>

        {/* Tarjeta de info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Datos de la cuenta</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Nombre</Text>
            <Text style={styles.value}>
              {user?.nombre || 'Invitado'}
            </Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.row}>
            <Text style={styles.label}>Correo</Text>
            <Text style={styles.value}>
              {user?.email || 'Sin correo'}
            </Text>
          </View>
        </View>

        {/* Botones */}
        <View style={styles.buttonsContainer}>
          {/* Botón futuro para editar, por ahora decorativo */}
          <Pressable
            style={({ pressed }) => [
              styles.buttonOutline,
              pressed && { backgroundColor: 'rgba(0,0,0,0.04)' },
            ]}
            onPress={() => {}}
          >
            <Text style={styles.buttonOutlineText}>Editar perfil (próximamente)</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.buttonLogout,
              pressed && { opacity: 0.8 },
            ]}
            onPress={handleLogout}
          >
            <Text style={styles.buttonLogoutText}>Cerrar sesión</Text>
          </Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
  },
  burger: {
    width: 180,
    height: 180,
    tintColor: colors.primaryDark,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.primaryDark,
    marginBottom: 30,
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primaryDark,
    marginBottom: 16,
  },
  row: {
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: colors.text,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginVertical: 10,
  },
  buttonsContainer: {
    width: '100%',
    marginTop: 30,
    gap: 14,
  },
  buttonOutline: {
    borderWidth: 2,
    borderColor: colors.primaryDark,
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonOutlineText: {
    textAlign: 'center',
    color: colors.primaryDark,
    fontWeight: '700',
    fontSize: 14,
  },
  buttonLogout: {
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.primaryDark,
  },
  buttonLogoutText: {
    textAlign: 'center',
    color: '#FFF',
    fontWeight: '800',
    fontSize: 16,
  },
});
