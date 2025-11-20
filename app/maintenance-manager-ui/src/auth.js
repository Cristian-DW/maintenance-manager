import React, { createContext, useContext, useEffect, useState } from 'react';
import api from './api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On mount, try to load stored auth and current user
    const auth = localStorage.getItem('auth');
    const userJson = localStorage.getItem('user');
    if (auth && userJson) {
      try {
        const parsed = JSON.parse(userJson);
        setUser(parsed);
      } catch (e) {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async ({ email, password }) => {
    if (!email || !password) {
      return { ok: false, message: 'Email and password are required' };
    }

    try {
      // Call the authenticate action on the backend
      // In CAP OData, actions are called via POST to /odata/v4/service/Action
      const res = await api.post('/odata/v4/maintenance/authenticate', { email, password });
      
      if (res.data && res.data.ok && res.data.user) {
        const user = res.data.user;
        
        // Store auth token
        const token = btoa(`${email}:${password}`);
        localStorage.setItem('auth', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Update axios header
        api.defaults.headers.Authorization = `Bearer ${token}`;
        
        setUser(user);
        return { ok: true, user };
      } else {
        return { ok: false, message: res.data?.message || 'Login failed' };
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Authentication failed';
      return { ok: false, message: errorMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('user');
    api.defaults.headers.Authorization = undefined;
    setUser(null);
  };

  const updateProfile = async (changes) => {
    if (!user) throw new Error('No user');
    try {
      const id = user.ID;
      // OData key formatting: if ID looks like a UUID/string use quoted key, otherwise use unquoted numeric key
      const useQuoted = typeof id === 'string' && id.includes('-');
      const key = useQuoted ? `Users('${id}')` : `Users(${id})`;
      const res = await api.patch(`/${key}`, changes);
      // Merge local
      const updated = { ...user, ...changes, ...res.data };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      return { ok: true, user: updated };
    } catch (err) {
      console.error('Update profile error:', err);
      return { ok: false, message: err.message };
    }
  };

  return React.createElement(
    AuthContext.Provider,
    { value: { user, loading, login, logout, updateProfile } },
    children
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
