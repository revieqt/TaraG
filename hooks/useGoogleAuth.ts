import { useSession } from '@/context/SessionContext';
import { auth } from '@/services/firebaseConfig';
import { fetchUserProfile } from '@/services/userApiService';
import * as Google from 'expo-auth-session/providers/google';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { useEffect } from 'react';

WebBrowser.maybeCompleteAuthSession();

export function useGoogleLogin() {
  const { updateSession } = useSession();
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID,
    redirectUri: process.env.EXPO_PUBLIC_GOOGLE_OAUTH_REDIRECT_URI,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { idToken } = response.authentication!;
      const credential = GoogleAuthProvider.credential(idToken);
      signInWithCredential(auth, credential)
        .then(async (res) => {
          try {
            // Fetch user profile from Firestore
            const userForSession = await fetchUserProfile(res.user.uid, res.user.email || undefined);
            await updateSession({ user: userForSession });
            
            // Check if this is the user's first login
            if (userForSession.isFirstLogin) {
              router.replace('/auth/firstLogin');
            } else {
              router.replace('/');
            }
          } catch (error) {
            console.error('Failed to fetch user profile after Google sign in:', error);
            // Handle error - maybe redirect to registration or show error message
          }
        })
        .catch((err) => console.log(err));
    }
  }, [response, updateSession]);

  return {
    signIn: () => promptAsync(),
    ready: !!request,
  };
}