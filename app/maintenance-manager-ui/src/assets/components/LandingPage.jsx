import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    WrenchScrewdriverIcon,
    BuildingOfficeIcon,
    UserGroupIcon,
    CheckCircleIcon,
    ChartBarIcon,
    ClockIcon,
    ChevronDownIcon,
    ChevronUpIcon
} from '@heroicons/react/24/outline';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gray-900 text-white selection:bg-primary-500 selection:text-white">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-gray-900/80 backdrop-blur-md transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                            <div className="bg-gradient-to-tr from-primary-500 to-purple-600 p-2 rounded-lg">
                                <WrenchScrewdriverIcon className="h-6 w-6 text-white" />
                            </div>
                            <span className="ml-3 text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                Maintenance Manager
                            </span>
                        </div>
                        <div className="hidden md:flex items-center space-x-8">
                            <NavLink href="#features">Características</NavLink>
                            <NavLink href="#how-it-works">Cómo funciona</NavLink>
                            <NavLink href="#testimonials">Testimonios</NavLink>
                            <NavLink href="#faq">FAQ</NavLink>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                                Iniciar Sesión
                            </Link>
                            <Link
                                to="/login"
                                state={{ isRegister: true }}
                                className="px-5 py-2.5 text-sm font-bold rounded-full bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white shadow-lg shadow-primary-600/20 transition-all transform hover:scale-105 hover:shadow-primary-600/40"
                            >
                                Registrarse
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 sm:pt-48 sm:pb-32 overflow-hidden">
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm animate-fade-in-up">
                        <span className="flex h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                        <span className="text-sm font-medium text-gray-300">Nueva versión 2.0 disponible</span>
                    </div>

                    <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
                        <span className="block text-white mb-2">Mantenimiento</span>
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-primary-500 to-purple-600">
                            Inteligente y Eficiente
                        </span>
                    </h1>

                    <p className="mt-6 text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                        Optimiza tus operaciones, controla tus activos y gestiona solicitudes de mantenimiento con una plataforma diseñada para el futuro.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                        <Link
                            to="/login"
                            state={{ isRegister: true }}
                            className="px-8 py-4 text-lg font-bold rounded-full bg-white text-gray-900 hover:bg-gray-100 shadow-xl shadow-white/10 transition-all transform hover:scale-105"
                        >
                            Comenzar Gratis
                        </Link>
                        <a
                            href="#features"
                            className="px-8 py-4 text-lg font-bold rounded-full bg-white/5 hover:bg-white/10 text-white backdrop-blur-sm border border-white/10 transition-all flex items-center justify-center gap-2 group"
                        >
                            Ver Demo
                            <ChevronDownIcon className="h-5 w-5 group-hover:translate-y-1 transition-transform" />
                        </a>
                    </div>
                </div>

                {/* Background Elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden -z-10 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[100px] animate-pulse mix-blend-screen"></div>
                    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] animate-pulse delay-1000 mix-blend-screen"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-10 border-y border-white/5 bg-white/5 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <StatItem number="500+" label="Empresas" />
                        <StatItem number="10k+" label="Activos Gestionados" />
                        <StatItem number="99.9%" label="Uptime" />
                        <StatItem number="24/7" label="Soporte" />
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div id="features" className="py-32 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-primary-500 font-semibold tracking-wide uppercase text-sm mb-3">Características</h2>
                        <h3 className="text-4xl font-bold text-white mb-6">Todo lo que necesitas en un solo lugar</h3>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Herramientas potentes diseñadas para simplificar la gestión de mantenimiento de tu empresa.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<WrenchScrewdriverIcon className="h-8 w-8 text-white" />}
                            title="Gestión de Solicitudes"
                            description="Crea, asigna y rastrea solicitudes de mantenimiento en tiempo real. Prioriza tareas y mantén a tu equipo organizado con tableros intuitivos."
                            color="bg-blue-500"
                        />
                        <FeatureCard
                            icon={<BuildingOfficeIcon className="h-8 w-8 text-white" />}
                            title="Control de Activos"
                            description="Mantén un inventario detallado de todos tus activos, su ubicación y estado. Accede al historial completo de mantenimiento con un clic."
                            color="bg-purple-500"
                        />
                        <FeatureCard
                            icon={<UserGroupIcon className="h-8 w-8 text-white" />}
                            title="Equipo Técnico"
                            description="Asigna técnicos especializados a cada tarea. Gestiona roles, permisos y horarios para asegurar un flujo de trabajo eficiente y seguro."
                            color="bg-pink-500"
                        />
                        <FeatureCard
                            icon={<ChartBarIcon className="h-8 w-8 text-white" />}
                            title="Analíticas Avanzadas"
                            description="Visualiza el rendimiento de tu equipo, costos de mantenimiento y tiempos de respuesta con gráficos interactivos y reportes exportables."
                            color="bg-orange-500"
                        />
                        <FeatureCard
                            icon={<ClockIcon className="h-8 w-8 text-white" />}
                            title="Mantenimiento Preventivo"
                            description="Programa tareas recurrentes y recibe alertas automáticas antes de que ocurran fallas. Reduce el tiempo de inactividad no planificado."
                            color="bg-green-500"
                        />
                        <FeatureCard
                            icon={<CheckCircleIcon className="h-8 w-8 text-white" />}
                            title="Cumplimiento Normativo"
                            description="Asegura que todos los mantenimientos cumplan con las normativas vigentes. Documentación digital y pistas de auditoría completas."
                            color="bg-teal-500"
                        />
                    </div>
                </div>
            </div>

            {/* How it Works Section */}
            <div id="how-it-works" className="py-32 bg-gray-800/30 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl font-bold text-white mb-6">Cómo funciona</h2>
                        <p className="text-xl text-gray-400">Empieza a optimizar tu mantenimiento en 3 simples pasos</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <StepCard
                            number="01"
                            title="Regístrate"
                            description="Crea tu cuenta en segundos y configura tu perfil de empresa."
                        />
                        <StepCard
                            number="02"
                            title="Registra Activos"
                            description="Importa o añade tus activos y equipos al sistema."
                        />
                        <StepCard
                            number="03"
                            title="Gestiona"
                            description="Empieza a crear solicitudes y asignar tareas a tu equipo."
                        />
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <div id="testimonials" className="py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-white mb-16">Lo que dicen nuestros clientes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <TestimonialCard
                            quote="Ha transformado completamente cómo gestionamos el mantenimiento en nuestra planta. Increíble."
                            author="Carlos Ruiz"
                            role="Gerente de Planta, TechMfg"
                        />
                        <TestimonialCard
                            quote="La interfaz es tan intuitiva que nuestro equipo técnico la adoptó en un solo día."
                            author="Ana Martínez"
                            role="Directora de Operaciones, LogiCorp"
                        />
                        <TestimonialCard
                            quote="El soporte es excelente y las funcionalidades de reportes nos han ahorrado miles de dólares."
                            author="David Chen"
                            role="Facility Manager, BuildCo"
                        />
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div id="faq" className="py-32 bg-gray-800/30">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-white mb-16">Preguntas Frecuentes</h2>
                    <div className="space-y-4">
                        <FaqItem
                            question="¿Es necesario instalar algún software?"
                            answer="No, Maintenance Manager es una plataforma 100% basada en la nube. Solo necesitas un navegador web."
                        />
                        <FaqItem
                            question="¿Puedo probarlo gratis?"
                            answer="Sí, ofrecemos un plan gratuito para pequeñas empresas y un periodo de prueba de 14 días para planes premium."
                        />
                        <FaqItem
                            question="¿Es seguro para mis datos?"
                            answer="Absolutamente. Utilizamos encriptación de grado bancario y copias de seguridad diarias para proteger tu información."
                        />
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900 to-purple-900 opacity-50"></div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h2 className="text-4xl font-bold text-white mb-8">¿Listo para transformar tu gestión?</h2>
                    <p className="text-xl text-gray-300 mb-10">
                        Únete a miles de empresas que ya confían en Maintenance Manager.
                    </p>
                    <Link
                        to="/login"
                        state={{ isRegister: true }}
                        className="inline-block px-10 py-5 text-xl font-bold rounded-full bg-white text-primary-900 hover:bg-gray-100 shadow-2xl transition-all transform hover:scale-105"
                    >
                        Crear Cuenta Gratis
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-950 border-t border-white/10 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div>
                            <div className="flex items-center mb-6">
                                <WrenchScrewdriverIcon className="h-8 w-8 text-primary-500" />
                                <span className="ml-2 text-xl font-bold text-white">Maintenance Manager</span>
                            </div>
                            <p className="text-gray-500">
                                La solución definitiva para la gestión de mantenimiento empresarial.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-6">Producto</h4>
                            <ul className="space-y-4 text-gray-500">
                                <li><a href="#" className="hover:text-primary-500 transition-colors">Características</a></li>
                                <li><a href="#" className="hover:text-primary-500 transition-colors">Precios</a></li>
                                <li><a href="#" className="hover:text-primary-500 transition-colors">Integraciones</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-6">Compañía</h4>
                            <ul className="space-y-4 text-gray-500">
                                <li><a href="#" className="hover:text-primary-500 transition-colors">Sobre Nosotros</a></li>
                                <li><a href="#" className="hover:text-primary-500 transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-primary-500 transition-colors">Carreras</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-6">Legal</h4>
                            <ul className="space-y-4 text-gray-500">
                                <li><a href="#" className="hover:text-primary-500 transition-colors">Privacidad</a></li>
                                <li><a href="#" className="hover:text-primary-500 transition-colors">Términos</a></li>
                                <li><a href="#" className="hover:text-primary-500 transition-colors">Seguridad</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-white/10 pt-8 text-center text-gray-600">
                        <p>&copy; 2023 Maintenance Manager. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function NavLink({ href, children }) {
    return (
        <a
            href={href}
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group"
        >
            {children}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full"></span>
        </a>
    );
}

