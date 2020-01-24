import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.82.1.185:3333',
});

export default api;