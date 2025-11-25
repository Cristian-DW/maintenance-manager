import { useState } from 'react';
import { CheckCircleIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useMaintenanceRequests, useUpdateMaintenanceRequest, useDeleteMaintenanceRequest } from '../../hooks/useQueries';

const priorityClasses = {
  1: 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 ring-green-600/30 shadow-sm',
  2: 'bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-700 ring-yellow-600/30 shadow-sm',
  3: 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 ring-red-600/30 shadow-sm',
};

const statusIcons = {
  OPEN: ClockIcon,
  IN_PROGRESS: ExclamationTriangleIcon,
  DONE: CheckCircleIcon,
};

const statusClasses = {
  OPEN: 'text-blue-700 bg-gradient-to-r from-blue-50 to-cyan-50 ring-blue-600/30 shadow-sm',
  IN_PROGRESS: 'text-amber-700 bg-gradient-to-r from-amber-50 to-orange-50 ring-amber-600/30 shadow-sm',
  DONE: 'text-green-700 bg-gradient-to-r from-green-50 to-emerald-50 ring-green-600/30 shadow-sm',
};

import RequestForm from './RequestForm';

export default function RequestList() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);

  // Use React Query hooks
  const { data, isLoading: loading, error: queryError } = useMaintenanceRequests(0, 100);
  const updateMutation = useUpdateMaintenanceRequest();
  const deleteMutation = useDeleteMaintenanceRequest();

  const requests = data?.data || [];
  const error = queryError?.message || null;

  // Delete request
  const deleteRequest = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta solicitud?')) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      console.error('Error deleting request:', err);
      alert('Error al eliminar la solicitud');
    }
  };


  // Update request status
  const updateStatus = async (id, newStatus) => {
    try {
      await updateMutation.mutateAsync({
        id,
        data: {
          status: newStatus,
          modifiedAt: new Date().toISOString()
        }
      });
    } catch (err) {
      console.error('Error updating request:', err);
      alert('Error al actualizar la solicitud');
    }
  };

  // Edit request
  const editRequest = (request) => {
    setEditingRequest(request);
    setIsFormOpen(true);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 animate-fadeInUp">
      <div className="sm:flex sm:items-center mb-6">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">Solicitudes de Mantenimiento</h1>
          <p className="mt-2 text-sm text-gray-600">
            Lista de todas las solicitudes de mantenimiento incluyendo título, estado, prioridad y asignación.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsFormOpen(true)}
          >
            Nueva Solicitud
          </button>
        </div>
      </div>
      <div className="mt-6 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow-lg ring-1 ring-gray-200/50 rounded-2xl backdrop-blur-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-purple-50/30">
                  <tr>
                    <th scope="col" className="py-4 pl-4 pr-3 text-left text-sm font-semibold text-gray-700 sm:pl-6">
                      Solicitud
                    </th>
                    <th scope="col" className="px-3 py-4 text-left text-sm font-semibold text-gray-700">
                      Activo
                    </th>
                    <th scope="col" className="px-3 py-4 text-left text-sm font-semibold text-gray-700">
                      Estado
                    </th>
                    <th scope="col" className="px-3 py-4 text-left text-sm font-semibold text-gray-700">
                      Prioridad
                    </th>
                    <th scope="col" className="px-3 py-4 text-left text-sm font-semibold text-gray-700">
                      Asignado a
                    </th>
                    <th scope="col" className="relative py-4 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white/90 backdrop-blur-sm">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center">
                        <div className="flex justify-center items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                          <span className="ml-3 text-gray-600">Cargando solicitudes...</span>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8">
                        <div className="p-4 text-red-700 bg-red-100 rounded-lg border border-red-300">
                          <p className="font-medium">Error al cargar las solicitudes</p>
                          <p className="text-sm mt-1">{error}</p>
                          <button
                            onClick={load}
                            className="mt-2 text-sm text-red-700 hover:text-red-900 underline"
                          >
                            Reintentar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : requests.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                        No hay solicitudes de mantenimiento. Crea una nueva solicitud usando el botón "Nueva Solicitud".
                      </td>
                    </tr>
                  ) : (
                    requests.map((request) => {
                      const StatusIcon = statusIcons[request.status] || ClockIcon;
                      return (
                        <tr key={request.ID} className="hover:bg-gradient-to-r hover:from-primary-50/30 hover:to-purple-50/30 transition-all duration-200">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                            <div className="font-medium text-gray-900">{request.title || 'Sin título'}</div>
                            <div className="text-gray-500">{request.description || ''}</div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div className="font-medium text-gray-900">{request.asset?.code || request.assetCode || 'N/A'}</div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ring-2 ring-inset transition-all hover:scale-105 ${statusClasses[request.status] || statusClasses.OPEN}`}>
                              <StatusIcon className="mr-1.5 h-4 w-4" />
                              {request.status || 'OPEN'}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ring-2 ring-inset transition-all hover:scale-105 ${priorityClasses[request.priority] || priorityClasses[2]}`}>
                              Prioridad {request.priority || 2}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {request.assignedTo?.name ? (
                              <div className="flex items-center">
                                <div className="h-8 w-8 flex-shrink-0">
                                  <img
                                    className="h-8 w-8 rounded-full"
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(request.assignedTo.name)}&background=random`}
                                    alt=""
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="font-medium text-gray-900">{request.assignedTo.name}</div>
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400">Sin asignar</span>
                            )}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <div className="flex gap-2 justify-end">
                              <button
                                type="button"
                                className="px-3 py-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-all"
                                onClick={() => editRequest(request)}
                              >
                                Editar
                              </button>
                              <select
                                value={request.status || 'OPEN'}
                                onChange={(e) => updateStatus(request.ID, e.target.value)}
                                className="text-xs font-medium border-2 border-gray-200 rounded-lg px-2 py-1.5 hover:border-primary-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                              >
                                <option value="OPEN">Abierta</option>
                                <option value="IN_PROGRESS">En Progreso</option>
                                <option value="DONE">Terminada</option>
                              </select>
                              <button
                                type="button"
                                className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                                onClick={() => deleteRequest(request.ID)}
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <RequestForm
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingRequest(null);
        }}
        onCreated={() => {
          setIsFormOpen(false);
          setEditingRequest(null);
        }}
        editingRequest={editingRequest}
      />
    </div>
  );
}