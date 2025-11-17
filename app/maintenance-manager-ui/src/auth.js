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
    // store basic auth token
    const token = btoa(`${email}:${password}`);
    localStorage.setItem('auth', token);
    // Update axios header immediately
    api.defaults.headers.Authorization = `Basic ${token}`;

    // Try to fetch the user by email
    try {
      const filter = encodeURIComponent(`email eq '${email}'`);
      const res = await api.get(`/Users?$filter=${filter}`);
      let found = null;
      if (res.data && Array.isArray(res.data.value) && res.data.value.length > 0) {
        found = res.data.value[0];
      }

      if (found) {
        setUser(found);
        localStorage.setItem('user', JSON.stringify(found));
        return { ok: true, user: found };
      } else {
        // If user not found, return not ok (frontend can decide to create user)
        return { ok: false, message: 'Usuario no encontrado' };
      }
    } catch (err) {
      console.error('Login error:', err);
      return { ok: false, message: err.message || 'Error' };
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

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
