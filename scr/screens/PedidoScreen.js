import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useCart } from '../CartContext';

const PedidoScreen = () => {
  const { cart, addToCart, removeFromCart, clearCart, getTotal } = useCart();

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image source={{ uri: item.imagen }} style={styles.imagen} />
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
    <View style={styles.container}>
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
              onPress={() => alert('🧾 Pedido confirmado (demo)')}
            >
              <Text style={styles.botonTexto}>Confirmar Pedido</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.boton, { backgroundColor: '#aaa' }]}
              onPress={clearCart}
            >
              <Text style={styles.botonTexto}>Vaciar Carrito</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffaf2',
    paddingHorizontal: 15,
    paddingTop: 10,
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
