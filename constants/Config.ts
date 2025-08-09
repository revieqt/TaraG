
// Backend URL configuration
export const getBackendUrl = () => {
  if (__DEV__) {
    // Development environment - use the local backend IP
    return 'http://192.168.1.57:5000/api';
  } else {
    return 'https://tarag-backend.onrender.com';
  }
};

export const BACKEND_URL = getBackendUrl();

// Message limit for non-pro users
export const MAX_FREE_MESSAGES_PER_DAY = 5;