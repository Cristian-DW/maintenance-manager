import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BuildingOfficeIcon, WrenchScrewdriverIcon, UserIcon, HomeIcon } from '@heroicons/react/24/outline';
import Layout from './assets/components/layout';
import RequestList from './assets/components/RequestList';
import RequestForm from './assets/components/RequestForm';
import Dashboard from './assets/components/Dashboard';
import UserList from './assets/components/UserList';

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
    <Router>
      <Layout 
        navigation={navigation}
        pageTitle="Gestor de Solicitudes de Mantenimiento"
        currentPage={navigation.find(nav => nav.current)?.name || 'Panel de Control'}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/requests" element={
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
          } />
          <Route path="/assets" element={<div>Assets Page</div>} />
          <Route path="/users" element={<UserList />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}