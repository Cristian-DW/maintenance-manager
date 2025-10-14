import { useEffect, useState } from 'react';
import api from '../api';

export default function RequestList() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    api.get('MaintenanceRequests').then((res) => {
      setRequests(res.data.value);
    });
  }, []);

  return (
    <div className="p-4">
      <h2>Solicitudes de Mantenimiento</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Título</th>
            <th>Estado</th>
            <th>Prioridad</th>
            <th>Asignado a</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.ID}>
              <td>{r.title}</td>
              <td>{r.status}</td>
              <td>{r.priority}</td>
              <td>{r.assignedTo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}