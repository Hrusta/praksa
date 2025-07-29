import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductContext } from '../../contexts/ProductContext';
import './ShopHome.css';

export default function ShopHome() {
  const { products } = useContext(ProductContext);
  const [filter, setFilter] = useState('');
  const [sortAsc, setSortAsc] = useState(true);

  const list = products
    .filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
    .sort((a,b)=> sortAsc
      ? a.price - b.price
      : b.price - a.price
    );

  return (
    <div className="shop-home">
      <div className="shop-controls">
        <input
          placeholder="Search products"
          value={filter}
          onChange={e=>setFilter(e.target.value)}
        />
        <button style={{ marginRight: '0.5rem' }} onClick={()=>setSortAsc(!sortAsc)}>
          Price {sortAsc ? '↑' : '↓'}
        </button>
      </div>
      <ul className="shop-list">
        {list.map(p=>(
          <li key={p.id}>
            <Link to={`/products/${p.id}`}>
              <img src={p.imageUrl} alt={p.name} />
              <h3>{p.name}</h3>
              <p>{p.price} €</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
