/**
 * API Client for FAIRMEDIA Backend
 * Handles all communication with the backend API
 */

import axios from 'axios';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://3.111.217.153:8001"';
const API_VERSION = '/api/v1';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}${API_VERSION}`,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API] Response:`, response.status);
    return response;
  },
  (error) => {
    console.error('[API] Response error:', error);
    
    // Extract error message
    let errorMessage = 'An unexpected error occurred';
    
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;
      
      if (status === 400) {
        errorMessage = data.detail || 'Invalid request. Please check your input.';
      } else if (status === 404) {
        errorMessage = 'Resource not found.';
      } else if (status === 500) {
        errorMessage = data.detail || 'Server error. Please try again later.';
      } else {
        errorMessage = data.detail || `Error: ${status}`;
      }
    } else if (error.request) {
      // No response received
      errorMessage = 'Unable to connect to the server. Please check your connection.';
    }
    
    const enhancedError = new Error(errorMessage);
    enhancedError.originalError = error;
    return Promise.reject(enhancedError);
  }
);

/**
 * Analyze content for bias
 * @param {string} content - Text content to analyze
 * @param {Object} metadata - Optional metadata about the content
 * @returns {Promise<Object>} Analysis result
 */
export const analyzeContent = async (content, metadata = null) => {
  const requestBody = {
    content: content.trim(),
    language: null, // Auto-detect
    metadata: metadata,
  };

  const response = await apiClient.post('/analyze', requestBody);
  
  // Add original content to the response for highlighting
  return {
    ...response.data,
    original_content: content,
  };
};

/**
 * Retrieve a previously completed analysis by ID
 * @param {string} analysisId - UUID of the analysis
 * @returns {Promise<Object>} Stored analysis result
 */
export const getAnalysis = async (analysisId) => {
  const response = await apiClient.get(`/analyze/${analysisId}`);
  return response.data;
};

/**
 * Check API health
 * @returns {Promise<Object>} Health status
 */
export const checkHealth = async () => {
  const response = await axios.get(`${API_BASE_URL}/health`);
  return response.data;
};

/**
 * Get API information
 * @returns {Promise<Object>} API info
 */
export const getApiInfo = async () => {
  const response = await axios.get(`${API_BASE_URL}/`);
  return response.data;
};

export default apiClient;
