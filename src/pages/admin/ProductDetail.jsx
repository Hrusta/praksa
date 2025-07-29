import React, { useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ProductContext } from '../../contexts/ProductContext';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const { products, deleteProduct } = useContext(ProductContext);
  const navigate = useNavigate();
  const p = products.find(x => x.id === parseInt(id, 10));
  if (!p) return <p>Product not found.</p>;

  return (
    <div className="product-detail-page">
      <h2 className="pd-title">{p.name}</h2>
      <div className="pd-image-wrapper">
        <img src={p.imageUrl} alt={p.name} />
      </div>
      <div className="pd-info">
        <p className="pd-desc">{p.description}</p>
        <p className="pd-meta"><strong>Price:</strong> {p.price.toFixed(2)} €</p>
        <p className="pd-meta"><strong>Quantity:</strong> {p.quantity}</p>
      </div>
      <div className="pd-actions">
        <Link to={`/admin/products/edit/${p.id}`} className="btn-edit">
          Edit
        </Link>
        <button
          onClick={() => {
            deleteProduct(p.id);
            navigate('/admin/products');
          }}
          className="btn-delete"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
