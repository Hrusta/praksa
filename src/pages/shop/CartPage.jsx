import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../contexts/CartContext';
import './CartPage.css';

export default function CartPage() {
  const { cartItems, updateQty, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleProceed = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <h2>Your Cart</h2>
        <p className="empty-message">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      <ul className="cart-list">
        {cartItems.map(i => (
          <li key={i.id}>
            <span className="item-name">{i.name}</span>
            <input
              type="number"
              className="item-qty"
              min="1"
              value={i.qty}
              onChange={e => updateQty(i.id, parseInt(e.target.value, 10))}
            />
            <span className="item-price">
              {(i.qty * i.price).toFixed(2)} €
            </span>
            <button
              className="item-remove"
              onClick={() => removeFromCart(i.id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <button className="btn-checkout" onClick={handleProceed}>
        Proceed to Checkout
      </button>
    </div>
  );
}
