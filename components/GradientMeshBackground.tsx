import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const GradientMeshBackground = () => {
  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Blob Top Left */}
      <LinearGradient
        colors={['#4e7cff', '#9b9bff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.blob, {
          top: -100,
          left: -100,
          width: 300,
          height: 300,
          borderRadius: 150,
        }]}
      />

      {/* Blob Bottom Right */}
      <LinearGradient
        colors={['#9b9bff', '#d1d1ff']}
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={[styles.blob, {
          bottom: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: 150,
        }]}
      />

      {/* Blob Center */}
      <LinearGradient
        colors={['#f4f4ff', '#e0e0ff']}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={[styles.blob, {
          top: height / 3,
          left: width / 4,
          width: 250,
          height: 250,
          borderRadius: 125,
        }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
    opacity: 0.5,
    zIndex: -1,
    transform: [{ rotate: '15deg' }],
    filter: 'blur(100px)', // Note: Web only. Mobile uses softness + opacity.
  },
});

export default GradientMeshBackground;
