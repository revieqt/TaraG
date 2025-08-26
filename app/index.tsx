import { router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { auth } from '../services/firebaseConfig';

export default function Index() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed. User:', user);
      if (user) {
        // User is logged in, go to home
        router.replace('/(tabs)/home');
      } else {
        // No user, go to login
        router.replace('/auth/login');
      }
    });

    return unsubscribe;
  }, []);

  return null;
}