// scr/screens/InicioScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCart } from '../CartContext';
import { API_URL } from '@env';

const InicioScreen = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [search, setSearch] = useState('');
  const { addToCart } = useCart();

  const API_PRODUCTS = `${API_URL}/products`;

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const respuesta = await fetch(API_PRODUCTS);
        const data = await respuesta.json();
        setProductos(data);
      } catch (error) {
        console.error('Error cargando productos:', error);
      } finally {
        setCargando(false);
      }
    };
    obtenerProductos();
  }, []);

  const filtrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* rating arriba derecha (por ahora fijo, luego puede venir de la BD) */}
      <View style={styles.ratingBadge}>
        <Ionicons name="star" size={12} color="#FBBF24" />
        <Text style={styles.ratingText}>{item.rating || '4.5'}</Text>
      </View>

      {/* Imagen */}
      {item.imagen ? (
        <Image source={{ uri: item.imagen }} style={styles.imagen} resizeMode="cover" />
      ) : (
        <View style={styles.imagenPlaceholder}>
          <Text style={styles.placeholderText}>Sin imagen</Text>
        </View>
      )}

      {/* Nombre */}
      <Text style={styles.nombre} numberOfLines={1}>
        {item.nombre}
      </Text>

      {/* Info secundaria (dummy por ahora) */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={13} color="#A0A0A0" />
          <Text style={styles.metaText}>10 min</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="flame-outline" size={13} color="#A0A0A0" />
          <Text style={styles.metaText}>500 kcal</Text>
        </View>
      </View>

      {/* Precio + botón + */}
      <View style={styles.bottomRow}>
        <Text style={styles.precio}>${item.precio}</Text>
        <TouchableOpacity
          style={styles.plusButton}
          onPress={() => addToCart(item)}
        >
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (cargando) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#F97316" />
          <Text style={styles.loaderText}>Cargando menú...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 🔎 Barra de búsqueda */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color="#B0B0B0" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              placeholderTextColor="#C0C0C0"
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity style={styles.micButton}>
            <Ionicons name="mic-outline" size={18} color="#333" />
          </TouchableOpacity>
        </View>

        
        <LinearGradient
          colors={['#FFE5B4', '#FFD6A5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.promoCard}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.promoBig}>50% Off</Text>
            <Text style={styles.promoSub}>Weekend special deal</Text>
            <TouchableOpacity style={styles.promoButton}>
              <Text style={styles.promoButtonText}>Order now</Text>
            </TouchableOpacity>
          </View>
          <Image
            source={require('../../assets/burger-icon.png')}
            style={styles.promoImage}
            resizeMode="contain"
          />
        </LinearGradient>

        {/* Encabezado de sección */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Our trusted picks</Text>
          <Text style={styles.sectionLink}>View all</Text>
        </View>

        {/* 🧾 Lista de productos */}
        <FlatList
          data={filtrados}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={styles.lista}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FDF5EC', // fondo cremoso
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    color: '#6B6B6B',
    fontWeight: '600',
  },
  // search
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 4,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  micButton: {
    marginLeft: 10,
    width: 38,
    height: 38,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  // promo
  promoCard: {
    flexDirection: 'row',
    borderRadius: 22,
    padding: 16,
    marginBottom: 18,
    alignItems: 'center',
  },
  promoBig: {
    fontSize: 26,
    fontWeight: '900',
    color: '#3A2A1A',
  },
  promoSub: {
    fontSize: 13,
    color: '#5F4B32',
    marginTop: 4,
    marginBottom: 10,
  },
  promoButton: {
    borderRadius: 999,
    backgroundColor: '#FF8A3D',
    paddingHorizontal: 16,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  promoButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
  },
  promoImage: {
    width: 90,
    height: 90,
    marginLeft: 10,
  },
  // sección
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2E2E2E',
  },
  sectionLink: {
    fontSize: 13,
    color: '#FF8A3D',
    fontWeight: '600',
  },
  lista: {
    paddingBottom: 40,
    paddingTop: 4,
  },
  // cards
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 10,
    marginBottom: 14,
    width: '48%',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  imagen: {
    width: '100%',
    height: 90,
    borderRadius: 16,
    marginBottom: 10,
  },
  imagenPlaceholder: {
    width: '100%',
    height: 90,
    borderRadius: 16,
    backgroundColor: '#FFE5CC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  placeholderText: {
    color: '#FF8A3D',
    fontWeight: 'bold',
  },
  ratingBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ratingText: {
    fontSize: 11,
    marginLeft: 3,
    color: '#4B4B4B',
    fontWeight: '600',
  },
  nombre: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: '#A0A0A0',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  precio: {
    color: '#111827',
    fontWeight: '800',
    fontSize: 15,
  },
  plusButton: {
    width: 30,
    height: 30,
    borderRadius: 999,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default InicioScreen;