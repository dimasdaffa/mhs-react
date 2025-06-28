import axios from 'axios';

const AxiosInstance = axios.create({
  baseURL: 'http://localhost:3001', // URL dasar dari JSON Server kita
  headers: {
    'Content-Type': 'application/json',
  },
});

export default AxiosInstance;