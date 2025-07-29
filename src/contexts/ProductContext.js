import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const ProductContext = createContext();

export function ProductProvider({ children }) {
  const { isAuthenticated } = useContext(AuthContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/products');
        setProducts(res.data);
      } catch {}
    }
    load();
  }, [isAuthenticated]);

  const createProduct = async p => {
    const res = await api.post('/products', p);
    setProducts(prev => [...prev, res.data]);
  };
  const updateProduct = async p => {
    const res = await api.put(`/products/${p.id}`, p);
    setProducts(prev => prev.map(x => x.id===p.id?res.data:x));
  };
  const deleteProduct = async id => {
    await api.delete(`/products/${id}`);
    setProducts(prev => prev.filter(x=>x.id!==id));
  };

  return (
    <ProductContext.Provider value={{ products, createProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
}
