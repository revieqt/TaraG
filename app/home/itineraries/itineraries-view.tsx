import BottomSheet from '@/components/BottomSheet';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import OptionsPopup from '@/components/OptionsPopup';
import { ThemedIcons } from '@/components/ThemedIcons';
import BackButton from '@/components/custom/BackButton';
import ViewItinerary from '@/components/custom/ViewItinerary';
import TaraMap from '@/components/maps/TaraMap';
import TaraMarker from '@/components/maps/TaraMarker';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';


export default function ItineraryViewScreen() {
  const { itineraryData } = useLocalSearchParams<{ itineraryData?: string }>();
  const [itinerary, setItinerary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (itineraryData) {
      try {
        setItinerary(JSON.parse(itineraryData));
        setError(null);
      } catch (err) {
        setError('Failed to parse itinerary data.');
        setItinerary(null);
      }
    } else {
      setError('No itinerary data provided.');
      setItinerary(null);
    }
    setLoading(false);
  }, [itineraryData]);

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
      <BackButton type='floating' />
      {/* Map */}
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

      <BottomSheet
        snapPoints={[0.25, 0.9]}
        defaultIndex={0}
      >
        {itinerary && (itinerary.status === 'upcoming' || itinerary.status === 'current') ? (
          <OptionsPopup
            actions={[
              {
                label: 'Create a Group Trip with this Itinerary',
                icon: <ThemedIcons library="MaterialIcons" name="group" size={20} />,
                onPress: () => [],
              },
              {
                label: 'Update Itinerary',
                icon: <ThemedIcons library="MaterialIcons" name="edit" size={20} />,
                onPress: () => [],
              },
              {
                label: 'Mark Itinerary as Completed',
                icon: <ThemedIcons library="MaterialIcons" name="check" size={20} />,
                onPress: () => [],
              },
              {
                label: 'Cancel Itinerary',
                icon: <ThemedIcons library="MaterialIcons" name="cancel" size={20} />,
                onPress: () => [],
              },
              {
                label: 'Delete Itinerary',
                icon: <ThemedIcons library="MaterialIcons" name="delete" size={20} color="red" />,
                onPress: () => [],
              },
            ]}
            style={styles.options}
          >
            <ThemedIcons library="MaterialCommunityIcons" name="dots-vertical" size={24} color="#888" />
          </OptionsPopup>
        ) : (
          <OptionsPopup
            actions={[
              {
                label: 'Repeat Itinerary',
                icon: <ThemedIcons library="MaterialIcons" name="cancel" size={20} />,
                onPress: () => [],
              },
              {
                label: 'Delete Itinerary',
                icon: <ThemedIcons library="MaterialIcons" name="delete" size={20} color="red" />,
                onPress: () => [],
              },
            ]}
            style={styles.options}
          >
            <ThemedIcons library="MaterialCommunityIcons" name="dots-vertical" size={24} color="#888" />
          </OptionsPopup>
        )}
        {loading && <ActivityIndicator style={{ marginTop: 32 }} />}
        {error && <ThemedText style={{ color: 'red', margin: 24 }}>{error}</ThemedText>}
        {!loading && !error && itinerary && (<ViewItinerary json={itinerary} />)}
      </BottomSheet>
    </ThemedView>
  );
}


const styles = StyleSheet.create({
  options: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10,
  },
});