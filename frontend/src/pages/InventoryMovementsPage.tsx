import { useEffect, useState } from 'react';
import { inventoryService } from '../services/inventoryService';

export default function InventoryMovementsPage() {
  const [movements, setMovements] = useState<any[]>([]);
  useEffect(() => {
    inventoryService.movements().then((data) => setMovements(data || [])).catch(() => setMovements([]));
  }, []);

  return (
    <div>
      <h1>Stock Movements</h1>
      <div className="panel">
        <table>
          <thead><tr><th>Product</th><th>Quantity</th><th>Type</th><th>Reason</th><th>Created By</th><th>Date</th></tr></thead>
          <tbody>{movements.map((movement) => <tr key={movement.id}><td>{movement.product?.name}</td><td>{movement.quantity}</td><td>{movement.movementType}</td><td>{movement.reason}</td><td>{movement.createdBy?.name}</td><td>{new Date(movement.createdAt).toLocaleString()}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
