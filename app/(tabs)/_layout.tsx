import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Text, View } from 'react-native';

function TabBarIconWithTopBorder({
  name,
  focused,
  color,
  activeColor,
}: {
  name: any;
  color: string;
  focused: boolean;
  activeColor: string;
}) {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: 3,
        borderTopColor: focused ? activeColor : 'transparent',
        paddingTop: 3,
        paddingHorizontal: 8,
        height: 38,
        width: 38,
        marginTop: 8,
        borderRadius: 3,
      }}
    >
      <Ionicons size={22} name={name} color={color} />
    </View>
  );
}

function TabBarLabel({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <Text
      style={{
        fontFamily: 'Roboto',
        fontSize: 11,
        color,
        marginTop: 5,
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
            paddingTop: 8,
            height: 60,
          },
          default: {
            paddingHorizontal: 10,
            paddingBottom: 12,
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
            <TabBarIconWithTopBorder
              name={focused ? 'home' : 'home-outline'}
              color={color}
              focused={focused}
              activeColor={activeColor}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIconWithTopBorder
              name={focused ? 'compass' : 'compass-outline'}
              color={color}
              focused={focused}
              activeColor={activeColor}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="safety"
        options={{
          title: 'Safety',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIconWithTopBorder
              name={focused ? 'alert-circle' : 'alert-circle-outline'}
              color={color}
              focused={focused}
              activeColor={activeColor}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIconWithTopBorder
              name={focused ? 'person' : 'person-outline'}
              color={color}
              focused={focused}
              activeColor={activeColor}
            />
          ),
        }}
      />
    </Tabs>
  );
}