// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://elyvion-beckend-com.vercel.app';
const API_PREFIX = import.meta.env.VITE_API_PREFIX || '/api';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  API_PREFIX: API_PREFIX,
  FULL_URL: `${API_BASE_URL}${API_PREFIX}`,
};

