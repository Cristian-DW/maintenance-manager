import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:4004/mm/Users';

const roles = [
  { value: 'MANAGER', label: 'Manager' },
  { value: 'TECH', label: 'Técnico' },
  { value: 'REQUESTER', label: 'Solicitante' }
];

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', role: 'REQUESTER' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setUsers(res.data.value || []);
      setError('');
    } catch (err) {
      setError('Error al cargar usuarios');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Create user
  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(API_URL, form);
      setForm({ name: '', email: '', role: 'REQUESTER' });
      fetchUsers();
    } catch (err) {
      setError('Error al crear usuario');
    }
    setLoading(false);
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return;
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchUsers();
    } catch (err) {
      setError('Error al eliminar usuario');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Usuarios</h2>
      <form className="mb-6 flex flex-col gap-2" onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Nombre"
          className="border p-2 rounded"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          required
        />
        <select
          className="border p-2 rounded"
          value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })}
        >
          {roles.map(r => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          Crear usuario
        </button>
      </form>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Nombre</th>
            <th className="p-2">Email</th>
            <th className="p-2">Rol</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.ID} className="border-t">
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.role}</td>
              <td className="p-2">
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                  onClick={() => handleDelete(u.ID)}
                  disabled={loading}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
