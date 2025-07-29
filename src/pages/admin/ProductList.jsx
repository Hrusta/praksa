import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductContext } from '../../contexts/ProductContext';
import './ProductList.css';

export default function ProductList() {
  const { products, deleteProduct } = useContext(ProductContext);
  const [filter, setFilter] = useState({ name: '', minPrice: '', maxPrice: '' });
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = products
    .filter(p =>
      p.name.toLowerCase().includes(filter.name.toLowerCase()) &&
      (filter.minPrice === '' || p.price >= parseFloat(filter.minPrice)) &&
      (filter.maxPrice === '' || p.price <= parseFloat(filter.maxPrice))
    )
    .sort((a, b) =>
      sortAsc
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt)
    );

  return (
    <div className="product-list-page">
      <h2>Products</h2>
      <div className="controls">
        <input
          placeholder="Search name"
          value={filter.name}
          onChange={e => setFilter(f => ({ ...f, name: e.target.value }))}
        />
        <input
          type="number"
          placeholder="Min price"
          value={filter.minPrice}
          onChange={e => setFilter(f => ({ ...f, minPrice: e.target.value }))}
        />
        <input
          type="number"
          placeholder="Max price"
          value={filter.maxPrice}
          onChange={e => setFilter(f => ({ ...f, maxPrice: e.target.value }))}
        />
        <button onClick={() => setSortAsc(!sortAsc)}>
          Sort by Date {sortAsc ? '↑' : '↓'}
        </button>
        <Link to="/admin/products/new" className="btn-new1">
          New Product
        </Link>
      </div>

      <ul className="product-list">
        {filtered.map(p => (
          <li key={p.id}>
            <Link to={`/admin/products/${p.id}`}>{p.name}</Link>
            <span>{p.price} €</span>
            <button onClick={() => deleteProduct(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
