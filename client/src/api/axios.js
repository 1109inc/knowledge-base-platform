// Import the axios library
import axios from "axios";

// Create an axios instance with a base URL
const instance = axios.create({
  baseURL: "http://localhost:5000/api", // Base URL for all API requests
});

// Add a request interceptor to include the token in the headers
instance.interceptors.request.use((config) => {
  // Get the token from local storage
  const token = localStorage.getItem("token");
  // If the token exists, add it to the Authorization header
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Return the modified config
  return config;
});

// Export the configured axios instance
export default instance;
