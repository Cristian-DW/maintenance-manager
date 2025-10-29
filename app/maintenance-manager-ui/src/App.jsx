import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BuildingOfficeIcon, WrenchScrewdriverIcon, UserIcon } from '@heroicons/react/24/outline';
import Layout from './assets/components/layout';
import RequestList from './assets/components/RequestList';
import RequestForm from './assets/components/RequestForm';

const navigation = [
  { name: 'Solicitudes', icon: WrenchScrewdriverIcon, path: '/requests', current: true },
  { name: 'Activos', icon: BuildingOfficeIcon, path: '/assets', current: false },
  { name: 'Usuarios', icon: UserIcon, path: '/users', current: false },
];

export default function App() {
  const [reload, setReload] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleRequestCreated = () => {
    setReload(!reload);
  };

  return (
    <Router>
      <Layout 
        navigation={navigation}
        pageTitle="Gestor de Solicitudes de Mantenimiento"
        currentPage="Solicitudes"
      >
        <div className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Navigate to="/requests" replace />} />
              <Route 
                path="/requests" 
                element={
                  <>
                    <RequestList key={reload} />
                    <RequestForm 
                      open={isFormOpen} 
                      onClose={() => setIsFormOpen(false)}
                      onCreated={handleRequestCreated}
                    />
                  </>
                } 
              />
              <Route 
                path="/assets" 
                element={
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-semibold">Gestión de Activos</h2>
                    <p className="text-gray-600 mt-2">Esta sección está en desarrollo</p>
                  </div>
                } 
              />
              <Route 
                path="/users" 
                element={
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-semibold">Gestión de Usuarios</h2>
                    <p className="text-gray-600 mt-2">Esta sección está en desarrollo</p>
                  </div>
                } 
              />
            </Routes>
          </div>
        </div>
      </Layout>
    </Router>
  );
}