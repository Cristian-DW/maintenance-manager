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

export default function RequestList() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    api.get('MaintenanceRequests').then((res) => {
      setRequests(res.data.value);
    });
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
                  {requests.map((request) => {
                    const StatusIcon = statusIcons[request.status] || ClockIcon;
                    return (
                      <tr key={request.ID} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="font-medium text-gray-900">{request.title}</div>
                          <div className="text-gray-500">{request.description}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="font-medium text-gray-900">{request.assetCode}</div>
                          <div className="text-gray-500">{request.assetLocation}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${statusClasses[request.status]}`}>
                            <StatusIcon className="mr-1 h-4 w-4" />
                            {request.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${priorityClasses[request.priority]}`}>
                            Prioridad {request.priority}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {request.assignedTo ? (
                            <div className="flex items-center">
                              <div className="h-8 w-8 flex-shrink-0">
                                <img 
                                  className="h-8 w-8 rounded-full" 
                                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(request.assignedTo)}&background=random`} 
                                  alt="" 
                                />
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-gray-900">{request.assignedTo}</div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400">Sin asignar</span>
                          )}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            type="button"
                            className="text-primary-600 hover:text-primary-900"
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}