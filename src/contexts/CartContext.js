import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = item => {
    setCartItems(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) {
        return prev.map(i =>
          i.id === item.id ? { ...i, qty: i.qty + item.qty } : i
        );
      } else {
        return [...prev, { ...item }];
      }
    });
  };

  const updateCartItem = (id, qty) => {
    setCartItems(prev =>
      prev.map(i => (i.id === id ? { ...i, qty } : i))
    );
  };

  const removeFromCart = id => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateCartItem,
        updateQty: updateCartItem, 
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
