import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { challanService } from '../services/challanService';

export default function ChallanDetailPage() {
  const { id } = useParams();
  const [challan, setChallan] = useState<any>(null);
  const [error, setError] = useState('');

  const load = async () => {
    if (!id) return;
    const data = await challanService.get(id);
    setChallan(data);
  };

  useEffect(() => { load(); }, [id]);

  const { user } = useAuth();
  const canManage = user?.role === 'Admin' || user?.role === 'Sales';

  const handleConfirm = async () => {
    try {
      if (!id) return;
      const data = await challanService.confirm(id);
      setChallan(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to confirm challan');
    }
  };

  const handleCancel = async () => {
    try {
      if (!id) return;
      const data = await challanService.cancel(id);
      setChallan(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to cancel challan');
    }
  };

  if (!challan) return <div>Loading...</div>;

  return (
    <div>
      <h1>{challan.challanNumber}</h1>
      <div className="panel">
        <p><strong>Customer:</strong> {challan.customer?.name}</p>
        <p><strong>Status:</strong> {challan.status}</p>
        <p><strong>Total Quantity:</strong> {challan.totalQuantity}</p>
        {error ? <div className="error">{error}</div> : null}
        {canManage && challan.status === 'Draft' ? (
          <div>
            <button className="button primary" onClick={handleConfirm}>Confirm</button>
            <button className="button" onClick={handleCancel}>Cancel</button>
          </div>
        ) : null}
      </div>
      <div className="panel">
        <table>
          <thead><tr><th>Product</th><th>SKU</th><th>Unit Price</th><th>Quantity</th><th>Total</th></tr></thead>
          <tbody>{challan.items?.map((item: any) => <tr key={item.id}><td>{item.productName}</td><td>{item.sku}</td><td>{item.unitPrice}</td><td>{item.quantity}</td><td>{item.quantity * item.unitPrice}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
