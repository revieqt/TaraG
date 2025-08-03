import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import TaraMap from '@/components/maps/TaraMap';
import { BackButton } from '@/components/custom/BackButton';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/ThemedText';
import LocationAutocomplete, { LocationItem } from '@/components/LocationAutocomplete';

export default function CreateRouteScreen() {
  const [selectedLocation, setSelectedLocation] = useState<LocationItem | null>(null);

  const handleLocationSelect = (location: LocationItem) => {
    setSelectedLocation(location);
    console.log('Selected location:', location);
  };

  return (
    <View style={{flex: 1}}>
      <LinearGradient
        colors={['black', 'transparent']}
        style={styles.gradient}
      />

      <View style={styles.header}>
        <ThemedText type='title' style={{color: 'white'}}>Where do you want to go?</ThemedText>
        <LocationAutocomplete
          value={""}
          onSelect={handleLocationSelect}
          placeholder="Search for a destination..."
        />
      </View>
      <TaraMap mapStyle={{flex: 1}}/>
    </View>
  );
}

const styles = StyleSheet.create({
  gradient:{
    position: 'absolute',
    opacity: 0.5,
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    zIndex: 2,
  },
  header:{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    zIndex: 3,
    padding: 20,
    paddingTop: 40,
  },
});