import React, { useState } from 'react';
import { PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../../hooks/useQueries';

const roles = [
  { value: 'MANAGER', label: 'Manager' },
  { value: 'TECH', label: 'Técnico' },
  { value: 'REQUESTER', label: 'Solicitante' }
];

export default function UserList() {
  const [form, setForm] = useState({ name: '', email: '', role: 'REQUESTER' });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Use React Query hooks
  const { data: users = [], isLoading: loading, error: queryError, refetch } = useUsers();
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  const error = queryError?.message || null;

  const createUser = async (e) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync(form);
      setForm({ name: '', email: '', role: 'REQUESTER' });
      setIsFormOpen(false);
    } catch (err) {
      console.error('Error creating user:', err);
      alert('Error al crear usuario');
    }
  };

  const editUser = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      role: user.role
    });
    setIsFormOpen(true);
  };

  const updateUser = async (e) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync({ id: editingUser.ID, data: form });
      setForm({ name: '', email: '', role: 'REQUESTER' });
      setEditingUser(null);
      setIsFormOpen(false);
    } catch (err) {
      console.error('Error updating user:', err);
      alert('Error al actualizar usuario');
    }
  };

  const handleSubmit = (e) => {
    if (editingUser) {
      updateUser(e);
    } else {
      createUser(e);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingUser(null);
    setForm({ name: '', email: '', role: 'REQUESTER' });
  };

  const deleteUser = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Error al eliminar usuario');
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">Usuarios</h1>
          <p className="mt-2 text-sm text-gray-700">Gestiona usuarios: crea, lista y elimina usuarios del sistema.</p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700"
          >
            <PlusIcon className="h-5 w-5" />
            Nuevo Usuario
          </button>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg bg-white">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Nombre</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Rol</th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Acciones</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center">
                        <div className="flex justify-center items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                          <span className="ml-3 text-gray-600">Cargando usuarios...</span>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8">
                        <div className="p-4 text-red-700 bg-red-100 rounded-lg border border-red-300">
                          <p className="font-medium">Error al cargar los usuarios</p>
                          <p className="text-sm mt-1">{error}</p>
                          <button onClick={() => refetch()} className="mt-2 text-sm text-red-700 hover:text-red-900 underline">Reintentar</button>
                        </div>
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">No hay usuarios. Crea uno nuevo usando el botón "Nuevo Usuario".</td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.ID} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="font-medium text-gray-900">{u.name}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{u.email}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{u.role}</td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => editUser(u)}
                              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                              <PencilIcon className="h-4 w-4" />
                              Editar
                            </button>
                            <button
                              onClick={() => deleteUser(u.ID)}
                              className="inline-flex items-center gap-2 rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700"
                            >
                              <TrashIcon className="h-4 w-4" />
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={handleCloseForm} />
          <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h3 className="text-lg font-semibold">
              {editingUser ? 'Editar usuario' : 'Crear usuario'}
            </h3>
            <form className="mt-4 flex flex-col gap-3" onSubmit={handleSubmit}>
              <input
                className="border p-2 rounded-md"
                placeholder="Nombre"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                className="border p-2 rounded-md"
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <select
                className="border p-2 rounded-md"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>

              {!editingUser && (
                <input
                  className="border p-2 rounded-md"
                  placeholder="Contraseña"
                  type="password"
                  value={form.password || ''}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              )}

              <div className="mt-4 flex justify-end gap-2">
                <button type="button" onClick={handleCloseForm} className="rounded-md px-3 py-2 text-sm">Cancelar</button>
                <button type="submit" className="rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white">
                  {editingUser ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
