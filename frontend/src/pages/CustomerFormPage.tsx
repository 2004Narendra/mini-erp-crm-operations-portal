import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { customerService } from '../services/customerService';

export default function CustomerFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', mobile: '', email: '', businessName: '', gstNumber: '', customerType: 'Wholesale', address: '', status: 'Active', followUpDate: '', notes: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const customer = await customerService.get(id);
      setForm({
        name: customer.name || '',
        mobile: customer.mobile || '',
        email: customer.email || '',
        businessName: customer.businessName || '',
        gstNumber: customer.gstNumber || '',
        customerType: customer.customerType || 'Wholesale',
        address: customer.address || '',
        status: customer.status || 'Active',
        followUpDate: customer.followUpDate ? customer.followUpDate.slice(0, 10) : '',
        notes: customer.notes || '',
      });
    };
    load();
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (id) await customerService.update(id, form); else await customerService.create(form);
      navigate('/customers');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save customer');
    }
  };

  return (
    <div>
      <h1>{id ? 'Edit Customer' : 'Add Customer'}</h1>
      <form onSubmit={handleSubmit} className="panel form-grid">
        <label>Customer Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
        <label>Mobile<input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} required /></label>
        <label>Email<input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label>Business Name<input value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} /></label>
        <label>GST Number<input value={form.gstNumber} onChange={(e) => setForm({ ...form, gstNumber: e.target.value })} /></label>
        <label>Customer Type<select value={form.customerType} onChange={(e) => setForm({ ...form, customerType: e.target.value })}><option>Retail</option><option>Wholesale</option><option>Distributor</option></select></label>
        <label>Status<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option>Lead</option><option>Active</option><option>Inactive</option></select></label>
        <label>Follow-up Date<input type="date" value={form.followUpDate} onChange={(e) => setForm({ ...form, followUpDate: e.target.value })} /></label>
        <label className="full">Address<textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></label>
        <label className="full">Notes<textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></label>
        {error ? <div className="error full">{error}</div> : null}
        <button className="button primary full" type="submit">Save</button>
      </form>
    </div>
  );
}
