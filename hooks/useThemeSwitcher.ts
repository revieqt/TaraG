import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

export type ThemeType = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'APP_THEME_PREFERENCE';

export function useThemeSwitcher() {
  const systemColorScheme = useSystemColorScheme();
  const [theme, setThemeState] = useState<ThemeType>('system');
  // Add a dummy state to force re-render
  const [version, setVersion] = useState(0);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setThemeState(stored);
      }
    })();
  }, []);

  const setTheme = useCallback(async (newTheme: ThemeType) => {
    setThemeState(newTheme);
    await AsyncStorage.setItem(STORAGE_KEY, newTheme);
    setVersion(v => v + 1); // force re-render
  }, []);

  // The effective theme to use in the app
  const effectiveTheme = theme === 'system' ? (systemColorScheme ?? 'light') : theme;

  return {
    theme, // 'system' | 'light' | 'dark'
    setTheme,
    effectiveTheme, // 'light' | 'dark'
  };
} 