import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { ExclamationTriangleIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import api from '../../api';

export default function RequestForm({ onCreated, open, onClose }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: '2',
    assignedTo: '',
    assetCode: '',
    assetLocation: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('MaintenanceRequests', form);
      onCreated();
      onClose();
    } catch (error) {
      console.error('Error creating request:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog as="div" className="relative z-10" open={open} onClose={onClose}>
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                <BuildingOfficeIcon className="h-6 w-6 text-primary-600" aria-hidden="true" />
              </div>
              <div className="mt-3 text-center sm:mt-5">
                <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                  Nueva Solicitud de Mantenimiento
                </Dialog.Title>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                  Título
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                    placeholder="Ej: Reparación de aire acondicionado"
                    onChange={handleChange}
                    value={form.title}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                  Descripción
                </label>
                <div className="mt-2">
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                    placeholder="Describe el problema o mantenimiento requerido..."
                    onChange={handleChange}
                    value={form.description}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="assetCode" className="block text-sm font-medium leading-6 text-gray-900">
                    Código del Activo
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="assetCode"
                      id="assetCode"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                      placeholder="Ej: AC-001"
                      onChange={handleChange}
                      value={form.assetCode}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="assetLocation" className="block text-sm font-medium leading-6 text-gray-900">
                    Ubicación
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="assetLocation"
                      id="assetLocation"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                      placeholder="Ej: Piso 2, Sala 201"
                      onChange={handleChange}
                      value={form.assetLocation}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium leading-6 text-gray-900">
                    Prioridad
                  </label>
                  <div className="mt-2">
                    <select
                      id="priority"
                      name="priority"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                      onChange={handleChange}
                      value={form.priority}
                    >
                      <option value="1">Baja</option>
                      <option value="2">Normal</option>
                      <option value="3">Alta</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="assignedTo" className="block text-sm font-medium leading-6 text-gray-900">
                    Asignar a
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="assignedTo"
                      id="assignedTo"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                      placeholder="Nombre del responsable"
                      onChange={handleChange}
                      value={form.assignedTo}
                    />
                  </div>
                </div>
              </div>

              {form.priority === '3' && (
                <div className="rounded-md bg-yellow-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Atención</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          Has seleccionado prioridad alta. Esto notificará inmediatamente al equipo de mantenimiento.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                  type="button"
                  className="text-sm font-semibold leading-6 text-gray-900"
                  onClick={onClose}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Guardando...
                    </>
                  ) : (
                    'Guardar Solicitud'
                  )}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}