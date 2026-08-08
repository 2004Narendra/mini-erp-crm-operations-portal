import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { challanService } from '../services/challanService';

export default function ChallansPage() {
  const { user } = useAuth();
  const [challans, setChallans] = useState<any[]>([]);
  useEffect(() => {
    challanService.list().then((data) => setChallans(data.challans || [])).catch(() => setChallans([]));
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Sales Challans</h1>
        {(user?.role === 'Admin' || user?.role === 'Sales') ? <Link className="button primary" to="/challans/new">Create Challan</Link> : null}
      </div>
      <div className="panel">
        <table>
          <thead><tr><th>Challan Number</th><th>Customer</th><th>Total Quantity</th><th>Status</th><th>Created By</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>{challans.map((challan) => <tr key={challan.id}><td>{challan.challanNumber}</td><td>{challan.customer?.name}</td><td>{challan.totalQuantity}</td><td>{challan.status}</td><td>{challan.createdBy?.name}</td><td>{new Date(challan.createdAt).toLocaleDateString()}</td><td><Link to={`/challans/${challan.id}`}>View</Link></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
