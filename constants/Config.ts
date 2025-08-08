import { Platform } from 'react-native';

// Backend URL configuration
export const getBackendUrl = () => {
  if (__DEV__) {
    // Development environment
    if (Platform.OS === 'android') {
      // Android emulator uses 10.0.2.2 to access host machine's localhost
      return 'http://192.168.1.57:5000';
    } else if (Platform.OS === 'ios') {
      // iOS simulator can use localhost
      return 'http://localhost:5000';
    }
  } else {
    return 'https://tarag-backend.onrender.com';
  }
};

export const BACKEND_URL = getBackendUrl();

// Message limit for non-pro users
export const MAX_FREE_MESSAGES_PER_DAY = 5;