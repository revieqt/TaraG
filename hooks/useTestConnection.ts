import { Alert } from 'react-native';
import { BACKEND_URL } from '@/constants/Config';

export default function useTestConnection() {
  return async () => {
    try {
      console.log('Testing connection to:', BACKEND_URL);
      
      const response = await fetch(`${BACKEND_URL}/health`);
      console.log('Response status:', response.status);
      console.log('Response status text:', response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Health check data:', data);
        Alert.alert('Success', `Connected to backend at ${BACKEND_URL}`);
      } else {
        Alert.alert('Error', `Backend responded with status: ${response.status}`);
      }
    } catch (err: any) {
      console.error('Connection test error:', err);
      Alert.alert('Connection Failed', `Cannot connect to ${BACKEND_URL}\n\nError: ${err.message}`);
    }
  };
} 