import { router } from 'expo-router';
import React from 'react';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import { ThemedIcons } from '../ThemedIcons';
import { ThemedView } from '../ThemedView';

interface BackButtonProps {
  style?: StyleProp<ViewStyle>;
  type?: 'default' | 'circular' | 'floating';
}

export const BackButton: React.FC<BackButtonProps> = ({ style, type = 'default' }) => {
  const handlePress = () => {
    try {
      router.back();
    } catch {
      router.replace('/(tabs)/home');
    }
  };

  if (type === 'floating') {
    return (
      <ThemedView
        style={[
          {
            position: 'absolute',
            top: 32,
            left: 16,
            zIndex: 100,
            borderRadius: 24,
            overflow: 'hidden',
            elevation: 4,
          },
          style,
        ]}
      >
        <TouchableOpacity
          onPress={handlePress}
          style={{ width: 48, height: 48, justifyContent: 'center', alignItems: 'center' }}
          activeOpacity={0.7}
        >
          <ThemedIcons library="MaterialIcons" name="arrow-back" size={28} />
        </TouchableOpacity>
      </ThemedView>
    );
  }

  if (type === 'circular') {
    return (
      <ThemedView style={[{ borderRadius: 24, overflow: 'hidden' }, style]}>
        <TouchableOpacity
          onPress={handlePress}
          style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}
          activeOpacity={0.7}
        >
          <ThemedIcons library="MaterialIcons" name="arrow-back" size={24} />
        </TouchableOpacity>
      </ThemedView>
    );
  }

  // default
  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[{ padding: 8, backgroundColor: 'transparent' }, style]}
      activeOpacity={0.7}
    >
      <ThemedIcons library="MaterialIcons" name="arrow-back" size={24} />
    </TouchableOpacity>
  );
};

export default BackButton;
