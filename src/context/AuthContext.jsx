import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Membuat Context
const AuthContext = createContext();

// 2. Membuat Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 3. Cek localStorage saat komponen pertama kali dimuat
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 4. Fungsi untuk login
  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
    setUser(userData);
  };

  // 5. Fungsi untuk logout
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 6. Membuat custom hook untuk menggunakan context
export const useAuth = () => {
  return useContext(AuthContext);
};