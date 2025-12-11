import React, { useContext } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { AuthContext } from '../auth/AuthContext';

export default function VendedorPanelScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Panel de administrador</Text>

      <View style={styles.card}>
        <Text style={styles.saludo}>
          Hola, <Text style={{ color: '#f97316' }}>{user?.nombre || 'Admin'}</Text>
        </Text>
        <Text style={styles.textoSecundario}>
          Desde aquí puedes gestionar los productos del menú.
        </Text>

        <View style={styles.separador} />

        <Text style={styles.subtitulo}>Acciones rápidas</Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('AgregarProducto')}
        >
          <Text style={styles.primaryButtonText}>Agregar nuevo producto</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('InicioTab' || 'MainTabs')}
          disabled
        >
          <Text style={styles.secondaryButtonText}>
            (Próximamente) Editar / eliminar productos
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffaf2',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  titulo: {
    fontSize: 22,
    fontWeight: '900',
    color: '#e85c1e',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  saludo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  textoSecundario: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 6,
  },
  separador: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 14,
  },
  subtitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  primaryButton: {
    backgroundColor: '#f97316',
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  secondaryButton: {
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#F9FAFB',
  },
  secondaryButtonText: {
    color: '#9CA3AF',
    fontSize: 13,
  },
  logoutButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  logoutText: {
    color: '#EF4444',
    fontWeight: '600',
  },
});