import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { challanService } from '../services/challanService';
import { customerService } from '../services/customerService';
import { productService } from '../services/productService';

export default function ChallanFormPage() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState([{ productId: '', productName: '', sku: '', unitPrice: 0, quantity: 1 }]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const [customerData, productData] = await Promise.all([customerService.list(), productService.list()]);
      setCustomers(customerData.customers || []);
      setProducts(productData || []);
    };
    load();
  }, []);

  const addRow = () => setItems([...items, { productId: '', productName: '', sku: '', unitPrice: 0, quantity: 1 }]);

  const updateRow = (index: number, key: string, value: string | number) => {
    const next = [...items];
    const product = products.find((p) => p.id === value);
    next[index] = { ...next[index], [key]: value, ...(key === 'productId' && product ? { productName: product.name, sku: product.sku, unitPrice: product.unitPrice } : {}) } as any;
    setItems(next);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await challanService.create({ customerId, items });
      navigate('/challans');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create challan');
    }
  };

  return (
    <div>
      <h1>Create Challan</h1>
      <form onSubmit={handleSubmit} className="panel form-grid">
        <label>Customer<select value={customerId} onChange={(e) => setCustomerId(e.target.value)} required><option value="">Select customer</option>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}</select></label>
        {items.map((item, index) => (
          <div key={index} className="row-grid">
            <select value={item.productId} onChange={(e) => updateRow(index, 'productId', e.target.value)} required>
              <option value="">Select product</option>
              {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
            </select>
            <input type="number" min="1" value={item.quantity} onChange={(e) => updateRow(index, 'quantity', Number(e.target.value))} />
          </div>
        ))}
        <button type="button" className="button" onClick={addRow}>Add Row</button>
        {error ? <div className="error full">{error}</div> : null}
        <button className="button primary full" type="submit">Save</button>
      </form>
    </div>
  );
}
