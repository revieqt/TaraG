import { SessionProvider } from '@/context/SessionContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useThemeSwitcher } from '@/hooks/useThemeSwitcher';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-get-random-values';
import 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { effectiveTheme } = useThemeSwitcher();
  const [loaded] = useFonts({
    Poppins: require('../assets/fonts/Poppins-Regular.ttf'),
    PoppinsSemiBold: require('../assets/fonts/Poppins-SemiBold.ttf'),
    PoppinsBold: require('../assets/fonts/Poppins-Bold.ttf'),
    Roboto: require('../assets/fonts/Roboto-VariableFont_wdth,wght.ttf'),
  });

  // Get the themed background color
  const backgroundColor = useThemeColor({}, 'background');

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }} edges={['top', 'bottom']}>
      <SessionProvider>
        <ThemeProvider value={effectiveTheme === 'dark' ? DarkTheme : DefaultTheme}>
          
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            
            <Stack.Screen name="auth/login" />
            <Stack.Screen name="auth/register" />
            <Stack.Screen name="auth/verifyEmail" />
            <Stack.Screen name="auth/warning" />
            <Stack.Screen name="auth/forgotPassword" />
            <Stack.Screen name="auth/changePassword" />
            <Stack.Screen name="auth/firstLogin" />
            
            <Stack.Screen name="account/viewProfile" />
            <Stack.Screen name="account/notifications" />

            <Stack.Screen name="home/routes" />
            <Stack.Screen name="home/routes-create" />
            <Stack.Screen name="home/itineraries/itineraries" />
            <Stack.Screen name="home/itineraries/itineraries-create" />
            <Stack.Screen name="home/itineraries/[id]" />
            <Stack.Screen name="home/weather" />
            <Stack.Screen name="home/aiChat" />

            <Stack.Screen name="index" />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </SessionProvider>
    </SafeAreaView>
      
  );
}