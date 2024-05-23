import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // const host = import.meta.env.VITE_URL
  const [auth, setAuth] = useState(localStorage.getItem('authToken'));

  const login = async (username, password) => {
    const { data } = await axios.post(`${import.meta.env.VITE_URL}/api/auth/login`, { username, password });
    localStorage.setItem('authToken', data.token);
    setAuth(data.token);
  };

  const register = async (username, password) => {
    const { data } = await axios.post(`${import.meta.env.VITE_URL}/api/auth/register`, { username, password });
    localStorage.setItem('authToken', data.token);
    setAuth(data.token);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
