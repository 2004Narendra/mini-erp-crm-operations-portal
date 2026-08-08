import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productService } from '../services/productService';

export default function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', sku: '', category: '', unitPrice: 0, currentStock: 0, minimumStock: 0, warehouse: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const product = await productService.get(id);
      setForm({
        name: product.name || '',
        sku: product.sku || '',
        category: product.category || '',
        unitPrice: product.unitPrice || 0,
        currentStock: product.currentStock || 0,
        minimumStock: product.minimumStock || 0,
        warehouse: product.warehouse || '',
      });
    };
    load();
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (id) await productService.update(id, form); else await productService.create(form);
      navigate('/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save product');
    }
  };

  return (
    <div>
      <h1>{id ? 'Edit Product' : 'Add Product'}</h1>
      <form onSubmit={handleSubmit} className="panel form-grid">
        <label>Product Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
        <label>SKU<input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required /></label>
        <label>Category<input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required /></label>
        <label>Unit Price<input type="number" value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: Number(e.target.value) })} /></label>
        <label>Current Stock<input type="number" value={form.currentStock} onChange={(e) => setForm({ ...form, currentStock: Number(e.target.value) })} /></label>
        <label>Minimum Stock<input type="number" value={form.minimumStock} onChange={(e) => setForm({ ...form, minimumStock: Number(e.target.value) })} /></label>
        <label>Warehouse<input value={form.warehouse} onChange={(e) => setForm({ ...form, warehouse: e.target.value })} /></label>
        {error ? <div className="error full">{error}</div> : null}
        <button className="button primary full" type="submit">Save</button>
      </form>
    </div>
  );
}
