// src/app/services/apiClient.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    'x-api-key': process.env.API_KEY,
    'x-client-name': process.env.API_CLIENT_NAME,
  },
});

export default apiClient;
