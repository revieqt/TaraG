import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Text } from 'react-native';

function TabBarLabel({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <Text
      style={{
        fontFamily: 'Roboto',
        fontSize: 11,
        color,
        marginTop: 2,
        textAlign: 'center',
      }}
    >
      {children}
    </Text>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const activeColor = Colors[colorScheme ?? 'light'].tint;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabel: ({ children, color }) => <TabBarLabel color={color}>{children}</TabBarLabel>,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            paddingHorizontal: 24,
            paddingBottom: 12,
            paddingTop: 5,
            height: 60,
          },
          default: {
            paddingHorizontal: 10,
            paddingBottom: 12,
            paddingTop: 5,
            height: 60,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={22}
              name={focused ? 'home' : 'home-outline'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={22}
              name={focused ? 'compass' : 'compass-outline'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="safety"
        options={{
          title: 'Safety',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={22}
              name={focused ? 'alert-circle' : 'alert-circle-outline'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={22}
              name={focused ? 'person' : 'person-outline'}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}