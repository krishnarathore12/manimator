// API Configuration
// In development, uses localhost. In production, uses the VITE_API_URL environment variable.

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
