import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { customerService } from '../services/customerService';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCustomers = async (query = '') => {
    setLoading(true);
    try {
      const response = await customerService.list(query);
      setCustomers(response.customers || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCustomers(); }, []);

  const { user } = useAuth();

  return (
    <div>
      <div className="page-header">
        <h1>Customers</h1>
        {(user?.role === 'Admin' || user?.role === 'Sales') ? <Link className="button primary" to="/customers/new">Add Customer</Link> : null}
      </div>
      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, mobile, business" />
      <button onClick={() => loadCustomers(search)} className="button">Search</button>
      <div className="panel">
        {loading ? <div>Loading...</div> : error ? <div>{error}</div> : customers.length === 0 ? <div>No customers found.</div> : (
          <table>
            <thead><tr><th>Name</th><th>Business</th><th>Type</th><th>Status</th><th>Follow-up</th><th>Actions</th></tr></thead>
            <tbody>{customers.map((customer) => <tr key={customer.id}><td>{customer.name}</td><td>{customer.businessName}</td><td>{customer.customerType}</td><td>{customer.status}</td><td>{customer.followUpDate ? new Date(customer.followUpDate).toLocaleDateString() : '-'}</td><td><Link to={`/customers/${customer.id}`}>View</Link></td></tr>)}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}
