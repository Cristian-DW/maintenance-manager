export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow p-4">
        <h1 className="text-2xl font-bold text-blue-700">🛠️ Maintenance Request Manager</h1>
      </header>
      <main className="flex-1 p-6">{children}</main>
      <footer className="bg-gray-200 text-center py-2 text-sm">SAP BTP Project • Cristian Castro</footer>
    </div>
  );
}