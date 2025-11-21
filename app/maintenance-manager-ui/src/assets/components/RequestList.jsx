import { useEffect, useState } from 'react';
import { CheckCircleIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import api from '../../api';

const priorityClasses = {
  1: 'bg-green-50 text-green-700 ring-green-600/20',
  2: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
  3: 'bg-red-50 text-red-700 ring-red-600/20',
};

const statusIcons = {
  OPEN: ClockIcon,
  IN_PROGRESS: ExclamationTriangleIcon,
  DONE: CheckCircleIcon,
};

const statusClasses = {
  OPEN: 'text-blue-700 bg-blue-50 ring-blue-600/20',
  IN_PROGRESS: 'text-yellow-700 bg-yellow-50 ring-yellow-600/20',
  DONE: 'text-green-700 bg-green-50 ring-green-600/20',
};

import RequestForm from './RequestForm';

export default function RequestList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
  console.log('Fetching requests from:', 'http://localhost:4004/odata/v4/maintenance/MaintenanceRequests');
      
      // Hacer la consulta sin $select para que CAP calcule automáticamente todos los campos proyectados
      // Los campos calculados (assetCode, technicianName, requesterName) se calculan automáticamente
      const res = await api.get("/MaintenanceRequests");
      
      console.log('API Response:', res);
      console.log('Response data:', res.data);
      console.log('Response status:', res.status);
      
      // Handle OData response format (OData V4 usa 'value' para colecciones)
      let requestsData = [];
      if (res.data?.value) {
        requestsData = res.data.value;
      } else if (Array.isArray(res.data)) {
        requestsData = res.data;
      } else if (res.data) {
        // Si es un solo objeto, convertirlo a array
        requestsData = [res.data];
      }
      
      console.log('Parsed requests:', requestsData);
      console.log('Number of requests:', requestsData.length);
      
      // Verificar que los datos tengan la estructura esperada
      if (requestsData.length > 0) {
        console.log('Sample request:', requestsData[0]);
      }
      
      setRequests(requestsData);
    } catch (err) {
      console.error('Error loading requests:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config
      });
      
      let errorMessage = 'Error al cargar las solicitudes';
      if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        errorMessage = 'Error de conexión. Verifica que el servidor backend esté corriendo en http://localhost:4004 (OData at /odata/v4/maintenance)';
      } else if (err.response?.status === 401) {
        errorMessage = 'Error de autenticación. Verifica las credenciales.';
      } else if (err.response?.data?.error?.message) {
        errorMessage = err.response.data.error.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Delete request
  const deleteRequest = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta solicitud?')) {
      return;
    }
    
    try {
      await api.delete(`/MaintenanceRequests('${id}')`);
      load(); // Reload the list
    } catch (err) {
      console.error('Error deleting request:', err);
      alert('Error al eliminar la solicitud');
    }
  };

  // Update request status
  const updateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/MaintenanceRequests('${id}')`, { 
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      load(); // Reload the list
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

  // Cargar las solicitudes al montar el componente y cuando se crea una nueva
  useEffect(() => {
    load();
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">Solicitudes de Mantenimiento</h1>
          <p className="mt-2 text-sm text-gray-700">
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
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Solicitud
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Activo
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Estado
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Prioridad
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Asignado a
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
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
                        <tr key={request.ID} className="hover:bg-gray-50">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                            <div className="font-medium text-gray-900">{request.title || 'Sin título'}</div>
                            <div className="text-gray-500">{request.description || ''}</div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div className="font-medium text-gray-900">{request.assetCode || 'N/A'}</div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${statusClasses[request.status] || statusClasses.OPEN}`}>
                              <StatusIcon className="mr-1 h-4 w-4" />
                              {request.status || 'OPEN'}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <span className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${priorityClasses[request.priority] || priorityClasses[2]}`}>
                              Prioridad {request.priority || 2}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {request.technicianName ? (
                              <div className="flex items-center">
                                <div className="h-8 w-8 flex-shrink-0">
                                  <img 
                                    className="h-8 w-8 rounded-full" 
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(request.technicianName)}&background=random`} 
                                    alt="" 
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="font-medium text-gray-900">{request.technicianName}</div>
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
                                className="text-primary-600 hover:text-primary-900"
                                onClick={() => editRequest(request)}
                              >
                                Editar
                              </button>
                              <select
                                value={request.status || 'OPEN'}
                                onChange={(e) => updateStatus(request.ID, e.target.value)}
                                className="text-xs border rounded px-1"
                              >
                                <option value="OPEN">Abierta</option>
                                <option value="IN_PROGRESS">En Progreso</option>
                                <option value="DONE">Terminada</option>
                              </select>
                              <button
                                type="button"
                                className="text-red-600 hover:text-red-900"
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
          load();
        }}
        editingRequest={editingRequest}
      />
    </div>
  );
}