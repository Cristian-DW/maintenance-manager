import { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BuildingOfficeIcon, WrenchScrewdriverIcon, UserIcon, HomeIcon } from '@heroicons/react/24/outline';
import Layout from './assets/components/layout';
import { useAuth } from './auth';
import ProtectedRoute from './components/ProtectedRoute';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000, // 30 seconds
    },
  },
});

// Lazy load heavy components
const RequestList = lazy(() => import('./assets/components/RequestList'));
const RequestForm = lazy(() => import('./assets/components/RequestForm'));
const Dashboard = lazy(() => import('./assets/components/Dashboard'));
const UserList = lazy(() => import('./assets/components/UserList'));
const AssetList = lazy(() => import('./assets/components/AssetList'));
const Login = lazy(() => import('./assets/components/Login'));
const Profile = lazy(() => import('./assets/components/Profile'));

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}

const navigation = [
  { name: 'Panel de Control', href: '/', icon: HomeIcon, current: true },
  { name: 'Solicitudes', href: '/requests', icon: WrenchScrewdriverIcon, current: false },
  { name: 'Activos', href: '/assets', icon: BuildingOfficeIcon, current: false },
  { name: 'Usuarios', href: '/users', icon: UserIcon, current: false },
];

export default function App() {
  const [reload, setReload] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleRequestCreated = () => {
    setReload(!reload);
  };

  console.log('App component rendered');

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout
          navigation={navigation}
          pageTitle="Gestor de Solicitudes de Mantenimiento"
          currentPage={navigation.find(nav => nav.current)?.name || 'Panel de Control'}
        >
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/requests" element={
                <ProtectedRoute>
                  <div className="py-6">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                      <RequestList key={reload} />
                      <RequestForm
                        open={isFormOpen}
                        onClose={() => setIsFormOpen(false)}
                        onCreated={handleRequestCreated}
                      />
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/assets" element={
                <ProtectedRoute>
                  <AssetList />
                </ProtectedRoute>
              } />
              <Route path="/users" element={
                <ProtectedRoute requiredRole="ADMIN">
                  <UserList />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}