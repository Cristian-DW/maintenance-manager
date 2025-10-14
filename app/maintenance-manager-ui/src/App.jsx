import { useState } from 'react';
import RequestList from './components/RequestList';
import RequestForm from './components/RequestForm';

export default function App() {
  const [reload, setReload] = useState(false);
  return (
    <div>
      <h1>Gestor de Solicitudes de Mantenimiento</h1>
      <RequestForm onCreated={() => setReload(!reload)} />
      <RequestList key={reload} />
    </div>
  );
}