import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import BackButton from '@/components/custom/BackButton';
import ViewItinerary from '@/components/custom/ViewItinerary';
import CollapsibleHeader from '@/components/CollapsibleHeader';
import TaraMap from '@/components/maps/TaraMap';
import TaraMarker from '@/components/maps/TaraMarker';
import { getItinerariesById } from '@/services/firestore/itinerariesDbService';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ItineraryViewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [itinerary, setItinerary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      (async () => {
        setLoading(true);
        setError(null);
        const result = await getItinerariesById(id as string);
        if (result.success) {
          setItinerary(result.data);
        } else {
          setError(result.errorMessage || 'Failed to fetch itinerary');
        }
        setLoading(false);
      })();
    }
  }, [id]);

  // Extract all locations from the itinerary
  const getAllLocations = () => {
    if (!itinerary?.locations) return [];
    
    const locations: any[] = [];
    itinerary.locations.forEach((day: any, dayIndex: number) => {
      if (Array.isArray(day.locations)) {
        day.locations.forEach((location: any, locIndex: number) => {
          if (location.latitude && location.longitude) {
            locations.push({
              ...location,
              dayIndex,
              locIndex,
              label: `${dayIndex + 1}.${locIndex + 1}`
            });
          }
        });
      } else if (day.latitude && day.longitude) {
        // For non-daily itineraries
        locations.push({
          ...day,
          dayIndex: 0,
          locIndex: dayIndex,
          label: `${dayIndex + 1}`
        });
      }
    });
    return locations;
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <BackButton type='floating'/>
      {loading && <ActivityIndicator style={{ marginTop: 32 }} />}
      {error && <ThemedText style={{ color: 'red', margin: 24 }}>{error}</ThemedText>}
      {!loading && !error && itinerary && (
        <ScrollView>
          <CollapsibleHeader defaultHeight={SCREEN_HEIGHT/2} expandedAllowance={75}>
            <TaraMap showMarker={false}>
              {getAllLocations().map((location, index) => (
                <TaraMarker
                  key={`${location.dayIndex}-${location.locIndex}`}
                  coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                  }}
                  color="#4300FF"
                  label={location.label}
                />
              ))}
            </TaraMap>
          </CollapsibleHeader>
          <ViewItinerary json={itinerary} />
        </ScrollView>
      )}
    </ThemedView>
  );
} 