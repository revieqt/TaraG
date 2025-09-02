import LocationAutocomplete, { LocationItem } from '@/components/LocationAutocomplete';
import TaraMap from '@/components/maps/TaraMap';
import TaraMarker from '@/components/maps/TaraMarker';
import CubeButton from '@/components/CubeButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedIcons } from '@/components/ThemedIcons';
import ToggleButton from '@/components/ToggleButton';
import Button from '@/components/Button';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import BottomSheet from '@/components/BottomSheet';
import { StyleSheet, View, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import LocationDisplay from '@/components/LocationDisplay';
import { useLocation } from '@/hooks/useLocation';
import { useThemeColor } from '@/hooks/useThemeColor';

const MODES = [
  { label: 'Car', value: 'driving-car', icon: 'directions-car', iconLibrary: 'MaterialIcons' },
  { label: 'Bicycle', value: 'cycling-regular', icon: 'directions-bike', iconLibrary: 'MaterialIcons' },
  { label: 'Walking', value: 'foot-walking', icon: 'directions-walk', iconLibrary: 'MaterialIcons' },
  { label: 'Hiking', value: 'foot-hiking', icon: 'hiking', iconLibrary: 'MaterialCommunityIcons' },
];

export default function CreateRouteScreen() {
  const [endLocation, setEndLocation] = useState<LocationItem | null>(null);
  const [waypoints, setWaypoints] = useState<LocationItem[]>([]);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const secondaryColor = useThemeColor({}, 'accent');

  const { suburb , city } = useLocation();

  const handleAddWaypoint = () => {
    setWaypoints([...waypoints, { locationName: '', latitude: null, longitude: null, note: '' }]);
  };

  const handleWaypointSelect = (index: number, location: LocationItem) => {
    const updatedWaypoints = [...waypoints];
    updatedWaypoints[index] = location;
    setWaypoints(updatedWaypoints);
  };

  const handleRemoveWaypoint = (index: number) => {
    const updatedWaypoints = waypoints.filter((_, i) => i !== index);
    setWaypoints(updatedWaypoints);
  };

  const handleModeToggle = (value: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedMode(value);
    } else {
      setSelectedMode(null);
    }
  };

  const handleGenerateRoute = () => {
    console.log('Generate route with:', {  endLocation, waypoints, selectedMode });
  };

  return (
    <View style={{ flex: 1 }}>
      {/* <TaraMap showMarker={false}/> */}
      <View style={styles.header}>
        <LinearGradient
          colors={['#000', 'transparent']}
          style={styles.headerGradient}
        />
        <View style={styles.headerTitle}>
          <ThemedText type="title" style={{color: '#fff'}}>
            Hello Traveler
          </ThemedText>
          <ThemedText type="subtitle" style={{color: '#fff'}}>
            Where are we going today?
          </ThemedText>
        </View>
      </View>
      
      <BottomSheet snapPoints={[0.5, 0.83]} defaultIndex={0} style={{zIndex: 100}}>
        <ScrollView showsVerticalScrollIndicator={false}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={{marginBottom: 30}}
          contentContainerStyle={styles.modeRowContent}
        >
            {MODES.map((mode) => (
              <TouchableOpacity
                key={mode.value}
                onPress={() => handleModeToggle(mode.value, true)}
              >
                <ThemedView
                style={[
                  styles.modeButton,
                  selectedMode === mode.value && {backgroundColor: secondaryColor},
                ]}>
                  <ThemedIcons library={mode.iconLibrary} name={mode.icon} size={15}/>
                  <ThemedText>
                    {mode.label}
                  </ThemedText>
                </ThemedView>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <LocationDisplay
            content={[
              // Start Location
              <View key="start">
                <ThemedText type="defaultSemiBold">Your Location</ThemedText>
                <ThemedText style={{opacity: .5}}>{suburb}, {city}</ThemedText>
              </View>,
              
              // Waypoints
              ...waypoints.map((waypoint, index) => (
                <View key={`waypoint-${index}`}>
                  <View style={styles.waypointHeader}>
                    <ThemedText type="defaultSemiBold">
                      Waypoint {index + 1}
                    </ThemedText>
                    <TouchableOpacity 
                      onPress={() => handleRemoveWaypoint(index)}
                      style={styles.removeButton}
                    >
                      <ThemedIcons library="MaterialIcons" name="close" size={20} color="#ff4444" />
                    </TouchableOpacity>
                  </View>
                  <LocationAutocomplete
                    value={waypoint.locationName}
                    onSelect={(location) => handleWaypointSelect(index, location)}
                    placeholder={`Enter waypoint ${index + 1}`}
                  />
                </View>
              )),
              
              // End Location
              <View key="end">
                <ThemedText type="defaultSemiBold">To</ThemedText>
                <LocationAutocomplete
                  value={endLocation?.locationName || ''}
                  onSelect={setEndLocation}
                  placeholder="Enter destination"
                />
              </View>
            ]}
          />

          {/* Add Waypoint Button */}
          <Button
            title="Add Waypoint"
            onPress={handleAddWaypoint}
            type="outline"
          />
          <Button
            title="Generate Route"
            onPress={handleGenerateRoute}
            type="primary"
            buttonStyle={{marginTop: 10}}
          />
        </ScrollView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    zIndex: 1,
  },
  headerTitle: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 20,
    color: '#fff',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    opacity: .7,
  },
  locationContainer: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 50,
    marginBottom: 20,
  },
  waypointHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  removeButton: {
    padding: 4,
  },
  modeRowContent: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 5,
  },
  modeButton: {
    minWidth: 80,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  modeButtonText: {
    color: '#333',
    fontSize: 16,
  },
});