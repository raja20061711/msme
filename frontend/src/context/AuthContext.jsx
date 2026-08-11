import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('securemsme_user');
    return saved ? JSON.parse(saved) : {
      id: 'user_demo_1',
      businessName: 'Apex Enterprises',
      ownerName: 'Rahul Sharma',
      email: 'owner@securemsme.ai',
      phone: '+91 98765 43210'
    };
  });

  const [token, setToken] = useState(() => localStorage.getItem('securemsme_token') || 'demo_token_securemsme');

  const loginUser = (userData, tokenStr) => {
    setUser(userData);
    setToken(tokenStr);
    localStorage.setItem('securemsme_user', JSON.stringify(userData));
    localStorage.setItem('securemsme_token', tokenStr);
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('securemsme_user');
    localStorage.removeItem('securemsme_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loginUser, logoutUser, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
