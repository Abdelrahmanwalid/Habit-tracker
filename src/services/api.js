import axios from 'axios';

console.log('Environment variables:', process.env);  // Debugging line

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

console.log('Axios base URL:', process.env.REACT_APP_API_URL);  // Debugging line

export default api;