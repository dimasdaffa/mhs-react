import AxiosInstance from './AxiosInstance';

// Registrasi user baru
export const registerUser = (userData) => AxiosInstance.post("/users", userData);

// Login user - mencari user berdasarkan email dan password
export const loginUser = async (credentials) => {
  try {
    const response = await AxiosInstance.get(`/users?email=${credentials.email}&password=${credentials.password}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Ambil semua users
export const getAllUsers = () => AxiosInstance.get("/users");

// Ambil user berdasarkan ID
export const getUser = (id) => AxiosInstance.get(`/users/${id}`);

// Update user
export const updateUser = (id, data) => AxiosInstance.put(`/users/${id}`, data);

// Hapus user
export const deleteUser = (id) => AxiosInstance.delete(`/users/${id}`);

// Cek user berdasarkan email (untuk validasi registrasi)
export const getUserByEmail = (email) => AxiosInstance.get(`/users?email=${email}`);