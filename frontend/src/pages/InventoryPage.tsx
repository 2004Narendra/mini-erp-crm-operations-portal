import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { inventoryService } from '../services/inventoryService';

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  useEffect(() => {
    inventoryService.list().then((data) => setProducts(data || [])).catch(() => setProducts([]));
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Inventory</h1>
        <div>
          <Link className="button" to="/inventory/movements">View Movements</Link>
          <Link className="button" to="/inventory/low-stock">Low Stock</Link>
        </div>
      </div>
      <div className="panel">
        <table>
          <thead><tr><th>Product</th><th>SKU</th><th>Current Stock</th><th>Minimum Stock</th><th>Warehouse</th><th>Status</th></tr></thead>
          <tbody>{products.map((product) => <tr key={product.id}><td>{product.name}</td><td>{product.sku}</td><td>{product.currentStock}</td><td>{product.minimumStock}</td><td>{product.warehouse}</td><td>{product.currentStock <= product.minimumStock ? 'Low Stock' : 'Healthy'}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
