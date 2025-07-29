import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { OrderContext } from '../../contexts/OrderContext';
import './OrderDetail.css';

export default function OrderDetail() {
  const { id } = useParams();
  const { orders, updateOrderStatus } = useContext(OrderContext);
  const navigate = useNavigate();
  const order = orders.find(o=>o.id===parseInt(id,10));
  if (!order) return <p>Order not found.</p>;

  return (
    <div className="order-detail-page">
      <h2>Order #{order.id}</h2>
      <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <h3>Items</h3>
      <ul>{order.items.map((i,idx)=><li key={idx}>{i.name} x{i.qty} — {i.price}€/item</li>)}</ul>
      <p><strong>Total:</strong> {order.totalPrice.toFixed(2)} €</p>
      <h3>Customer</h3>
      <p>{order.customer.name} {order.customer.surname}</p>
      <p>{order.customer.address}</p>
      <p>{order.customer.phone}</p>
      {order.customer.email && <p>{order.customer.email}</p>}
      <div className="status-buttons">
        <button onClick={()=>updateOrderStatus(order.id,'Accepted')}>Accept</button>
        <button onClick={()=>updateOrderStatus(order.id,'Rejected')}>Reject</button>
        <button onClick={()=>updateOrderStatus(order.id,'Finished')}>Complete</button>
      </div>
      <button className="back-btn" onClick={()=>navigate('/admin/orders')}>&larr; Back</button>
    </div>
);
}
