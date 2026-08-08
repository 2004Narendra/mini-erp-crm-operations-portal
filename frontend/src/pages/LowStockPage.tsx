import { useEffect, useState } from 'react';
import { inventoryService } from '../services/inventoryService';

export default function LowStockPage() {
  const [products, setProducts] = useState<any[]>([]);
  useEffect(() => {
    inventoryService.lowStock().then((data) => setProducts(data || [])).catch(() => setProducts([]));
  }, []);

  return (
    <div>
      <h1>Low Stock</h1>
      <div className="panel">
        <table>
          <thead><tr><th>Product</th><th>Current Stock</th><th>Minimum Stock</th><th>Warehouse</th></tr></thead>
          <tbody>{products.map((product) => <tr key={product.id}><td>{product.name}</td><td>{product.currentStock}</td><td>{product.minimumStock}</td><td>{product.warehouse}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
