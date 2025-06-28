import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import MahasiswaPage from './pages/MahasiswaPage'
import MahasiswaDetailPage from './pages/MahasiswaDetailPage'
import MahasiswaSksPage from './pages/MahasiswaSksPage'
import DosenPage from './pages/DosenPage'
import MataKuliahPage from './pages/MataKuliahPage'
import KelasPage from './pages/KelasPage'
import AuthLayout from './components/layouts/AuthLayout'
import AdminLayout from './components/layouts/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'
import RencanaStudiPage from './pages/RencanaStudiPage'

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="mahasiswa" element={<MahasiswaPage />} />
          <Route path="mahasiswa/:nim" element={<MahasiswaDetailPage />} />
          <Route path="mahasiswa-sks" element={<MahasiswaSksPage />} />
          <Route path="dosen" element={<DosenPage />} />
          <Route path="mata-kuliah" element={<MataKuliahPage />} />
          <Route path="kelas" element={<KelasPage />} />
          <Route path="rencana-studi" element={<RencanaStudiPage />} />
        </Route>

        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
