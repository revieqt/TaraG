import { useSession } from '@/context/SessionContext';
import { useLocation } from '@/hooks/useLocation';
import React, { ReactNode, useEffect, useRef } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import MapView, { Camera, PROVIDER_GOOGLE, Region } from 'react-native-maps';
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
  const { latitude, longitude, loading } = useLocation();
  const mapRef = useRef<MapView>(null);

  // Philippines bounding box coordinates
  const PHILIPPINES_REGION: Region = {
    latitude: 12.8797, // Center latitude of Philippines
    longitude: 121.7740, // Center longitude of Philippines
    latitudeDelta: 12.0, // Covers the whole Philippines from north to south
    longitudeDelta: 12.0, // Covers the whole Philippines from east to west
  };

  // Always center the map on the user's current location (unless using cameraProps)
  useEffect(() => {
    if (
      !cameraProps &&
      latitude !== 0 &&
      longitude !== 0 &&
      mapRef.current &&
      !loading // Only animate when location is loaded
    ) {
      mapRef.current.animateToRegion(
        {
          latitude: latitude as number,
          longitude: longitude as number,
          latitudeDelta: region?.latitudeDelta ?? 0.01,
          longitudeDelta: region?.longitudeDelta ?? 0.01,
        },
        500
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latitude, longitude, loading]);

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

  // Always start with Philippines view, then animate to user location when available
  const initialRegion: Region = region ?? PHILIPPINES_REGION;

  return (
    <View style={{ flex: 1 }}>
      <MapView
        mapType='standard'
        ref={mapRef}
        style={[styles.map, mapStyle]}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
      >
        {showMarker && session && latitude !== 0 && longitude !== 0 && !loading && (
          <TaraMarker
            coordinate={{
              latitude: latitude as number,
              longitude: longitude as number,
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