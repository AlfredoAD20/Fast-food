import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator } from 'react-native';

const InicioScreen = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  
  const API_URL = 'http://192.168.1.72:3000/api/products';

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const respuesta = await fetch(API_URL);
        const data = await respuesta.json();
        setProductos(data);
      } catch (error) {
        console.error('Error al obtener productos:', error);
      } finally {
        setCargando(false);
      }
    };

    obtenerProductos();
  }, []);

  if (cargando) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#FF7F50" />
        <Text style={{ marginTop: 10 }}>Cargando menú...</Text>
      </View>
    );
  }
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.imagen ? (
        <Image
          source={{ uri: item.imagen }}
          style={styles.imagen}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.imagenPlaceholder}>
          <Text style={styles.placeholderText}>Sin imagen</Text>
        </View>
      )}
      <Text style={styles.nombre}>{item.nombre}</Text>
      <Text style={styles.precio}>${item.precio}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>🍔 Menú Fast Food</Text>
      <FlatList
        data={productos}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.lista}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffaf2',
    paddingHorizontal: 10,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e85c1e',
    textAlign: 'center',
    marginVertical: 15,
  },
  lista: {
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    flex: 1,
    margin: 8,
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  imagen: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  imagenPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 10,
    backgroundColor: '#ffe6cc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  placeholderText: {
    color: '#ff7f50',
    fontWeight: 'bold',
  },
  nombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  precio: {
    color: '#ff7f50',
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 5,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default InicioScreen;