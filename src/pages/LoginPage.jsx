import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginTemplate from '../components/templates/LoginTemplate';
import users from '../data/users.json';
import { showSuccessToast, showErrorToast } from '../helpers/toastHelper';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    
    const user = users.users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      localStorage.setItem('isLoggedIn', 'true');
      showSuccessToast('Login berhasil!');
      navigate('/admin/dashboard');
    } else {
      showErrorToast('Email atau password salah!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginTemplate onSubmit={handleLogin} />
    </div>
  );
};

export default LoginPage; 