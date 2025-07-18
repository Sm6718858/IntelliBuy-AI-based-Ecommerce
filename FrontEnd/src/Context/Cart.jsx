import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const Cart = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const existingCart = localStorage.getItem('cart');
    if (existingCart) {
      setCart(JSON.parse(existingCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  return (
    <CartContext.Provider value={[cart, setCart]}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => useContext(CartContext);

export { Cart, useCart };
