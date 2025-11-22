import React from 'react';
import { Link } from 'react-router-dom';
import { WrenchScrewdriverIcon, BuildingOfficeIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Navbar */}
            <nav className="absolute top-0 w-full z-50 border-b border-white/10 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <WrenchScrewdriverIcon className="h-8 w-8 text-primary-500" />
                            <span className="ml-2 text-xl font-bold tracking-tight">Maintenance Manager</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                                Iniciar Sesión
                            </Link>
                            <Link
                                to="/login"
                                className="px-4 py-2 text-sm font-medium rounded-full bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-600/30 transition-all"
                            >
                                Registrarse
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-primary-500 to-purple-600 mb-6">
                        Gestión de Mantenimiento <br /> Inteligente y Eficiente
                    </h1>
                    <p className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto mb-10">
                        Optimiza tus operaciones, controla tus activos y gestiona solicitudes de mantenimiento con una plataforma moderna y fácil de usar.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link
                            to="/login"
                            className="px-8 py-3 text-base font-medium rounded-full bg-primary-600 hover:bg-primary-500 text-white shadow-xl shadow-primary-600/20 transition-all transform hover:scale-105"
                        >
                            Comenzar Ahora
                        </Link>
                        <a
                            href="#features"
                            className="px-8 py-3 text-base font-medium rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/10 transition-all"
                        >
                            Saber más
                        </a>
                    </div>
                </div>

                {/* Background Elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden -z-10">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>
            </div>

            {/* Features Section */}
            <div id="features" className="py-24 bg-gray-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white">Todo lo que necesitas</h2>
                        <p className="mt-4 text-gray-400">Herramientas potentes para tu equipo de mantenimiento</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<WrenchScrewdriverIcon className="h-8 w-8 text-blue-400" />}
                            title="Gestión de Solicitudes"
                            description="Crea, asigna y rastrea solicitudes de mantenimiento en tiempo real. Prioriza tareas y mantén a tu equipo organizado."
                        />
                        <FeatureCard
                            icon={<BuildingOfficeIcon className="h-8 w-8 text-purple-400" />}
                            title="Control de Activos"
                            description="Mantén un inventario detallado de todos tus activos, su ubicación y estado. Historial de mantenimiento completo."
                        />
                        <FeatureCard
                            icon={<UserGroupIcon className="h-8 w-8 text-pink-400" />}
                            title="Equipo Técnico"
                            description="Asigna técnicos especializados a cada tarea. Gestiona roles y permisos para un flujo de trabajo seguro."
                        />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 border-t border-white/10 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
                    <p>&copy; 2023 Maintenance Manager. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary-500/50 transition-colors group">
            <div className="mb-4 p-3 rounded-lg bg-white/5 w-fit group-hover:bg-primary-500/20 transition-colors">
                {icon}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
            <p className="text-gray-400">{description}</p>
        </div>
    );
}
