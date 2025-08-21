import LocationAutocomplete, { LocationItem } from '@/components/LocationAutocomplete';
import TaraMap from '@/components/maps/TaraMap';
import TaraMarker from '@/components/maps/TaraMarker';
import CubeButton from '@/components/CubeButton';
import { ThemedText } from '@/components/ThemedText';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocation } from '@/hooks/useLocation';
import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';

const MODES = [
  { label: 'Car', value: 'driving-car', icon: 'directions-car', iconLibrary: 'MaterialIcons' },
  { label: 'Bicycle', value: 'cycling-regular', icon: 'directions-bike', iconLibrary: 'MaterialIcons' },
  { label: 'Walking', value: 'foot-walking', icon: 'directions-walk', iconLibrary: 'MaterialIcons' },
  { label: 'Hiking', value: 'foot-hiking', icon: 'hiking', iconLibrary: 'MaterialCommunityIcons' },
];

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function CreateRouteScreen() {
  const [step, setStep] = useState(1);
  const [endLocation, setEndLocation] = useState<LocationItem | null>(null);
  const [mode, setMode] = useState<string | null>(null);
  const [routes, setRoutes] = useState<any[]>([]);
  const [selectedRouteIdx, setSelectedRouteIdx] = useState<number>(0);
  const [waypoints, setWaypoints] = useState<LocationItem[]>([]);

  const userLocation = useLocation();

  // Step 1: Select end location
  const handleEndLocationSelect = (location: LocationItem) => {
    setEndLocation(location);
  };

  // Step 2: Select mode and fetch routes
  const handleModeSelect = async (selectedMode: string) => {
    setMode(selectedMode);
    if (userLocation.latitude && userLocation.longitude && endLocation) {
      const start = {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        locationName: userLocation.city || userLocation.suburb || 'Current Location',
      };
      const end = {
        latitude: endLocation.latitude!,
        longitude: endLocation.longitude!,
        locationName: endLocation.locationName,
      };
      const locations = [start, end];
      try {
        const { getRoutes } = await import('@/services/routeApiService');
        const fetchedRoutes = await getRoutes({
          location: locations,
          mode: selectedMode,
          alternatives: true,
        });
        setRoutes(fetchedRoutes);
        setStep(3);
      } catch (err) {
        // Handle error
      }
    }
  };

  // Step 3: Add waypoints and select route
  const handleAddWaypoint = (loc: LocationItem) => {
    setWaypoints([...waypoints, loc]);
  };

  // Render markers for start, end, and waypoints
  const renderMarkers = () => {
    const markers = [];
    if (userLocation.latitude && userLocation.longitude) {
      markers.push(
        <TaraMarker
          key="start"
          coordinate={{ latitude: userLocation.latitude, longitude: userLocation.longitude }}
          label="S"
          color="#4e7cff"
        />
      );
    }
    if (endLocation?.latitude && endLocation?.longitude) {
      markers.push(
        <TaraMarker
          key="end"
          coordinate={{ latitude: endLocation.latitude, longitude: endLocation.longitude }}
          label="E"
          color="#e0e0ff"
        />
      );
    }
    waypoints.forEach((wp, idx) => {
      if (wp.latitude && wp.longitude) {
        markers.push(
          <TaraMarker
            key={`wp-${idx}`}
            coordinate={{ latitude: wp.latitude, longitude: wp.longitude }}
            label={`${idx + 1}`}
            color="#9b9bff"
          />
        );
      }
    });
    return markers;
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['black', 'transparent']}
        style={styles.gradient}
      />

      {step === 1 && (
        <View style={styles.header}>
          <ThemedText type='title' style={{ color: 'white' }}>Where do you end your route?</ThemedText>
          <LocationAutocomplete
            value={endLocation?.locationName || ''}
            onSelect={handleEndLocationSelect}
            placeholder="Search for a destination..."
          />
        </View>
      )}

      <TaraMap mapStyle={{ flex: 1 }}>
        {renderMarkers()}
      </TaraMap>

      {/* Step 1: Show arrow button if end location is chosen */}
      {step === 1 && endLocation && (
        <CubeButton
          iconName="arrow-forward"
          iconLibrary="MaterialIcons"
          size={60}
          iconSize={32}
          iconColor="#fff"
          style={styles.nextButton}
          onPress={() => setStep(2)}
        />
      )}

      {/* Step 2: Mode selection */}
      {step === 2 && (
        <View style={styles.modeContainer}>
          <ThemedText type='title' style={{ color: 'white', marginBottom: 10 }}>Select mode of transportation</ThemedText>
          <View style={styles.modeRow}>
            {MODES.map(m => (
              <CubeButton
                key={m.value}
                iconName={m.icon}
                iconLibrary={m.iconLibrary as any}
                size={60}
                iconSize={32}
                iconColor={mode === m.value ? '#00bfae' : '#fff'}
                onPress={() => handleModeSelect(m.value)}
              />
            ))}
          </View>
          <View style={styles.bottomRow}>
            <CubeButton
              iconName="arrow-back"
              iconLibrary="MaterialIcons"
              size={50}
              iconSize={28}
              iconColor="#fff"
              style={styles.backButton}
              onPress={() => setStep(1)}
            />
            <CubeButton
              iconName="arrow-forward"
              iconLibrary="MaterialIcons"
              size={50}
              iconSize={28}
              iconColor="#fff"
              style={styles.proceedButton}
              onPress={() => mode && handleModeSelect(mode)}
            />
          </View>
        </View>
      )}

      {/* Step 3: Waypoints and alternative routes */}
      {step === 3 && (
        <View style={styles.routesContainer}>
          <ThemedText type='title' style={{ color: 'white', marginBottom: 10 }}>Alternative Routes</ThemedText>
          <View style={styles.routesList}>
            {routes.map((route, idx) => (
              <TouchableOpacity
                key={route.id || idx}
                style={[
                  styles.routeItem,
                  selectedRouteIdx === idx && styles.selectedRouteItem
                ]}
                onPress={() => setSelectedRouteIdx(idx)}
              >
                <ThemedText style={{ color: selectedRouteIdx === idx ? '#00bfae' : '#fff' }}>
                  {`Route ${idx + 1}: ${route.distance} km, ${route.duration} min`}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.waypointSection}>
            <ThemedText type='subtitle' style={{ color: 'white' }}>Add Waypoints</ThemedText>
            <LocationAutocomplete
              value=""
              onSelect={handleAddWaypoint}
              placeholder="Add a waypoint..."
              style={{ marginTop: 10 }}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: {
    position: 'absolute',
    opacity: 0.5,
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    zIndex: 2,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    zIndex: 3,
    padding: 20,
    paddingTop: 40,
  },
  nextButton: {
    position: 'absolute',
    bottom: 40,
    right: 30,
    zIndex: 10,
    backgroundColor: '#00bfae',
  },
  modeContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 10,
  },
  modeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modeButton: {
    marginHorizontal: 8,
    backgroundColor: '#222',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  backButton: {
    backgroundColor: '#00bfae',
  },
  proceedButton: {
    backgroundColor: '#00bfae',
  },
  routesContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 10,
  },
  routesList: {
    marginBottom: 20,
  },
  routeItem: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#333',
    marginBottom: 8,
  },
  selectedRouteItem: {
    backgroundColor: '#00bfae',
  },
  waypointSection: {
    marginTop: 10,
  },
});