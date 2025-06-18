import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginTemplate from '../components/templates/LoginTemplate';
// import users from '../data/users.json'; // <-- 1. Hapus impor ini
import { loginUser } from '../api/MahasiswaApi'; // <-- 2. Impor fungsi login dari API

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = async (event) => { // <-- 3. Jadikan fungsi ini async
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    
    try {
      const response = await loginUser(email, password); // <-- 4. Panggil API
      
      // 5. Cek respons dari API
      if (response.data.length > 0) {
        const user = response.data[0]; // Ambil data user pertama yang cocok
        console.log("Login berhasil:", user);
        
        // Simpan sesi di localStorage seperti di PDF
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true'); // Anda sudah menggunakan ini
        
        navigate('/admin/dashboard'); // Arahkan ke dashboard
      } else {
        alert('Email atau password salah!'); // Tampilkan error jika tidak ada data yang cocok
      }
    } catch (error) {
        console.error("Terjadi kesalahan saat login:", error);
        alert('Terjadi kesalahan pada server.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginTemplate onSubmit={handleLogin} />
    </div>
  );
};

export default LoginPage;