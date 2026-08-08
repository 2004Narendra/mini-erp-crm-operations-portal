import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { customerService } from '../services/customerService';

export default function CustomerDetailPage() {
  const { id } = useParams();
  const [customer, setCustomer] = useState<any>(null);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();
  const canAddFollowUp = user?.role === 'Admin' || user?.role === 'Sales';

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const data = await customerService.get(id);
      setCustomer(data);
    };
    load();
  }, [id]);

  const handleAddNote = async () => {
    if (!id) return;
    try {
      const newNote = await customerService.addFollowUp(id, note);
      setCustomer((prev: any) => ({ ...prev, followUps: [newNote, ...(prev?.followUps || [])] }));
      setNote('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to add note');
    }
  };

  if (!customer) return <div>Loading...</div>;

  return (
    <div>
      <h1>{customer.name}</h1>
      <div className="card-grid">
        <div className="card"><h3>Status</h3><p>{customer.status}</p></div>
        <div className="card"><h3>Follow-up Date</h3><p>{customer.followUpDate ? new Date(customer.followUpDate).toLocaleDateString() : '-'}</p></div>
      </div>
      <div className="panel">
        <h3>Customer Information</h3>
        <p><strong>Business:</strong> {customer.businessName}</p>
        <p><strong>Mobile:</strong> {customer.mobile}</p>
        <p><strong>Email:</strong> {customer.email || '-'}</p>
        <p><strong>Notes:</strong> {customer.notes || '-'}</p>
      </div>
      {canAddFollowUp ? (
        <div className="panel">
          <h3>Add Follow-up Note</h3>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} />
          {error ? <div className="error">{error}</div> : null}
          <button className="button primary" onClick={handleAddNote}>Save Note</button>
        </div>
      ) : null}
      <div className="panel">
        <h3>Previous Follow-ups</h3>
        {customer.followUps?.length ? customer.followUps.map((item: any) => <div key={item.id} className="note-item">{item.note}</div>) : <div>No notes yet.</div>}
      </div>
    </div>
  );
}
