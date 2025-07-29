import React, { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import './AdminLayout.css';

export default function AdminLayout() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <nav className="admin-menu">
        <div className="container">
           <NavLink
           className={({ isActive }) => ( '')}
                to="/admin/products"
              >
                 <h1 className="admin-logo">Admin Dashboard</h1>
              </NavLink>
         
          <ul>
            <li>
              <NavLink
                to="/admin/products"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Products
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/orders"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Orders
              </NavLink>
            </li>
           
            <li>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
