import { useState } from 'react';
import { BuildingOfficeIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import Layout from './assets/components/layout';
import RequestList from './assets/components/RequestList';
import RequestForm from './assets/components/RequestForm';

const navigation = [
  { name: 'Solicitudes', icon: WrenchScrewdriverIcon, current: true },
  { name: 'Activos', icon: BuildingOfficeIcon, current: false },
];

export default function App() {
  const [reload, setReload] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleRequestCreated = () => {
    setReload(!reload);
  };

  return (
    <Layout 
      navigation={navigation}
      pageTitle="Gestor de Solicitudes de Mantenimiento"
      currentPage="Solicitudes"
    >
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
    </Layout>
  );
}