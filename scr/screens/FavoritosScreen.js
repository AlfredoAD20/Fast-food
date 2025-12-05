import React from 'react';
import { SafeAreaView } from "react-native";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useCart } from '../CartContext';

const FavoritosScreen = () => {
  const { favorites, addToCart, toggleFavorite } = useCart();

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imagen }} style={styles.imagen} />

      <View style={styles.info}>
        <Text style={styles.nombre}>{item.nombre}</Text>
        <Text style={styles.precio}>${item.precio}</Text>

        <View style={styles.botonesFila}>
          <TouchableOpacity
            style={[styles.boton, { backgroundColor: '#e85c1e' }]}
            onPress={() => addToCart(item)}
          >
            <Text style={styles.botonTexto}>🛒 Agregar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.boton, { backgroundColor: '#777' }]}
            onPress={() => toggleFavorite(item)}
          >
            <Text style={styles.botonTexto}>Quitar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (favorites.length === 0) {
    return (
      <View style={styles.vacio}>
        <Text style={styles.vacioTexto}>Aún no tienes favoritos ⭐</Text>
        <Text style={styles.vacioSub}>Ve al menú e intenta marcar algunos</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Tus favoritos</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView> 
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffaf2',
    paddingHorizontal: 15,
    marginTop: 30,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#e85c1e',
    textAlign: 'center',
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginVertical: 6,
    elevation: 2,
  },
  imagen: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  info: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  nombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  precio: {
    color: '#e85c1e',
    fontWeight: 'bold',
    marginTop: 4,
  },
  botonesFila: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  boton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  botonTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  vacio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vacioTexto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
  vacioSub: {
    marginTop: 6,
    color: '#888',
  },
});

export default FavoritosScreen;
