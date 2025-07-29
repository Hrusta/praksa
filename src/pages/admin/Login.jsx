import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import './Login.css';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/admin/products');
    } catch {
      setError('Invalid credentials.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Admin Login</h2>
        {error && <p className="login-error">{error}</p>}
        <div className="login-field">
          <label>Username</label>
          <input value={username} onChange={e => setUsername(e.target.value)} required/>
        </div>
        <div className="login-field">
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required/>
        </div>
        <button type="submit" className="login-button">Login</button>
        <p className="login-footer">
          No account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}
