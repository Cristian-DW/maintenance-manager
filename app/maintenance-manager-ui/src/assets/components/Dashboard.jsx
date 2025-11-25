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
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import api from '../../api';

const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'];

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

        console.log('Dashboard API responses:', { requestsRes, assetsRes, usersRes });

        const requests = requestsRes.data?.value || requestsRes.data || [];
        const assets = assetsRes.data?.value || assetsRes.data || [];
        const users = usersRes.data?.value || usersRes.data || [];

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
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          config: error.config
        });
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
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
    },
    {
      name: 'Gestión de Activos',
      description: 'Administra y realiza seguimiento de todos los activos de la empresa.',
      icon: BuildingOfficeIcon,
      to: '/assets',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
    },
    {
      name: 'Gestión de Personal',
      description: 'Asigna y supervisa al personal técnico y sus tareas.',
      icon: UserGroupIcon,
      to: '/users',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
    },
  ];

  const stats_cards = [
    {
      name: 'Solicitudes Abiertas',
      value: stats.openRequests,
      icon: ClockIcon,
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-50 to-orange-50',
    },
    {
      name: 'En Progreso',
      value: stats.inProgressRequests,
      icon: ArrowTrendingUpIcon,
      gradient: 'from-blue-500 to-indigo-500',
      bgGradient: 'from-blue-50 to-indigo-50',
    },
    {
      name: 'Completadas',
      value: stats.completedRequests,
      icon: CheckCircleIcon,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
    },
  ];

  return (
    <div className="py-6 animate-fadeInUp">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent sm:text-4xl">
            Panel de Control
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Resumen general de solicitudes, activos y estadísticas del sistema
          </p>
        </div>

        {/* Tarjetas de características */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {features.map((feature, index) => (
            <Link
              key={feature.name}
              to={feature.to}
              className="group relative bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 hover:border-primary-300/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`}></div>
              <div className="relative">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {feature.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {stats_cards.map((item, index) => (
            <div
              key={item.name}
              className="relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${(index + 3) * 100}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient} opacity-50`}></div>
              <div className="relative flex items-center">
                <div className="flex-shrink-0">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${item.gradient} shadow-lg`}>
                    <item.icon className="h-8 w-8 text-white" aria-hidden="true" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-semibold text-gray-700 truncate">{item.name}</dt>
                  <dd className="text-3xl font-bold bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent">{item.value}</dd>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gráfico de barras - Solicitudes por prioridad */}
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="h-1 w-8 bg-gradient-to-r from-primary-600 to-purple-600 rounded-full mr-3"></span>
              Solicitudes por Prioridad
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={requestsByPriority}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="priority" stroke="#6b7280" style={{ fontSize: '14px', fontWeight: 500 }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: '14px', fontWeight: 500 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="value" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#7C3AED" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico circular - Estado de solicitudes */}
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="h-1 w-8 bg-gradient-to-r from-primary-600 to-purple-600 rounded-full mr-3"></span>
              Estado de Solicitudes
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={requestsByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {requestsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}