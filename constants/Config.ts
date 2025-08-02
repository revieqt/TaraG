import { Platform } from 'react-native';

// Backend URL configuration
export const getBackendUrl = () => {
  if (__DEV__) {
    // Development environment
    if (Platform.OS === 'android') {
      // Android emulator uses 10.0.2.2 to access host machine's localhost
      return 'http://10.0.2.2:5000';
    } else if (Platform.OS === 'ios') {
      // iOS simulator can use localhost
      return 'http://localhost:5000';
    } else {
      // Web or other platforms
      return 'http://localhost:5000';
    }
  } else {
    // Production environment
    return 'https://tarag-backend.onrender.com';
  }
};

export const BACKEND_URL = getBackendUrl(); 