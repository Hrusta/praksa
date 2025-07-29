import React, { useContext } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { CartContext } from '../../contexts/CartContext';
import './ShopLayout.css';

export default function ShopLayout() {
  const { cartItems } = useContext(CartContext);
  const totalQty = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="shop-layout">
      <header className="shop-header">
        <div className="container">
          <NavLink to="/" end>
                <h1 className="shop-logo">Mini Shop</h1>
              </NavLink>
          
          <ul className="shop-nav">
           
            <li>
              <NavLink to="/cart">
                Cart ({totalQty})
              </NavLink>
            </li>
          </ul>
        </div>
      </header>
      <main className="shop-content">
        <Outlet />
      </main>
    </div>
  );
}
