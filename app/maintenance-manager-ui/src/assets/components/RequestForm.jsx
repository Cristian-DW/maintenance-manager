import { useState } from 'react';
import api from '../api';

export default function RequestForm({ onCreated }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'Normal',
    assignedTo: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('MaintenanceRequests', form);
    onCreated();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h3>Nueva Solicitud</h3>
      <input name="title" placeholder="Título" onChange={handleChange} required />
      <textarea name="description" placeholder="Descripción" onChange={handleChange} />
      <input name="assignedTo" placeholder="Asignar a" onChange={handleChange} />
      <select name="priority" onChange={handleChange}>
        <option>Normal</option>
        <option>Alta</option>
        <option>Baja</option>
      </select>
      <button type="submit">Guardar</button>
    </form>
  );
}