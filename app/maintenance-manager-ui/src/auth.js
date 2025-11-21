import React, { createContext, useContext, useEffect, useState } from 'react';
import api from './api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On mount, try to load stored auth and current user
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const userJson = localStorage.getItem('user');

    if (accessToken && userJson) {
      try {
        const parsed = JSON.parse(userJson);
        setUser(parsed);
      } catch (e) {
        // Invalid user data, clear storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
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
      const res = await api.post('/odata/v4/maintenance/authenticate', { email, password });

      if (res.data && res.data.ok && res.data.user) {
        const { user, accessToken, refreshToken } = res.data;

        // Store tokens and user data
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));

        setUser(user);
        return { ok: true, user };
      } else {
        return { ok: false, message: res.data?.message || 'Login failed' };
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMsg = err.response?.data?.error?.message || err.message || 'Authentication failed';
      return { ok: false, message: errorMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      logout();
      return false;
    }

    try {
      const res = await api.post('/odata/v4/maintenance/refreshToken', { refreshToken });

      if (res.data && res.data.ok && res.data.accessToken) {
        localStorage.setItem('accessToken', res.data.accessToken);
        return true;
      } else {
        logout();
        return false;
      }
    } catch (err) {
      console.error('Token refresh error:', err);
      logout();
      return false;
    }
  };

  const updateProfile = async (changes) => {
    if (!user) throw new Error('No user');
    try {
      const id = user.ID;
      // OData key formatting: if ID looks like a UUID/string use quoted key
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
    { value: { user, loading, login, logout, refreshAccessToken, updateProfile } },
    children
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
