import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const OrderContext = createContext();

export function OrderProvider({ children }) {
  const { isAuthenticated } = useContext(AuthContext);
  const location = useLocation();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!location.pathname.startsWith('/admin')) return;

    async function loadOrders() {
      try {
        const res = await api.get('/orders');
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to load orders:', err);
      }
    }

    loadOrders();
  }, [isAuthenticated, location.pathname]);

  const createOrder = async orderPayload => {
    const res = await api.post('/orders', orderPayload);
    return res.data;
  };

  const updateOrderStatus = async (id, status) => {
    const res = await api.patch(`/orders/${id}`, { status });
    setOrders(prev => prev.map(o => (o.id === id ? res.data : o)));
  };

  return (
    <OrderContext.Provider value={{ orders, createOrder, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
}
