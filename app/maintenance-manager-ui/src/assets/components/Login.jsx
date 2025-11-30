import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth';
import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

export default function Login() {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    if (location.state?.isRegister) {
      setIsLogin(false);
    }
  }, [location.state]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    department: '',
    role: 'REQUESTER',
    acceptTerms: false
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (!isLogin) {
      if (!formData.name.trim()) {
        setError('El nombre es requerido');
        return false;
      }
      if (formData.name.trim().length < 3) {
        setError('El nombre debe tener al menos 3 caracteres');
        return false;
      }
      if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\s/g, ''))) {
        setError('El teléfono debe tener 10 dígitos');
        return false;
      }
      if (!formData.acceptTerms) {
        setError('Debes aceptar los términos y condiciones');
        return false;
      }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Email inválido');
      return false;
    }
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      let result;
      if (!isLogin) {
        result = await register(formData);
      } else {
        result = await login({ email: formData.email, password: formData.password });
      }

      if (result.ok) {
        navigate('/dashboard', { replace: true });
      } else {
        setError(result.message || 'Usuario o contraseña incorrectos');
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError('Error en la autenticación. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setFormData({
      email: '',
      password: '',
      name: '',
      phone: '',
      department: '',
      role: 'REQUESTER',
      acceptTerms: false
    });
  };

  return (
    <div className="min-h-screen flex w-full bg-gray-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-32 w-96 h-96 bg-primary-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      {/* Form Container */}
      <div className="relative w-full max-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-12 py-12">
        <div className="w-full max-w-2xl relative z-10">
          <div className="bg-white/95 backdrop-blur-xl shadow-2xl shadow-primary-600/20 rounded-3xl overflow-hidden border border-white/20">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-purple-600 px-8 py-6">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <ShieldCheckIcon className="h-10 w-10 text-white" />
                </div>
              </div>
              <h2 className="text-center text-3xl font-extrabold text-white tracking-tight">
                {isLogin ? 'Bienvenido de nuevo' : 'Crear cuenta'}
              </h2>
              <p className="mt-2 text-center text-sm text-white/80">
                {isLogin ? 'Accede a tu panel de control' : 'Únete al sistema de mantenimiento'}
              </p>
            </div>

            <form className="px-8 scroll-py-32 space-y-6" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="space-y-5">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombre completo <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-primary-500" />
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="block w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 placeholder-gray-400 text-gray-900 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all shadow-sm hover:border-gray-300"
                        placeholder="Ingresa tu nombre completo"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <PhoneIcon className="h-5 w-5 text-primary-500" />
                      </div>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        className="block w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 placeholder-gray-400 text-gray-900 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all shadow-sm hover:border-gray-300"
                        placeholder="Número de teléfono (opcional)"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Department */}
                  <div>
                    <label htmlFor="department" className="block text-sm font-semibold text-gray-700 mb-2">
                      Departamento
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <BuildingOfficeIcon className="h-5 w-5 text-primary-500" />
                      </div>
                      <input
                        id="department"
                        name="department"
                        type="text"
                        className="block w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 placeholder-gray-400 text-gray-900 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all shadow-sm hover:border-gray-300"
                        placeholder="Tu departamento (opcional)"
                        value={formData.department}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                </div>
              )}

          {/* Email */}
          <div>
            <label htmlFor="email-address" className="block text-sm font-semibold text-gray-700 mb-2">
              Correo electrónico <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <EnvelopeIcon className="h-5 w-5 text-primary-500" />
              </div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 placeholder-gray-400 text-gray-900 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all shadow-sm hover:border-gray-300"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Contraseña <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-primary-500" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 placeholder-gray-400 text-gray-900 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all shadow-sm hover:border-gray-300"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Debe tener al menos 6 caracteres
            </p>
          </div>

          {/* Terms and Conditions */}
          {!isLogin && (
            <div className="flex items-start p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
              <input
                id="acceptTerms"
                name="acceptTerms"
                type="checkbox"
                className="h-5 w-5 mt-0.5 text-primary-600 focus:ring-2 focus:ring-primary-500 border-gray-300 rounded cursor-pointer transition-all"
                checked={formData.acceptTerms}
                onChange={handleChange}
              />
              <label htmlFor="acceptTerms" className="ml-3 block text-sm text-gray-700 cursor-pointer">
                Acepto los{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700 font-semibold underline">
                  términos y condiciones
                </a>{' '}
                y la{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700 font-semibold underline">
                  política de privacidad
                </a>
              </label>
            </div>
          )}

          {error && (
            <div className="p-4 text-red-700 bg-red-50 rounded-xl border-2 border-red-200 text-sm font-medium flex items-start gap-3">
              <svg className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-base font-bold rounded-xl text-white bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-primary-300 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-primary-600/40 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isLogin ? 'Iniciando sesión...' : 'Creando cuenta...'}
                </>
              ) : (
                <>
                  {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                  <svg className="ml-2 -mr-1 h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </div>

          <div className="text-center pt-2 border-t-2 border-gray-100">
            <p className="text-sm text-gray-600 mb-2">
              {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            </p>
            <button
              type="button"
              onClick={switchMode}
              className="text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors underline hover:no-underline"
            >
              {isLogin ? 'Crear una cuenta nueva' : 'Iniciar sesión aquí'}
            </button>
          </div>
        </form>
      </div>
    </div>
      </div >
    </div >
  );
}
