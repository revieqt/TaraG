import { router } from 'expo-router';
import { useEffect } from 'react';
import { useSession } from '../context/SessionContext';

export default function Index() {
  const { session, loading } = useSession();

  useEffect(() => {
    if (loading) return; // Wait for session to load
    
    if (session?.user && session?.accessToken) {
      // User is logged in with backend auth, go to home
      router.replace('/(tabs)/home');
    } else {
      // No user session, go to login
      router.replace('/auth/login');
    }
  }, [session, loading]);

  return null;
}