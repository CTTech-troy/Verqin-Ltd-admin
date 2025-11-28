import React, { useEffect, useState, createContext, useContext } from 'react';

const AuthContext = createContext(undefined);
export function AuthProvider({children}) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem('admin_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);
  const login = async (email, password) => {
    // Mock authentication - in production, this would call your API
    if (email === 'admin@verqin.com' && password === 'admin123') {
      const user = {
        id: '1',
        name: 'Admin User',
        email: email
      };
      setUser(user);
      localStorage.setItem('admin_user', JSON.stringify(user));
      return true;
    }
    return false;
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('admin_user');
  };
  return <AuthContext.Provider value={{
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading
  }}>
      {children}
    </AuthContext.Provider>;
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

