// scr/screens/HistorialPedidosScreen.js
import React, { useEffect, useState, useContext } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,    
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '@env';
import { AuthContext } from '../auth/AuthContext';

export default function HistorialPedidosScreen({ navigation }) {
  const { token } = useContext(AuthContext);
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const API_ORDERS = `${API_URL}/orders`;

  useEffect(() => {
    const fetchPedidos = async () => {
      if (!token) {
        setError('Necesitas iniciar sesión para ver tus pedidos.');
        setCargando(false);
        return;
      }

      try {
        setCargando(true);
        setError(null);

        const res = await fetch(API_ORDERS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          console.log('Error al obtener pedidos:', data);
          throw new Error(data.error || 'No se pudieron cargar los pedidos');
        }

        setPedidos(data);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar tus pedidos. Intenta de nuevo más tarde.');
      } finally {
        setCargando(false);
      }
    };

    fetchPedidos();
  }, [token]);

  const formatearFecha = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Fecha desconocida';
    }
  };

  const renderItem = ({ item }) => {
    const numProductos = item.productos?.length || 0;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.badge}>
            <Ionicons name="receipt-outline" size={16} color="#fff" />
          </View>
          <Text style={styles.fecha}>{formatearFecha(item.createdAt || item.fecha)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Total</Text>
          <Text style={styles.total}>${item.total?.toFixed(2)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Productos</Text>
          <Text style={styles.value}>{numProductos}</Text>
        </View>

        <View style={styles.footerRow}>
          <View style={styles.estadoPill}>
            <Ionicons name="checkmark-circle" size={14} color="#22C55E" />
            <Text style={styles.estadoText}>Completado</Text>
          </View>
          <Text style={styles.idText}>
            #{String(item._id).slice(-6).toUpperCase()}
          </Text>
        </View>
      </View>
    );
  };


  if (cargando) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={22} color="#e85c1e" />
          </TouchableOpacity>
          <Text style={styles.titulo}>Mis pedidos</Text>
          <View style={{ width: 22 }} />
        </View>

        <View style={styles.center}>
          <ActivityIndicator size="large" color="#e85c1e" />
          <Text style={styles.loaderText}>Cargando tus pedidos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={22} color="#e85c1e" />
          </TouchableOpacity>
          <Text style={styles.titulo}>Mis pedidos</Text>
          <View style={{ width: 22 }} />
        </View>

        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={40} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!pedidos.length) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={22} color="#e85c1e" />
          </TouchableOpacity>
          <Text style={styles.titulo}>Mis pedidos</Text>
          <View style={{ width: 22 }} />
        </View>

        <View style={styles.center}>
          <Ionicons name="bag-outline" size={40} color="#A1A1AA" />
          <Text style={styles.emptyTitle}>No tienes pedidos todavía</Text>
          <Text style={styles.emptyText}>
            Cuando confirmes tu primer pedido, aparecerá aquí.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 🆕 Header con back */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={22} color="#e85c1e" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Mis pedidos</Text>
        {/* Espaciador para centrar el título */}
        <View style={{ width: 22 }} />
      </View>

      <FlatList
        data={pedidos}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffaf2',
    paddingHorizontal: 16,
    paddingTop: 30,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  titulo: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#e85c1e',
    textAlign: 'center',
  },
  lista: {
    paddingBottom: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loaderText: {
    marginTop: 10,
    color: '#6B7280',
    fontWeight: '600',
  },
  errorText: {
    marginTop: 10,
    color: '#EF4444',
    textAlign: 'center',
  },
  emptyTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '700',
    color: '#4B5563',
  },
  emptyText: {
    marginTop: 4,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: '#e85c1e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  fecha: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'separation', 
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    color: '#6B7280',
  },
  total: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  estadoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  estadoText: {
    fontSize: 12,
    color: '#166534',
    fontWeight: '600',
  },
  idText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});
