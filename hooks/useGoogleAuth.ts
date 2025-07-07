import { auth } from '@/services/firestore/config';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { useEffect } from 'react';

WebBrowser.maybeCompleteAuthSession();

export function useGoogleLogin() {
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
        .then((res) => {
          // Optionally: save session, navigate, etc.
        })
        .catch((err) => console.log(err));
    }
  }, [response]);

  return {
    signIn: () => promptAsync(),
    ready: !!request,
  };
}