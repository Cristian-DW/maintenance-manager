import React, { useState } from 'react';
import { PlusIcon, TrashIcon, SparklesIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useAssets, useCreateAsset, useUpdateAsset, useDeleteAsset } from '../../hooks/useQueries';

export default function AssetList() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState({ code: '', name: '', location: '', info: '', status: 1 });
  const [bulk, setBulk] = useState('');
  const [editingAsset, setEditingAsset] = useState(null);

  // Use React Query hooks
  const { data, isLoading: loading, error: queryError } = useAssets(0, 1000);
  const createMutation = useCreateAsset();
  const updateMutation = useUpdateAsset();
  const deleteMutation = useDeleteAsset();

  const assets = data?.data || [];
  const error = queryError?.message || null;

  const createAsset = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        code: form.code,
        name: form.name || `Activo ${form.code}`,
        location: form.location || 'Sin ubicación',
        info: form.info || null,
        status: Number(form.status) || 1,
      };
      await createMutation.mutateAsync(payload);
      setForm({ code: '', name: '', location: '', info: '', status: 1 });
      setIsFormOpen(false);
    } catch (err) {
      console.error('Error creating asset:', err);
      alert('Error al crear activo');
    }
  };

  const editAsset = (asset) => {
    setEditingAsset(asset);
    setForm({
      code: asset.code,
      name: asset.name,
      location: asset.location,
      info: asset.info || '',
      status: asset.status
    });
    setIsFormOpen(true);
  };

  const updateAsset = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        code: form.code,
        name: form.name || `Activo ${form.code}`,
        location: form.location || 'Sin ubicación',
        info: form.info || null,
        status: Number(form.status) || 1,
      };
      await updateMutation.mutateAsync({ id: editingAsset.ID, data: payload });
      setForm({ code: '', name: '', location: '', info: '', status: 1 });
      setEditingAsset(null);
      setIsFormOpen(false);
    } catch (err) {
      console.error('Error updating asset:', err);
      alert('Error al actualizar activo');
    }
  };

  const handleSubmit = (e) => {
    if (editingAsset) {
      updateAsset(e);
    } else {
      createAsset(e);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingAsset(null);
    setForm({ code: '', name: '', location: '', info: '', status: 1 });
  };

  const createBulk = async () => {
    if (!bulk.trim()) return;
    try {
      // Accept comma, newline or space separated codes
      const raw = bulk.split(/[,\n\s]+/).map(s => s.trim()).filter(Boolean);
      const promises = raw.map(code => {
        const payload = { code, name: `Activo ${code}`, location: 'Sin ubicación', status: 1 };
        return createMutation.mutateAsync(payload);
      });
      await Promise.all(promises);
      setBulk('');
    } catch (err) {
      console.error('Error creating bulk assets:', err);
      alert('Error al crear activos por lote');
    }
  };

  const deleteAsset = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este activo?')) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      console.error('Error deleting asset:', err);
      alert('Error al eliminar activo');
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">Activos</h1>
          <p className="mt-2 text-sm text-gray-700">Gestiona los activos. Puedes ingresar códigos individualmente o por lote (separados por coma, espacios o saltos de línea).</p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex gap-2">
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700"
          >
            <PlusIcon className="h-5 w-5" />
            Nuevo Activo
          </button>
          <button
            type="button"
            onClick={() => { const sample = 'AC-101, AC-102, AC-103'; setBulk(sample); }}
            className="inline-flex items-center gap-2 rounded-md bg-primary-50 px-3 py-2 text-sm font-medium text-primary-700 hover:bg-primary-100 border border-primary-100"
          >
            <SparklesIcon className="h-5 w-5" />
            Ejemplo Lote
          </button>
        </div>
      </div>

      <div className="mt-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <div className="rounded-lg bg-white p-4 shadow ring-1 ring-black ring-opacity-5">
              <div className="mb-3 text-sm text-gray-600">Ingresar códigos por lote</div>
              <textarea
                value={bulk}
                onChange={(e) => setBulk(e.target.value)}
                placeholder="Pega o escribe varios códigos: AC-101, AC-102"
                className="w-full h-28 resize-none rounded-md border p-2"
              />
              <div className="mt-3 flex justify-end gap-2">
                <button onClick={() => setBulk('')} className="px-3 py-1 rounded-md text-sm">Limpiar</button>
                <button onClick={createBulk} className="px-3 py-1 rounded-md bg-primary-600 text-white">Crear por lote</button>
              </div>
            </div>
          </div>

          <div>
            <div className="rounded-lg bg-white p-4 shadow ring-1 ring-black ring-opacity-5">
              <div className="text-sm font-medium text-gray-900">Resumen</div>
              <div className="mt-2 text-sm text-gray-600">Total activos: <strong>{assets.length}</strong></div>
              <div className="mt-4 text-sm text-gray-600">Activos activos: <strong>{assets.filter(a => a.status === 1).length}</strong></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg bg-white">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Código</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Nombre</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Ubicación</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Estado</th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Acciones</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center">
                        <div className="flex justify-center items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                          <span className="ml-3 text-gray-600">Cargando activos...</span>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8">
                        <div className="p-4 text-red-700 bg-red-100 rounded-lg border border-red-300">
                          <p className="font-medium">{error}</p>
                          <button onClick={load} className="mt-2 text-sm text-red-700 hover:text-red-900 underline">Reintentar</button>
                        </div>
                      </td>
                    </tr>
                  ) : assets.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">No hay activos.</td>
                    </tr>
                  ) : (
                    assets.map(a => (
                      <tr key={a.ID} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6"><div className="font-medium text-gray-900">{a.code}</div></td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{a.name}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{a.location}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{a.status === 1 ? 'Activo' : 'Inactivo'}</td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => editAsset(a)}
                              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                              <PencilIcon className="h-4 w-4" /> Editar
                            </button>
                            <button
                              onClick={() => deleteAsset(a.ID)}
                              className="inline-flex items-center gap-2 rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700"
                            >
                              <TrashIcon className="h-4 w-4" /> Eliminar
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

      {/* Single create/edit modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={handleCloseForm} />
          <div className="relative z-10 w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
            <h3 className="text-lg font-semibold">
              {editingAsset ? 'Editar activo' : 'Crear activo'}
            </h3>
            <form className="mt-4 flex flex-col gap-3" onSubmit={handleSubmit}>
              <input
                className="border p-2 rounded-md"
                placeholder="Código (ej: AC-001)"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                required
              />
              <input
                className="border p-2 rounded-md"
                placeholder="Nombre"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                className="border p-2 rounded-md"
                placeholder="Ubicación"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
              <input
                className="border p-2 rounded-md"
                placeholder="Info"
                value={form.info}
                onChange={(e) => setForm({ ...form, info: e.target.value })}
              />
              <select
                className="border p-2 rounded-md"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: Number(e.target.value) })}
              >
                <option value={1}>Activo</option>
                <option value={0}>Inactivo</option>
              </select>
              <div className="mt-4 flex justify-end gap-2">
                <button type="button" onClick={handleCloseForm} className="rounded-md px-3 py-2 text-sm">Cancelar</button>
                <button type="submit" className="rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white">
                  {editingAsset ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
