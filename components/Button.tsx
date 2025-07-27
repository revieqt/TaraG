import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  buttonStyle?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  type?: 'outline' | 'primary';
  disabled?: boolean;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  buttonStyle,
  textStyle,
  type = 'outline',
  disabled = false,
  loading = false,
}) => {
  const colorScheme = useColorScheme();
  const gradientColors: readonly [string, string] = [
    Colors[colorScheme ?? 'light'].secondary,
    Colors[colorScheme ?? 'light'].accent,
  ];

  if (type === 'primary') {
    return (
      <TouchableOpacity
        onPress={disabled || loading ? undefined : onPress}
        activeOpacity={0.85}
        style={[
          styles.outlineButton, // Use outlineButton style for primary
          buttonStyle,
          disabled ? { opacity: 0.5 } : null,
          { borderWidth: 0, paddingVertical: 0, paddingHorizontal: 0 }, // Remove border/padding for gradient
        ]}
        disabled={disabled || loading}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientPrimary}
        >
          <Text style={[styles.primaryText, textStyle]}>
            {loading ? 'Loading...' : title}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // Outline (default)
  return (
    <TouchableOpacity
      onPress={disabled || loading ? undefined : onPress}
      style={[
        styles.outlineButton,
        buttonStyle,
        disabled ? { opacity: 0.5 } : null,
      ]}
      disabled={disabled || loading}
    >
      <Text style={[styles.outlineText, textStyle]}>
        {loading ? 'Loading...' : title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  outlineButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#205781',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    overflow: 'hidden',
  },
  outlineText: {
    color: '#205781',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  gradientPrimary: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  primaryText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Button;