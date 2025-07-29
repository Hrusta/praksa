import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ProductContext } from '../../contexts/ProductContext';
import { CartContext } from '../../contexts/CartContext';
import './ShopProductDetail.css';

export default function ShopProductDetail() {
  const { id } = useParams();
  const { products } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);

  const product = products.find(p => p.id === parseInt(id, 10));
  const [qty, setQty] = useState(1);

  if (!product) return <p>Product not found.</p>;

  const increase = () => setQty(q => q + 1);
  const decrease = () => setQty(q => Math.max(1, q - 1));

  const handleAdd = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      qty
    });
  };

  return (
    <div className="detail-page container">
      <div className="detail-card">
        <div className="main-image">
          <img src={product.imageUrl} alt={product.name} />
        </div>
        <div className="info">
          <h1 className="title">{product.name}</h1>
          <div className="price">{product.price.toFixed(2)} €</div>
          <p className="description">{product.description}</p>

          <div className="purchase">
            <div className="quantity-selector">
              <button onClick={decrease}>–</button>
              <input
                type="number"
                min="1"
                value={qty}
                onChange={e => setQty(Math.max(1, Number(e.target.value) || 1))}
              />
              <button onClick={increase}>+</button>
            </div>

            <button className="btn-add" onClick={handleAdd}>
              Add {qty} to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
