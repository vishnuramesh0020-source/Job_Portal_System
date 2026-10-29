import { useState, useEffect } from 'react';
import { AuthContext } from './authContextInstance';
import {
  authService,
  getCurrentSession,
  initializeAuthStorage,
  saveCurrentSession,
  clearCurrentSession,
} from '../services/authService';
import { toast } from 'react-toastify';

export const AuthProvider = ({ children }) => {
  // Initialize state directly from localStorage session
  const [user, setUser] = useState(() => {
    initializeAuthStorage();
    return getCurrentSession();
  });
  const [isLoading, setIsLoading] = useState(false);

  // Synchronize storage on mount
  useEffect(() => {
    initializeAuthStorage();
  }, []);

  // Handle Login
  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const loggedInUser = await authService.login(credentials);
      setUser(loggedInUser);
      toast.success(`Welcome back, ${loggedInUser.fullName}! (${loggedInUser.role})`);
      return { success: true, user: loggedInUser };
    } catch (error) {
      const message = error.message || 'Login failed. Please try again.';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Registration
  const register = async (userData) => {
    setIsLoading(true);
    try {
      const registeredUser = await authService.register(userData);
      setUser(registeredUser);
      toast.success(
        `Registration successful! Welcome to VS Job Portal, ${registeredUser.fullName}.`
      );
      return { success: true, user: registeredUser };
    } catch (error) {
      const message = error.message || 'Registration failed. Please try again.';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Forgot / Reset Password
  const resetPassword = async (data) => {
    try {
      const result = await authService.resetPassword(data);
      toast.success(result.message || 'Password reset successful! Please log in.');
      return { success: true };
    } catch (error) {
      const message = error.message || 'Failed to reset password.';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Verify email for password recovery
  const verifyEmail = async (email) => {
    try {
      const result = await authService.verifyEmail(email);
      return { success: true, ...result };
    } catch (error) {
      const message = error.message || 'Email verification failed.';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Update current user profile in state & storage
  const updateUserProfile = (updatedData) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedData };
      saveCurrentSession(updated);
      return updated;
    });
  };

  // Handle Logout
  const logout = () => {
    try {
      authService.logout();
    } catch (e) {
      console.warn('Error during logout:', e);
    }
    clearCurrentSession();
    setUser(null);
    toast.info('You have been logged out.');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    role: user?.role || null,
    login,
    register,
    logout,
    resetPassword,
    verifyEmail,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
