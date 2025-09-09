import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
// TaraMarker is now handled by expo-maps markers array - this component is kept for compatibility
import { ThemedText } from '../ThemedText';

interface TaraMarkerProps {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  color?: string; // optional override
  icon?: string; // optional URL or local path to profile photo
  label?: string; // optional label or number
}

const TaraMarker: React.FC<TaraMarkerProps> = ({ coordinate, color, icon, label }) => {
  const secondaryColor = useThemeColor({}, 'secondary');
  const markerColor = color || secondaryColor;

  // This component is now used for styling only - actual marker placement is handled by expo-maps
  return (
    <View style={[styles.circle, { borderColor: markerColor }]}>
      {icon ? (
        <Image source={{ uri: icon }} style={styles.icon} />
      ) : (
        <ThemedText style={{color: markerColor, textAlign: 'center'}}>{label}</ThemedText>
      )}
    </View>
  );
};

export default TaraMarker;

const styles = StyleSheet.create({
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  icon: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },
});