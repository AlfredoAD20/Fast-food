import React, { createContext, useContext, useState } from 'react';

// 🛒 1️⃣ Crear contexto del carrito
const CartContext = createContext();

// 🧩 2️⃣ Proveedor global del carrito
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);

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

    // ⭐ Alternar favorito (agregar / quitar)
    const toggleFavorite = (product) => {
      setFavorites((prevFavs) => {
        const exists = prevFavs.find((item) => item._id === product._id);
        if (exists) {
          // si ya está, lo quitamos
          return prevFavs.filter((item) => item._id !== product._id);
        }
        // si no está, lo agregamos
        return [...prevFavs, product];
      });
    };

    // ✔️ Saber si un producto es favorito
  const isFavorite = (id) => {
    return favorites.some((item) => item._id === id);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        favorites,
        addToCart,
        removeFromCart,
        clearCart,
        getTotal,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// 🧠 3️⃣ Hook personalizado para acceder fácilmente
export const useCart = () => useContext(CartContext);
