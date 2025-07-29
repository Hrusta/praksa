import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../contexts/CartContext';
import { OrderContext } from '../../contexts/OrderContext';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const { cartItems, clearCart } = useContext(CartContext);
  const { createOrder } = useContext(OrderContext);
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    name:'', surname:'', address:'', phone:'', email:''
  });
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setCustomer(c=>({...c,[name]:value}));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!customer.name||!customer.surname||!customer.address||!customer.phone) {
      setError('Please fill in all required fields.');
      return;
    }
    const payload={
      id:Date.now(),
      items:cartItems.map(i=>({id:i.id,name:i.name,qty:i.qty,price:i.price})),
      createdAt:new Date().toISOString(),
      customer, status:'Accepted'
    };
    try {
      await createOrder(payload);
      setShowToast(true);
      setTimeout(()=>{
        setShowToast(false);
        clearCart();
        navigate('/');
      },2000);
    } catch {
      setError('Failed to place order.');
    }
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      <form className="checkout-form" onSubmit={handleSubmit}>
        {error&&<p className="error">{error}</p>}
        {['name','surname','address','phone','email'].map(f=>(
          <div key={f} className="field-group">
            <label>{f.charAt(0).toUpperCase()+f.slice(1)}{f!=='email'&&'*'}</label>
            <input
              name={f}
              type={f==='email'?'email':'text'}
              value={customer[f]}
              onChange={handleChange}
              required={f!=='email'}
            />
          </div>
        ))}
        <button type="submit" className="btn-submit">Confirm Order</button>
      </form>
      {showToast&&(
        <div className="toast-popup">
          ✅ Your order was placed successfully!
        </div>
      )}
    </div>
  );
}
