import { useSession } from '@/context/SessionContext';
import { Alert } from 'react-native';
import { BACKEND_URL } from '@/constants/Config';

export default function useUpdateBio() {
  const { session, updateSession } = useSession();
  const userId = session?.user?.id;

  return async (newBio: string) => {
    if (!userId) {
      Alert.alert('Error', 'User not found');
      return false;
    }

    try {
      // 1. Update session context first
      await updateSession({ 
        user: { ...session.user, bio: newBio } as any 
      });

      // 2. Send to backend
      const response = await fetch(`${BACKEND_URL}/api/user/update-bio`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: userId,
          bio: newBio
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update bio');
      }

      const data = await response.json();
      console.log('Bio update success:', data);
      Alert.alert('Success', 'Bio updated successfully!');
      return true;
    } catch (err: any) {
      console.error('Bio update error:', err);
      Alert.alert('Error', err.message || 'Failed to update bio');
      return false;
    }
  };
} 