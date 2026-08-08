import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productService } from '../services/productService';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await productService.list();
        setProducts(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load products');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Products</h1>
        {user?.role === 'Admin' ? <Link className="button primary" to="/products/new">Add Product</Link> : null}
      </div>
      <div className="panel">
        {loading ? <div>Loading...</div> : error ? <div>{error}</div> : products.length === 0 ? <div>No products found.</div> : (
          <table>
            <thead><tr><th>Product</th><th>SKU</th><th>Category</th><th>Price</th><th>Current Stock</th><th>Minimum Stock</th><th>Warehouse</th><th>Status</th></tr></thead>
            <tbody>{products.map((product) => <tr key={product.id}><td>{product.name}</td><td>{product.sku}</td><td>{product.category}</td><td>{product.unitPrice}</td><td>{product.currentStock}</td><td>{product.minimumStock}</td><td>{product.warehouse}</td><td>{product.currentStock <= product.minimumStock ? 'Low Stock' : 'In Stock'}</td></tr>)}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}
