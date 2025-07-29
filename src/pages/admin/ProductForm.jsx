import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProductContext } from '../../contexts/ProductContext';
import './ProductForm.css';

export default function ProductForm() {
  const { id } = useParams();
  const { products, createProduct, updateProduct } = useContext(ProductContext);
  const navigate = useNavigate();
  const edit = Boolean(id);
  const existing = products.find(p => p.id === parseInt(id, 10)) || {};

  const [form, setForm] = useState({
    name: existing.name || '',
    description: existing.description || '',
    imageUrl: existing.imageUrl || '',
    quantity: existing.quantity || 0,
    price: existing.price || 0,
  });

  useEffect(() => {
    if (edit && existing.id) {
      setForm({
        name: existing.name,
        description: existing.description,
        imageUrl: existing.imageUrl,
        quantity: existing.quantity,
        price: existing.price,
      });
    }
  }, [edit, existing]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity'
        ? parseFloat(value)
        : value,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const payload = {
      id: edit ? existing.id : Date.now(),
      ...form,
      createdAt: edit
        ? existing.createdAt
        : new Date().toISOString().split('T')[0],
    };
    if (edit) {
      updateProduct(payload);
    } else {
      createProduct(payload);
    }
    navigate('/admin/products');
  };

  return (
    <div className="product-form-page">
      <h2>{edit ? 'Edit' : 'New'} Product</h2>
      <form onSubmit={handleSubmit} className="product-form">
        {['name', 'description', 'imageUrl', 'quantity', 'price'].map(field => (
          <div key={field} className="field-group">
            <label>
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              name={field}
              type={field === 'quantity' || field === 'price' ? 'number' : 'text'}
              value={form[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button type="submit" className="btn-submit">
          Save
        </button>
      </form>
    </div>
  );
}
