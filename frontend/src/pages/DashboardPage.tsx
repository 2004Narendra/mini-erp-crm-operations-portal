import { useEffect, useState } from 'react';
import { customerService } from '../services/customerService';
import { productService } from '../services/productService';
import { inventoryService } from '../services/inventoryService';
import { challanService } from '../services/challanService';

export default function DashboardPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [challans, setChallans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [customerResp, productResp, lowStockResp, challanResp] = await Promise.all([
          customerService.list(),
          productService.list(),
          inventoryService.lowStock(),
          challanService.list(),
        ]);
        setCustomers(customerResp.customers || []);
        setProducts(productResp || []);
        setLowStock(lowStockResp || []);
        setChallans(challanResp.challans || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="panel">Loading...</div>;
  if (error) return <div className="panel">{error}</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="card-grid">
        <div className="card"><h3>Total Customers</h3><p>{customers.length}</p></div>
        <div className="card"><h3>Active Customers</h3><p>{customers.filter((c) => c.status === 'Active').length}</p></div>
        <div className="card"><h3>Total Products</h3><p>{products.length}</p></div>
        <div className="card"><h3>Current Stock</h3><p>{products.reduce((sum, p) => sum + p.currentStock, 0)}</p></div>
        <div className="card"><h3>Low Stock Products</h3><p>{lowStock.length}</p></div>
        <div className="card"><h3>Draft Challans</h3><p>{challans.filter((c) => c.status === 'Draft').length}</p></div>
      </div>
      <div className="panel">
        <h3>Recent Customers</h3>
        <table>
          <thead><tr><th>Customer</th><th>Business</th><th>Type</th><th>Status</th><th>Follow-up Date</th></tr></thead>
          <tbody>{customers.slice(0, 5).map((customer) => <tr key={customer.id}><td>{customer.name}</td><td>{customer.businessName}</td><td>{customer.customerType}</td><td>{customer.status}</td><td>{customer.followUpDate ? new Date(customer.followUpDate).toLocaleDateString() : '-'}</td></tr>)}</tbody>
        </table>
      </div>
      <div className="panel">
        <h3>Recent Challans</h3>
        <table>
          <thead><tr><th>Challan Number</th><th>Customer</th><th>Quantity</th><th>Status</th><th>Created Date</th></tr></thead>
          <tbody>{challans.slice(0, 5).map((challan) => <tr key={challan.id}><td>{challan.challanNumber}</td><td>{challan.customer?.name || '-'}</td><td>{challan.totalQuantity}</td><td>{challan.status}</td><td>{new Date(challan.createdAt).toLocaleDateString()}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
