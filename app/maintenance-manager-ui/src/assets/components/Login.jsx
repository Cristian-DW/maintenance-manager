import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await login({ email, password });
    if (res.ok) {
      navigate('/', { replace: true });
    } else {
      setError(res.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Iniciar sesión</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input value={email} onChange={e => setEmail(e.target.value)} className="border p-2 rounded" placeholder="Email" required />
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="border p-2 rounded" placeholder="Contraseña" required />
        {error && <div className="text-red-600">{error}</div>}
        <div className="flex justify-end">
          <button className="bg-primary-600 text-white px-4 py-2 rounded" type="submit">Entrar</button>
        </div>
      </form>
    </div>
  );
}
