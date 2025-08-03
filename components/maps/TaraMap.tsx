import { useSession } from '@/context/SessionContext';
import { useLocation } from '@/hooks/useLocation';
import React, { ReactNode, useEffect, useRef } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import MapView, { Camera, PROVIDER_DEFAULT, Region } from 'react-native-maps';
import TaraMarker from './TaraMarker';

type CameraProps = {
  center: { latitude: number; longitude: number };
  pitch?: number;
  heading?: number;
  zoom?: number;
  altitude?: number;
  animationDuration?: number;
};

type TaraMapProps = {
  region?: Region;
  showMarker?: boolean;
  markerTitle?: string;
  markerDescription?: string;
  mapStyle?: StyleProp<ViewStyle>;
  children?: ReactNode;
  cameraProps?: CameraProps; // <-- Accept cameraProps
};

const TaraMap: React.FC<TaraMapProps> = ({
  region,
  showMarker = true,
  markerTitle = 'You are here',
  markerDescription = 'Current Location',
  mapStyle,
  children,
  cameraProps,
}) => {
  const { session } = useSession();
  const { latitude, longitude } = useLocation();
  const mapRef = useRef<MapView>(null);

  // Always center the map on the user's current location (unless using cameraProps)
  useEffect(() => {
    if (
      !cameraProps &&
      latitude !== 0 &&
      longitude !== 0 &&
      mapRef.current
    ) {
      mapRef.current.animateToRegion(
        {
          latitude: latitude || 0,
          longitude: longitude || 0,
          latitudeDelta: region?.latitudeDelta ?? 0.01,
          longitudeDelta: region?.longitudeDelta ?? 0.01,
        },
        500
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latitude, longitude]);

  // Animate camera if cameraProps is provided
  useEffect(() => {
    if (cameraProps && mapRef.current) {
      const camera: Partial<Camera> = {
        center: cameraProps.center,
        pitch: cameraProps.pitch ?? 0,
        heading: cameraProps.heading ?? 0,
        zoom: cameraProps.zoom ?? 16,
        altitude: cameraProps.altitude,
      };
      mapRef.current.animateCamera(camera, { duration: cameraProps.animationDuration ?? 500 });
    }
  }, [cameraProps?.center?.latitude, cameraProps?.center?.longitude, cameraProps?.pitch, cameraProps?.heading, cameraProps?.zoom, cameraProps?.altitude, cameraProps?.animationDuration]);

  // Use userCoordinates as region if region prop is not provided
  const initialRegion: Region = region ?? {
    latitude: latitude || 14.5995,
    longitude: longitude || 120.9842,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        mapType='standard'
        ref={mapRef}
        style={[styles.map, mapStyle]}
        provider={PROVIDER_DEFAULT}
        initialRegion={initialRegion}
      >
        {showMarker && session && latitude !== 0 && longitude !== 0 && (
          <TaraMarker
            coordinate={{
              latitude: latitude || 0,
              longitude: longitude || 0,
            }}
            color="#0065F8"
            icon={session.user?.profileImage}
          />
        )}
        {children}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  bottomFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '10%',
    zIndex: 10,
  },
});

export default TaraMap;