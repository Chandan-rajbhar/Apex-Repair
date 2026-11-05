import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    authService.init();
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const login = (identifier, password) => {
    try {
      const loggedUser = authService.login(identifier, password);
      setUser(loggedUser);
      setAuthModalOpen(false);
      try {
        localStorage.setItem('apex_profile_data', JSON.stringify(loggedUser));
        window.dispatchEvent(new Event('apex_profile_updated'));
        window.dispatchEvent(new Event('storage'));
      } catch {}
      showToast(`Welcome back, ${loggedUser.name}!`, 'success');
      return loggedUser;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const register = (data) => {
    try {
      const newUser = authService.register(data);
      setUser(newUser);
      setAuthModalOpen(false);
      try {
        localStorage.setItem('apex_profile_data', JSON.stringify(newUser));
        window.dispatchEvent(new Event('apex_profile_updated'));
        window.dispatchEvent(new Event('storage'));
      } catch {}
      showToast(`Account created! Welcome to Apex, ${newUser.name}.`, 'success');
      return newUser;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const logout = () => {
    authService.logout();
    try {
      localStorage.removeItem('apex_profile_data');
      window.dispatchEvent(new Event('apex_profile_updated'));
      window.dispatchEvent(new Event('storage'));
    } catch {}
    setUser(null);
    setProfileModalOpen(false);
    setSettingsModalOpen(false);
    showToast('Signed out successfully.', 'info');
  };

  const updateProfile = (updates) => {
    try {
      const updated = authService.updateProfile(updates);
      setUser(updated);
      setProfileModalOpen(false);
      showToast('Profile updated successfully!', 'success');
      return updated;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthModalOpen,
        setAuthModalOpen,
        isProfileModalOpen,
        setProfileModalOpen,
        isSettingsModalOpen,
        setSettingsModalOpen,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
