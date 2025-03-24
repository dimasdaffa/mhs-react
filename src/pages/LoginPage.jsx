import React from 'react';
import LoginTemplate from '../components/templates/LoginTemplate';

const LoginPage = () => {
  const handleLogin = (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    
    if (email && password) {
      alert('Login Berhasil');
    } else {
      alert('Login Gagal');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginTemplate onSubmit={handleLogin} />
    </div>
  );
};

export default LoginPage; 