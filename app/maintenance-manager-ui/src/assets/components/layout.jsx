import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Dialog } from '@headlessui/react';
import { useAuth } from '../../auth';
import { useTheme } from '../../contexts/ThemeContext';
import { useNotifications, useMarkNotificationAsRead, useMarkAllNotificationsAsRead } from '../../hooks/useQueries';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  ClipboardDocumentListIcon,
  WrenchIcon,
  UserGroupIcon,
  ChartBarIcon,
  QrCodeIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';
import AssetQRScanner from './AssetQRScanner';
import NotificationCenter from './NotificationCenter';

const baseNavigation = [
  { name: 'Panel de Control', href: '/dashboard', icon: HomeIcon },
  { name: 'Solicitudes', href: '/requests', icon: ClipboardDocumentListIcon },
  { name: 'Activos', href: '/assets', icon: WrenchIcon, roles: ['ADMIN', 'MANAGER', 'TECH'] },
  { name: 'Usuarios', href: '/users', icon: UserGroupIcon, roles: ['ADMIN', 'MANAGER'] },
];

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Notifications
  const { data: notifications = [], isLoading: notificationsLoading } = useNotifications();
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

  const currentUser = user || { name: 'Invitado', role: 'GUEST', imageUrl: '' };
  const navigation = baseNavigation.filter(item => {
    if (!item.roles) return true;
    if (!user) return false;
    return item.roles.includes(user.role);
  });

  const isActive = (href) => location.pathname === href;

  return (
    <div className="min-h-screen">
      {/* Mobile sidebar */}
      <Dialog as="div" className="lg:hidden" open={sidebarOpen} onClose={setSidebarOpen}>
        <div className="fixed inset-0 z-50 bg-gray-900/80 backdrop-blur-sm transition-opacity" />
        <Dialog.Panel className="fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto bg-white/95 backdrop-blur-xl px-4 pb-6 pt-5 shadow-2xl sm:max-w-sm sm:px-6 border-r border-purple-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center shadow-lg">
                <WrenchIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                Maintenance
              </span>
            </div>
            <button type="button" className="-m-2.5 rounded-lg p-2.5 text-gray-700 hover:bg-gray-100 transition-colors" onClick={() => setSidebarOpen(false)}>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-200/50">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center rounded-xl px-3 py-3 text-base font-semibold leading-7 transition-all duration-200 ${isActive(item.href)
                      ? 'bg-gradient-to-r from-primary-50 to-purple-50 text-primary-700 shadow-sm'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-primary-50/50 hover:to-purple-50/50 hover:text-primary-600'
                      }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className={`h-6 w-6 mr-3 transition-all duration-200 ${isActive(item.href) ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-500 group-hover:scale-110'
                      }`} aria-hidden="true" />
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                <div className="flex items-center gap-x-4 p-4 text-sm font-semibold leading-6 text-gray-900 rounded-xl bg-gradient-to-r from-gray-50 to-purple-50/50">
                  <div className="relative">
                    <img className="h-10 w-10 rounded-full ring-2 ring-primary-200 shadow-md" src={currentUser.imageUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(currentUser.name)} alt="" />
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-400 ring-2 ring-white"></div>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{currentUser.name}</div>
                    <div className="text-xs font-medium text-primary-600">{currentUser.role}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-2 px-4">
                  {user ? (
                    <>
                      <button onClick={() => { navigate('/profile'); setSidebarOpen(false); }} className="w-full text-left rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-purple-50 hover:text-primary-600 transition-all">Mi perfil</button>
                      <button onClick={() => { logout(); navigate('/'); }} className="w-full text-left rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all">Cerrar sesión</button>
                    </>
                  ) : (
                    <button onClick={() => { navigate('/login'); setSidebarOpen(false); }} className="w-full text-left rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Iniciar sesión</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white/80 backdrop-blur-xl border-r border-purple-200/50 px-6 pb-4 shadow-xl">
          <div className="flex h-16 shrink-0 items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
              <WrenchIcon className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              Maintenance
            </span>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-2">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={`group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-semibold transition-all duration-200 ${isActive(item.href)
                          ? 'bg-gradient-to-r from-primary-50 to-purple-50 text-primary-700 shadow-sm'
                          : 'text-gray-700 hover:bg-gradient-to-r hover:from-primary-50/50 hover:to-purple-50/50 hover:text-primary-600'
                          }`}
                      >
                        <item.icon className={`h-6 w-6 shrink-0 transition-all duration-200 ${isActive(item.href)
                          ? 'text-primary-600'
                          : 'text-gray-400 group-hover:text-primary-500 group-hover:scale-110'
                          }`} aria-hidden="true" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <div className="flex items-center gap-x-4 py-3 px-3 text-sm font-semibold leading-6 rounded-xl bg-gradient-to-r from-gray-50 to-purple-50/50 shadow-sm">
                  <div className="relative">
                    <img className="h-10 w-10 rounded-full ring-2 ring-primary-200 shadow-md" src={currentUser.imageUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(currentUser.name)} alt="" />
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-400 ring-2 ring-white"></div>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{currentUser.name}</div>
                    <div className="text-xs font-medium text-primary-600">{currentUser.role}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  {user ? (
                    <>
                      <button onClick={() => navigate('/profile')} className="w-full text-left rounded-lg px-3 py-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-purple-50 hover:text-primary-600 transition-all">Mi perfil</button>
                      <button onClick={() => { logout(); navigate('/'); }} className="w-full text-left rounded-lg px-3 py-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all">Cerrar sesión</button>
                    </>
                  ) : (
                    <button onClick={() => navigate('/login')} className="w-full text-left rounded-lg px-3 py-2 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50">Iniciar sesión</button>
                  )}
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 bg-white/80 backdrop-blur-xl border-b border-purple-200/50 px-4 shadow-lg sm:gap-x-6 sm:px-6 lg:px-8">
          <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setSidebarOpen(true)}>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="h-6 w-px bg-gradient-to-b from-transparent via-purple-300 to-transparent lg:hidden" aria-hidden="true" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1" />
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* QR Scanner Button */}
              <button
                type="button"
                onClick={() => setShowQRScanner(true)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-primary-600 hover:bg-primary-50 transition-all"
                title="Escanear código QR"
              >
                <QrCodeIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Escanear QR</span>
              </button>

              {/* Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-2 rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-all"
                title={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
              >
                {theme === 'light' ? (
                  <MoonIcon className="h-5 w-5" />
                ) : (
                  <SunIcon className="h-5 w-5" />
                )}
              </button>

              {/* Notifications */}
              <NotificationCenter
                notifications={notifications}
                onMarkAsRead={(id) => markAsReadMutation.mutate(id)}
                onMarkAllAsRead={() => markAllAsReadMutation.mutate()}
                isLoading={notificationsLoading}
              />

              {/* Profile dropdown */}
              <div className="relative">
                <button type="button" className="-m-1.5 flex items-center p-1.5 hover:bg-gray-100/50 rounded-lg transition-all group" id="user-menu-button">
                  <span className="sr-only">Open user menu</span>
                  <div className="relative">
                    <img className="h-8 w-8 rounded-full ring-2 ring-purple-200 group-hover:ring-primary-300 transition-all shadow-md" src={currentUser.imageUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(currentUser.name)} alt="" />
                    <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white"></div>
                  </div>
                  <span className="hidden lg:flex lg:items-center">
                    <span className="ml-4 text-sm font-semibold leading-6 text-gray-900 group-hover:text-primary-600 transition-colors" aria-hidden="true">{currentUser.name}</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 w-full">
          <div className="w-full h-full">{children}</div>
        </main>
      </div>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <AssetQRScanner onClose={() => setShowQRScanner(false)} />
      )}
    </div>
  );
}

