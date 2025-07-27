import { useSession } from '@/context/SessionContext';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform } from 'react-native';

export default function useChangeProfileImage() {
  const { session, updateSession } = useSession();
  const userId = session?.user?.id;

  return async () => {
    if (!userId) return;
    
    // 1. Pick image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    
    if (result.canceled || !result.assets || result.assets.length === 0) return;
    const asset = result.assets[0];
    const uri = asset.uri;
    
    // 2. Upload to backend
    const formData = new FormData();
    let fileName = asset.fileName || 'profile.jpg';
    let fileType = asset.type || 'image/jpeg';
    

    formData.append('image', {
      uri,
      type: fileType,
      name: fileName,
    } as any);
    
    try {
      // Test basic connectivity first
      console.log('Testing connectivity to backend...');
      const testResponse = await fetch('http://10.0.2.2:5000/health');
      console.log('Health check response:', testResponse.status, testResponse.statusText);
      
      console.log('Starting upload to:', `http://10.0.2.2:5000/api/users/upload-profile-image?userId=${userId}`);
      console.log('FormData content:', formData);
      
      const response = await fetch(`http://10.0.2.2:5000/api/users/upload-profile-image?userId=${userId}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Response received:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error response:', errorData);
        throw new Error(errorData.error || 'Upload failed');
      }
      
      const data = await response.json();
      console.log('Success response:', data);
      if (!data.imageUrl) throw new Error('No image URL returned');
      
      // 3. Update session context
      await updateSession({ user: { ...session.user, profileImage: data.imageUrl } as any });
      Alert.alert('Success', 'Profile image updated!');
    } catch (err: any) {
      console.error('Profile image upload error:', err);
      console.error('Error type:', typeof err);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      Alert.alert('Error', err.message || 'Failed to update profile image.');
    }
  };
} 