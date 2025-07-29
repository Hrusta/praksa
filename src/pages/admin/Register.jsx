import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import './Login.css';

export default function Register() {
  const { register } = useContext(AuthContext);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await register(username, password, adminUsername, adminPassword);
      navigate('/login');
    } catch {
      setError('Registration failed.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Admin Registration</h2>
        {error && <p className="login-error">{error}</p>}
        <div className="login-field">
          <label>Existing Admin Username</label>
          <input value={adminUsername} onChange={e => setAdminUsername(e.target.value)} required/>
        </div>
        <div className="login-field">
          <label>Existing Admin Password</label>
          <input type="password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} required/>
        </div>
        <div className="login-field">
          <label>New Username</label>
          <input value={username} onChange={e => setUsername(e.target.value)} required/>
        </div>
        <div className="login-field">
          <label>New Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required/>
        </div>
        <button type="submit" className="login-button">Register</button>
        <p className="login-footer">
          Have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
);
}
