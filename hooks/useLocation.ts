import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

// Import the fallback Metro Cebu address data
import metroCebuData from '@/constants/address-metroCebu.json';

interface LocationData {
  latitude: number;
  longitude: number;
  suburb: string;
  city: string;
  state: string;
  region: string;
  country: string;
}

interface NominatimResponse {
  address: {
    suburb?: string;
    city?: string;
    town?: string;
    state?: string;
    region?: string;
    country?: string;
  };
}

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  // Haversine formula
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function getNearestMetroCebuAddress(lat: number, lon: number) {
  let minDist = Infinity;
  let nearest = { barangay: '', city: '' };
  for (const cityObj of metroCebuData as any[]) {
    for (const district of cityObj.districts) {
      const dist = getDistance(lat, lon, district.lat, district.lon);
      if (dist < minDist) {
        minDist = dist;
        nearest = { barangay: district.barangay, city: cityObj.city };
      }
    }
  }
  return nearest;
}

export const useLocation = () => {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAddressFromCoordinates = async (latitude: number, longitude: number): Promise<LocationData> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=en`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch address data');
      }
      const data: NominatimResponse = await response.json();
      const address = data.address;
      return {
        latitude,
        longitude,
        suburb: address.suburb || address.city || '',
        city: address.city || address.town || '',
        state: address.state || '',
        region: address.region || '',
        country: address.country || '',
      };
    } catch (err) {
      // Fallback to local Metro Cebu data
      const nearest = getNearestMetroCebuAddress(latitude, longitude);
      return {
        latitude,
        longitude,
        suburb: nearest.barangay,
        city: nearest.city,
        state: '',
        region: '',
        country: '',
      };
    }
  };

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      setError(null);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied');
        setLoading(false);
        return;
      }
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = location.coords;
      const addressData = await getAddressFromCoordinates(latitude, longitude);
      setLocationData(addressData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get location');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const refreshLocation = () => {
    getCurrentLocation();
  };

  return {
    ...locationData,
    loading,
    error,
    refreshLocation,
  };
};
