import React, { createContext, useContext, useState } from 'react';

// 🛒 1️⃣ Crear contexto del carrito
const CartContext = createContext();

// 🧩 2️⃣ Proveedor global del carrito
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // ➕ Agregar producto al carrito
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item._id === product._id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // ➖ Eliminar producto
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== id));
  };

  // 🔄 Vaciar carrito
  const clearCart = () => setCart([]);

  // 💰 Calcular total
  const getTotal = () =>
    cart.reduce((sum, item) => sum + item.precio * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, getTotal }}
    >
      {children}
    </CartContext.Provider>
  );
};

// 🧠 3️⃣ Hook personalizado para acceder fácilmente
export const useCart = () => useContext(CartContext);
