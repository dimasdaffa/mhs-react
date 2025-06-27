import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LoginTemplate from '../components/templates/LoginTemplate';
import { loginUser } from '../api/UserApi'; // Update to use UserApi instead of MahasiswaApi
import { useAuth } from '../context/AuthContext';
import { showErrorToast } from '../helpers/toastHelper';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();

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
      const response = await loginUser({ email, password });
      
      if (response.data.length > 0) {
        const userData = response.data[0];
        login(userData);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Masuk ke Akun Anda
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Atau{' '}
            <Link
              to="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              daftar akun baru
            </Link>
          </p>
        </div>
        <LoginTemplate onSubmit={handleLogin} />
      </div>
    </div>
  );
};

export default LoginPage;