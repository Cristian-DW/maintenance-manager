import React, { useState } from 'react';
import { useAuth } from '../../auth';
import {
  UserCircleIcon,
  EnvelopeIcon,
  KeyIcon,
  CheckCircleIcon,
  ClockIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  PencilIcon,
  XMarkIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useMaintenanceRequests } from '../../hooks/useQueries';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [form, setForm] = useState(() => ({ name: user?.name || '', email: user?.email || '' }));
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [status, setStatus] = useState(null);
  const [passwordStatus, setPasswordStatus] = useState(null);

  // Fetch user's requests for statistics with refetch capability
  const { data: requestsData, refetch: refetchRequests, isRefetching } = useMaintenanceRequests(0, 1000);
  const allRequests = requestsData?.data || [];
  const userRequests = allRequests.filter(r =>
    r.requestedBy?.ID === user?.ID || r.assignedTo?.ID === user?.ID
  );

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    setStatus('saving');
    const res = await updateProfile({ name: form.name, email: form.email });
    if (res.ok) {
      setStatus('saved');
      setIsEditingInfo(false);
      setTimeout(() => setStatus(null), 3000);
    } else {
      setStatus(res.message || 'error');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus('Las contraseñas no coinciden');
      return;
    }
    setPasswordStatus('saving');
    // Simulated - you would call an API endpoint here
    setTimeout(() => {
      setPasswordStatus('saved');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setIsChangingPassword(false);
      setTimeout(() => setPasswordStatus(null), 3000);
    }, 1000);
  };

  const handleCancelEdit = () => {
    setForm({ name: user?.name || '', email: user?.email || '' });
    setIsEditingInfo(false);
    setStatus(null);
  };

  const handleCancelPassword = () => {
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setIsChangingPassword(false);
    setPasswordStatus(null);
  };

  if (!user) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-gray-500">No hay usuario conectado.</div>
    </div>
  );

  // Debug logging
  console.log('Profile - Current user:', user);
  console.log('Profile - All requests:', allRequests);
  console.log('Profile - User requests:', userRequests);

  // Calculate statistics with null checks
  const myRequests = userRequests.filter(r => {
    const match = r.requestedBy?.ID === user?.ID;
    if (match) console.log('My request found:', r.title);
    return match;
  });

  const assignedToMe = userRequests.filter(r => {
    const match = r.assignedTo?.ID === user?.ID;
    if (match) console.log('Assigned to me:', r.title);
    return match;
  });

  const completedByMe = assignedToMe.filter(r => r.status === 'DONE' || r.status === 'CLOSED');

  console.log('Profile Stats:', {
    total: userRequests.length,
    myRequests: myRequests.length,
    assignedToMe: assignedToMe.length,
    completedByMe: completedByMe.length
  });

  const stats = [
    {
      name: 'Solicitudes Creadas',
      value: myRequests.length,
      icon: ChartBarIcon,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
    },
    {
      name: 'Asignadas a Mí',
      value: assignedToMe.length,
      icon: ClockIcon,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
    },
    {
      name: 'Completadas',
      value: completedByMe.length,
      icon: CheckCircleIcon,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
    },
  ];

  const recentActivity = userRequests.slice(0, 5);

  return (
    <div className="py-6 animate-fadeInUp">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent sm:text-4xl">
                Mi Perfil
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Gestiona tu información personal y revisa tu actividad
              </p>
            </div>
            <button
              onClick={() => refetchRequests()}
              disabled={isRefetching}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-all disabled:opacity-50"
              title="Actualizar estadísticas"
            >
              <ArrowPathIcon className={`h-5 w-5 ${isRefetching ? 'animate-spin' : ''}`} />
              {isRefetching ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-primary-600 to-purple-600 h-32"></div>
              <div className="px-6 pb-6">
                <div className="flex items-end -mt-16 mb-6">
                  <div className="relative">
                    <img
                      className="h-32 w-32 rounded-full ring-4 ring-white shadow-xl bg-white"
                      src={user.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=128&background=7C3AED&color=fff&bold=true`}
                      alt={user.name}
                    />
                    <div className="absolute bottom-2 right-2 h-6 w-6 rounded-full bg-green-400 ring-4 ring-white"></div>
                  </div>
                  <div className="ml-6 flex-1 pb-2">
                    <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                    <p className="text-sm font-medium text-primary-600">{user.role}</p>
                  </div>
                </div>

                {/* Info Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Información Personal</h3>
                    {!isEditingInfo && (
                      <button
                        onClick={() => setIsEditingInfo(true)}
                        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-all"
                      >
                        <PencilIcon className="h-4 w-4" />
                        Editar
                      </button>
                    )}
                  </div>

                  {isEditingInfo ? (
                    <form onSubmit={handleSaveInfo} className="space-y-4">
                      <div>
                        <label className="label">
                          <UserCircleIcon className="h-5 w-5 inline mr-2 text-gray-500" />
                          Nombre
                        </label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={e => setForm({ ...form, name: e.target.value })}
                          className="input"
                          required
                        />
                      </div>
                      <div>
                        <label className="label">
                          <EnvelopeIcon className="h-5 w-5 inline mr-2 text-gray-500" />
                          Email
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={e => setForm({ ...form, email: e.target.value })}
                          className="input"
                          required
                        />
                      </div>

                      {status && status !== 'saving' && (
                        <div className={`p-3 rounded-lg text-sm ${status === 'saved'
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                          }`}>
                          {status === 'saved' ? '✓ Información actualizada correctamente' : status}
                        </div>
                      )}

                      <div className="flex gap-3 justify-end">
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="btn btn-secondary"
                        >
                          <XMarkIcon className="h-5 w-5 mr-2" />
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          disabled={status === 'saving'}
                          className="btn btn-primary"
                        >
                          {status === 'saving' ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                              Guardando...
                            </>
                          ) : (
                            <>
                              <CheckCircleIcon className="h-5 w-5 mr-2" />
                              Guardar
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-700">
                        <UserCircleIcon className="h-5 w-5 mr-3 text-gray-400" />
                        <span className="text-sm font-medium">{user.name}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <EnvelopeIcon className="h-5 w-5 mr-3 text-gray-400" />
                        <span className="text-sm font-medium">{user.email}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <ShieldCheckIcon className="h-5 w-5 mr-3 text-gray-400" />
                        <span className="text-sm font-medium capitalize">{user.role}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Password Change Section */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  {!isChangingPassword ? (
                    <button
                      onClick={() => setIsChangingPassword(true)}
                      className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                    >
                      <KeyIcon className="h-5 w-5" />
                      Cambiar contraseña
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <KeyIcon className="h-5 w-5 mr-2" />
                        Cambiar Contraseña
                      </h3>
                      <form onSubmit={handleChangePassword} className="space-y-4">
                        <div>
                          <label className="label">Contraseña Actual</label>
                          <input
                            type="password"
                            value={passwordForm.currentPassword}
                            onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                            className="input"
                            required
                          />
                        </div>
                        <div>
                          <label className="label">Nueva Contraseña</label>
                          <input
                            type="password"
                            value={passwordForm.newPassword}
                            onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                            className="input"
                            required
                            minLength={6}
                          />
                        </div>
                        <div>
                          <label className="label">Confirmar Nueva Contraseña</label>
                          <input
                            type="password"
                            value={passwordForm.confirmPassword}
                            onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                            className="input"
                            required
                            minLength={6}
                          />
                        </div>

                        {passwordStatus && passwordStatus !== 'saving' && (
                          <div className={`p-3 rounded-lg text-sm ${passwordStatus === 'saved'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                            {passwordStatus === 'saved' ? '✓ Contraseña actualizada correctamente' : passwordStatus}
                          </div>
                        )}

                        <div className="flex gap-3 justify-end">
                          <button
                            type="button"
                            onClick={handleCancelPassword}
                            className="btn btn-secondary btn-sm"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            disabled={passwordStatus === 'saving'}
                            className="btn btn-primary btn-sm"
                          >
                            {passwordStatus === 'saving' ? 'Guardando...' : 'Actualizar Contraseña'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Stats and Activity */}
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Estadísticas</h3>
              {stats.map((stat, index) => (
                <div
                  key={stat.name}
                  className="relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50`}></div>
                  <div className="relative flex items-center">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4 flex-1">
                      <dt className="text-sm font-semibold text-gray-700">{stat.name}</dt>
                      <dd className="text-2xl font-bold text-gray-900">{stat.value}</dd>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            {recentActivity.length > 0 && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div key={activity.ID} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${activity.status === 'DONE' ? 'bg-green-500' :
                        activity.status === 'IN_PROGRESS' ? 'bg-blue-500' :
                          'bg-yellow-500'
                        }`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {activity.asset?.name || 'Sin activo'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
