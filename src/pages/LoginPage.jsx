import React, { useEffect } from 'react'; // Import useEffect
import { useNavigate } from 'react-router-dom';
import LoginTemplate from '../components/templates/LoginTemplate';
import { loginUser } from '../api/MahasiswaApi';
import { useAuth } from '../context/AuthContext'; // <-- 1. Import useAuth
import { showErrorToast } from '../helpers/toastHelper';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth(); // <-- 2. Gunakan useAuth

  // Redirect jika sudah login
  useEffect(() => {
    if (user) {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    
    try {
      const response = await loginUser(email, password);
      
      if (response.data.length > 0) {
        const userData = response.data[0];
        login(userData); // <-- 3. Panggil fungsi login dari context
        navigate('/admin/dashboard');
      } else {
        showErrorToast('Email atau password salah!');
      }
    } catch (error) {
        console.error("Terjadi kesalahan saat login:", error);
        showErrorToast('Terjadi kesalahan pada server.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginTemplate onSubmit={handleLogin} />
    </div>
  );
};

export default LoginPage;