/**
 * Context React pentru gestionarea starii de autentificare globală
 * Oferă funcționalități de login, register, logout și acces la utilizatorul curent
 */
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/apiService';

const AuthContext = createContext(null);

/**
 * Provider component pentru AuthContext
 * Trebuie să învelească întreaga aplicație
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password, role) => {
    const data = await authService.register(name, email, password, role);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook pentru accesarea contextului de autentificare
 * @returns {Object} Context cu user, login, register, logout, loading
 * @throws {Error} Dacă este folosit în afara AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
