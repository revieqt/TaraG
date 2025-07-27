import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');

type GradientMeshBackgroundProps = {
  gradientBackground?: boolean;
  style?: any;
};

const GradientMeshBackground: React.FC<GradientMeshBackgroundProps> = ({ gradientBackground = false, style }) => {
  const colorScheme = useColorScheme();
  const gradientColors: readonly [string, string] = [
    Colors[colorScheme ?? 'light'].secondary,
    Colors[colorScheme ?? 'light'].accent,
  ];
  
  // Use the height from style if provided, else fallback to window height
  const containerHeight = (style && style.height) || height;

  return (
    <View style={[StyleSheet.absoluteFill, style]}>
      {/* Always render the gradient as the back layer */}
      {gradientBackground && (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill, { height: containerHeight, width: '100%', zIndex: -10 }]}
        />
      )}

      {/* Blob Top Left */}
      <View
        style={[
          styles.blob,
          {
            top: -containerHeight * 0.18,
            left: -containerHeight * 0.18,
            width: containerHeight * 0.35,
            height: containerHeight * 0.35,
            borderRadius: (containerHeight * 0.35) / 2,
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
          },
        ]}
      />

      {/* Blob Bottom Right */}
      <View
        style={[
          styles.blob,
          {
            bottom: -containerHeight * 0.18,
            right: -containerHeight * 0.18,
            width: containerHeight * 0.35,
            height: containerHeight * 0.35,
            borderRadius: (containerHeight * 0.35) / 2,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
          },
        ]}
      />

      {/* Blob Center */}
      <View
        style={[
          styles.blob,
          {
            top: containerHeight * 0.33,
            left: width / 4,
            width: containerHeight * 0.28,
            height: containerHeight * 0.28,
            borderRadius: (containerHeight * 0.28) / 2,
            backgroundColor: '#e0e0ff',
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
    opacity: 0.5,
    zIndex: 1,
    transform: [{ rotate: '15deg' }],
    filter: 'blur(100px)', // Web only
  },
});

export default GradientMeshBackground;