import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { OrderContext } from '../../contexts/OrderContext';
import './OrderList.css';

export default function OrderList() {
  const { orders } = useContext(OrderContext);

  return (
    <div className="order-list-page">
      <h2>Orders</h2>
      <ul>
        {orders.map(o => (
          <li key={o.id}>
            <Link to={`/admin/orders/${o.id}`}>#{o.id}</Link>
            <span>{new Date(o.createdAt).toLocaleString()}</span>
            <span>{o.status}</span>
          </li>
        ))}
      </ul>
    </div>
);
}
