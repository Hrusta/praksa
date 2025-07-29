import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';


import Login from './pages/admin/Login';
import Register from './pages/admin/Register';
import RequireAuth from './components/RequireAuth';
import AdminLayout from './pages/admin/AdminLayout';
import ProductList from './pages/admin/ProductList';
import ProductForm from './pages/admin/ProductForm';
import ProductDetail from './pages/admin/ProductDetail';
import OrderList from './pages/admin/OrderList';
import OrderDetail from './pages/admin/OrderDetail';
import { OrderProvider } from './contexts/OrderContext';


import ShopLayout from './pages/shop/ShopLayout';
import ShopHome from './pages/shop/ShopHome';
import ShopProductDetail from './pages/shop/ShopProductDetail';
import CartPage from './pages/shop/CartPage';
import CheckoutPage from './pages/shop/CheckoutPage';

export default function App() {
  return (
    <Routes>
     
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      
      <Route path="/" element={<ShopLayout />}>
        <Route index element={<ShopHome />} />
        <Route path="products/:id" element={<ShopProductDetail />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
      </Route>

      
      <Route
        path="/admin/*"
        element={
          <RequireAuth>
            <OrderProvider>
              <AdminLayout />
            </OrderProvider>
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="products" replace />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/edit/:id" element={<ProductForm />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="orders" element={<OrderList />} />
        <Route path="orders/:id" element={<OrderDetail />} />
      </Route>

     
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
