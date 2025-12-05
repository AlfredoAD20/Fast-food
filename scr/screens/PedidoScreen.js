import React, { useState } from 'react';
import { SafeAreaView } from "react-native";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useCart } from '../CartContext';
import { API_URL } from '@env';

const PedidoScreen = () => {
  const { cart, addToCart, removeFromCart, clearCart, getTotal } = useCart();
  const [enviando, setEnviando] = useState(false); 

  const handleConfirmarPedido = async () => {
    if (cart.length === 0) {
      Alert.alert('Carrito vacío', 'Agrega productos antes de confirmar el pedido.');
      return;
    }
    try {
      setEnviando(true);

      // armamos el payload para la API
      const productos = cart.map((item) => ({
        productoId: item._id,
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.quantity,
      }));
      const respuesta = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productos }),
      });

      if (!respuesta.ok) {
        throw new Error('Error al enviar pedido');
      }

      const data = await respuesta.json();
      //console.log('Pedido guardado:', data);

      clearCart();

      Alert.alert(
        '¡Pedido confirmado! 🎉',
        'Tu pedido se ha registrado correctamente.'
      );
    } catch (error) {
      console.error(error);
      Alert.alert(
        'Error',
        'No se pudo confirmar el pedido. Verifica tu conexión a la API.'
      );
    } finally {
      setEnviando(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
            {item.imagen ? (
        <Image source={{ uri: item.imagen }} style={styles.imagen} />
      ) : (
        <View style={[styles.imagen, styles.imagenPlaceholder]}>
          <Text>Sin imagen</Text>
        </View>
      )}
      <View style={styles.detalles}>
        <Text style={styles.nombre}>{item.nombre}</Text>
        <Text style={styles.precio}>${item.precio}</Text>

        {/* 🔸 Controles de cantidad */}
        <View style={styles.cantidadContainer}>
          <TouchableOpacity
            onPress={() => removeFromCart(item._id)}
            style={styles.botonCantidad}
          >
            <Text style={styles.textoBoton}>➖</Text>
          </TouchableOpacity>

          <Text style={styles.cantidad}>{item.quantity}</Text>

          <TouchableOpacity
            onPress={() => addToCart(item)}
            style={styles.botonCantidad}
          >
            <Text style={styles.textoBoton}>➕</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Tu Pedido</Text>

      {cart.length === 0 ? (
        <View style={styles.vacio}>
          <Text style={styles.vacioTexto}>Tu carrito está vacío</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={styles.lista}
          />

          {/* 💰 Total y botones */}
          <View style={styles.totalContainer}>
            <Text style={styles.totalTexto}>
              Total: ${getTotal().toFixed(2)}
            </Text>

            <TouchableOpacity
              style={[styles.boton, { backgroundColor: '#FF7F50' }]}
              onPress={handleConfirmarPedido}
              disabled={enviando}
            >
              {enviando ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.botonTexto}>Confirmar Pedido</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.boton, { backgroundColor: '#aaa' }]}
              onPress={clearCart}
              disabled={enviando}
            >
              <Text style={styles.botonTexto}>Vaciar Carrito</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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
    marginVertical: 10,
  },
  lista: {
    paddingBottom: 100,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imagen: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  imagenPlaceholder: {
    backgroundColor: '#ffe6cc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detalles: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  nombre: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  precio: {
    color: '#e85c1e',
    fontWeight: 'bold',
    marginTop: 4,
  },
  cantidadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  botonCantidad: {
    backgroundColor: '#ffe6cc',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  textoBoton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e85c1e',
  },
  cantidad: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  totalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    alignItems: 'center',
  },
  totalTexto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  boton: {
    width: '90%',
    paddingVertical: 10,
    borderRadius: 10,
    marginVertical: 5,
    alignItems: 'center',
  },
  botonTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  vacio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vacioTexto: {
    color: '#888',
    fontSize: 16,
  },
});

export default PedidoScreen;
