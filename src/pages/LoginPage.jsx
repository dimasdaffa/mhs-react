import React, { useState } from 'react';
import LoginTemplate from '../components/templates/LoginTemplate';

const LoginPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    
    if (email && password) {
      setIsLoggedIn(true);
      window.location.href = '/admin';
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