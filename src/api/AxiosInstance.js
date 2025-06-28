import axios from 'axios';

const AxiosInstance = axios.create({
  baseURL: 'https://mhs-json-server.onrender.com', // URL dasar dari JSON Server kita
  headers: {
    'Content-Type': 'application/json',
  },
});

export default AxiosInstance;