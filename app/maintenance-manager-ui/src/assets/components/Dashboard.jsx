import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  WrenchScrewdriverIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import api from '../../api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalRequests: 0,
    openRequests: 0,
    inProgressRequests: 0,
    completedRequests: 0,
    totalAssets: 0,
    totalUsers: 0,
  });

  const [requestsByPriority, setRequestsByPriority] = useState([
    { priority: 'Alta', value: 0 },
    { priority: 'Media', value: 0 },
    { priority: 'Baja', value: 0 },
  ]);

  const [requestsByStatus, setRequestsByStatus] = useState([
    { status: 'Abierta', value: 0 },
    { status: 'En Progreso', value: 0 },
    { status: 'Completada', value: 0 },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [requestsRes, assetsRes, usersRes] = await Promise.all([
          api.get('/MaintenanceRequests'),
          api.get('/Assets'),
          api.get('/Users'),
        ]);

        const requests = requestsRes.data.value || [];
        const assets = assetsRes.data.value || [];
        const users = usersRes.data.value || [];

        // Calcular estadísticas
        const openRequests = requests.filter(r => r.status === 'OPEN').length;
        const inProgressRequests = requests.filter(r => r.status === 'IN_PROGRESS').length;
        const completedRequests = requests.filter(r => ['DONE', 'CLOSED'].includes(r.status)).length;

        setStats({
          totalRequests: requests.length,
          openRequests,
          inProgressRequests,
          completedRequests,
          totalAssets: assets.length,
          totalUsers: users.length,
        });

        // Actualizar datos para los gráficos
        const priorityStats = [
          { priority: 'Alta', value: requests.filter(r => r.priority === 3).length },
          { priority: 'Media', value: requests.filter(r => r.priority === 2).length },
          { priority: 'Baja', value: requests.filter(r => r.priority === 1).length },
        ];
        setRequestsByPriority(priorityStats);

        const statusStats = [
          { status: 'Abierta', value: openRequests },
          { status: 'En Progreso', value: inProgressRequests },
          { status: 'Completada', value: completedRequests },
        ];
        setRequestsByStatus(statusStats);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  const features = [
    {
      name: 'Solicitudes de Mantenimiento',
      description: 'Gestiona todas las solicitudes de mantenimiento en un solo lugar.',
      icon: WrenchScrewdriverIcon,
      to: '/requests',
      color: 'bg-blue-500',
    },
    {
      name: 'Gestión de Activos',
      description: 'Administra y realiza seguimiento de todos los activos de la empresa.',
      icon: BuildingOfficeIcon,
      to: '/assets',
      color: 'bg-green-500',
    },
    {
      name: 'Gestión de Personal',
      description: 'Asigna y supervisa al personal técnico y sus tareas.',
      icon: UserGroupIcon,
      to: '/users',
      color: 'bg-purple-500',
    },
  ];

  const stats_cards = [
    { 
      name: 'Solicitudes Abiertas', 
      value: stats.openRequests, 
      icon: ClockIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50' 
    },
    { 
      name: 'En Progreso', 
      value: stats.inProgressRequests, 
      icon: ExclamationTriangleIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      name: 'Completadas', 
      value: stats.completedRequests, 
      icon: CheckCircleIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
  ];

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight mb-6">
          Panel de Control
        </h2>

        {/* Tarjetas de características */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {features.map((feature) => (
            <Link
              key={feature.name}
              to={feature.to}
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <span className={`inline-flex p-3 rounded-lg ${feature.color} bg-opacity-10`}>
                  <feature.icon className={`h-6 w-6 ${feature.color} text-opacity-80`} aria-hidden="true" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium">
                  {feature.name}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {feature.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {stats_cards.map((item) => (
            <div
              key={item.name}
              className={`${item.bgColor} px-4 py-5 shadow rounded-lg overflow-hidden sm:p-6`}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <item.icon className={`h-8 w-8 ${item.color}`} aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{item.value}</dd>
                  </dl>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gráfico de barras - Solicitudes por prioridad */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Solicitudes por Prioridad</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={requestsByPriority}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="priority" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0EA5E9" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico circular - Estado de solicitudes */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Estado de Solicitudes</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={requestsByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {requestsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}