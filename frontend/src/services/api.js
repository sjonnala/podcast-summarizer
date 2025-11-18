import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Process a podcast URL and get AI analysis
 * @param {string} podcastUrl - URL of the podcast to process
 * @returns {Promise<Object>} - Analysis results
 */
export async function processPodcast(podcastUrl) {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/process-podcast`, {
      podcastUrl,
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with error
      throw new Error(error.response.data.message || error.response.data.error || 'Server error occurred');
    } else if (error.request) {
      // Request made but no response
      throw new Error('Unable to connect to the server. Please make sure the backend is running.');
    } else {
      // Something else happened
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
}

/**
 * Check if the API server is healthy
 * @returns {Promise<boolean>} - Server health status
 */
export async function checkHealth() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/health`);
    return response.data.status === 'ok';
  } catch (error) {
    return false;
  }
}
