import React, { useState } from 'react';
import { useAuth } from '../../auth';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState(() => ({ name: user?.name || '', email: user?.email || '' }));
  const [status, setStatus] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setStatus('saving');
    const res = await updateProfile({ name: form.name, email: form.email });
    if (res.ok) setStatus('saved');
    else setStatus(res.message || 'error');
  };

  if (!user) return <div className="text-sm text-gray-500">No hay usuario conectado.</div>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Mi perfil</h2>
      <form onSubmit={handleSave} className="flex flex-col gap-3">
        <label className="text-sm text-gray-600">Nombre</label>
        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="border p-2 rounded" />
        <label className="text-sm text-gray-600">Email</label>
        <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="border p-2 rounded" />
        <div className="flex items-center gap-2 justify-end">
          <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded">Guardar</button>
        </div>
        {status === 'saving' && <div className="text-sm text-gray-500">Guardando...</div>}
        {status === 'saved' && <div className="text-sm text-green-600">Guardado</div>}
        {status && status !== 'saving' && status !== 'saved' && <div className="text-sm text-red-600">{status}</div>}
      </form>
    </div>
  );
}
