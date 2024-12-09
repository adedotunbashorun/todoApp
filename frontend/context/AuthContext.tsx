import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface AuthContextType {
  user: { id: string; fullName: string } | null;
  token: string | null;
  login: (user: { id: string; fullName: string }, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; fullName: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Initialize auth state from cookies
  useEffect(() => {
    const storedToken = Cookies.get('auth_token');
    const storedUserId = Cookies.get('user_id');
    const storedFullName = Cookies.get('full_name');

    if (storedToken && storedUserId && storedFullName) {
      setUser({ id: storedUserId, fullName: storedFullName });
      setToken(storedToken);
    }
  }, []);

  const login = (user: { id: string; fullName: string }, token: string) => {
    setUser(user);
    setToken(token);
    Cookies.set('auth_token', token, { path: '/', sameSite: 'strict' });
    Cookies.set('user_id', user.id, { path: '/', sameSite: 'strict' });
    Cookies.set('full_name', user.fullName, { path: '/', sameSite: 'strict' });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    Cookies.remove('auth_token', { path: '/' });
    Cookies.remove('user_id', { path: '/' });
    Cookies.remove('full_name', { path: '/' });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
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
