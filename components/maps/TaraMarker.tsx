import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Marker } from 'react-native-maps';
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

  return (
    <Marker coordinate={coordinate} anchor={{ x: 0.5, y: 0.5 }}>
      <View style={[styles.circle, { borderColor: markerColor }]}>
        {icon ? (
          <Image source={{ uri: icon }} style={styles.icon} />
        ) : (
          <ThemedText style={{color: markerColor, textAlign: 'center'}}>{label}</ThemedText>
        )}
      </View>
    </Marker>
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