function StatItem({ number, label }) {
    return (
        <div>
            <div className="text-4xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-purple-400">
                {number}
            </div>
            <div className="text-gray-400 font-medium">{label}</div>
        </div>
    );
}

function FeatureCard({ icon, title, description, color }) {
    return (
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all group hover:-translate-y-2 duration-300">
            <div className={`mb-6 p-4 rounded-2xl w-fit ${color} shadow-lg shadow-${color.replace('bg-', '')}-500/30 group-hover:scale-110 transition-transform duration-300`}>
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
            <p className="text-gray-400 leading-relaxed">{description}</p>
        </div>
    );
}

function StepCard({ number, title, description }) {
    return (
        <div className="relative p-8 rounded-3xl bg-gray-900 border border-white/10 hover:border-primary-500/50 transition-colors text-center group">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gray-800 border border-white/20 flex items-center justify-center text-xl font-bold text-primary-500 shadow-xl z-10 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                {number}
            </div>
            <h3 className="text-xl font-bold text-white mb-4 mt-4">{title}</h3>
            <p className="text-gray-400">{description}</p>
        </div>
    );
}

function TestimonialCard({ quote, author, role }) {
    return (
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 relative">
            <div className="text-primary-500 text-6xl absolute top-4 left-6 opacity-20 font-serif">"</div>
            <p className="text-gray-300 text-lg italic mb-6 relative z-10">{quote}</p>
            <div>
                <div className="text-white font-bold">{author}</div>
                <div className="text-primary-400 text-sm">{role}</div>
            </div>
        </div>
    );
}

function FaqItem({ question, answer }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-white/10 rounded-2xl bg-white/5 overflow-hidden transition-all">
            <button
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-white/5 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-lg font-medium text-white">{question}</span>
                {isOpen ? (
                    <ChevronUpIcon className="h-5 w-5 text-primary-500" />
                ) : (
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                )}
            </button>
            <div
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 py-4 opacity-100' : 'max-h-0 py-0 opacity-0'}`}
            >
                <p className="text-gray-400">{answer}</p>
            </div>
        </div>
    );
}
