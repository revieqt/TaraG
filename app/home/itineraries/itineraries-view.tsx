import BottomSheet from '@/components/BottomSheet';
import OptionsPopup from '@/components/OptionsPopup';
import { ThemedIcons } from '@/components/ThemedIcons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import BackButton from '@/components/custom/BackButton';
import ViewItinerary from '@/components/custom/ViewItinerary';
import TaraMap from '@/components/maps/TaraMap';
import TaraMarker from '@/components/maps/TaraMarker';
import {
  cancelItinerary as cancelItineraryApi,
  deleteItinerary as deleteItineraryApi,
  markItineraryAsDone,
} from '@/services/itinerariesApiService';
import { useSession } from '@/context/SessionContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity } from 'react-native';

export default function ItineraryViewScreen() {
  const { itineraryData } = useLocalSearchParams<{ itineraryData?: string }>();
  const { session } = useSession();
  const [itinerary, setItinerary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
              label: `${dayIndex + 1}.${locIndex + 1}`,
            });
          }
        });
      } else if (day.latitude && day.longitude) {
        locations.push({
          ...day,
          dayIndex: 0,
          locIndex: dayIndex,
          label: `${dayIndex + 1}`,
        });
      }
    });
    return locations;
  };

  // Handlers for actions
  const handleMarkAsCompleted = async () => {
    if (!itinerary?.id || !session?.accessToken) {
      Alert.alert('Error', 'No access token available');
      return;
    }
    setLoading(true);
    const result = await markItineraryAsDone(itinerary.id, session.accessToken);
    setLoading(false);
    if (result.success) {
      setItinerary({ ...itinerary, status: 'completed', manuallyUpdated: true });
      Alert.alert('Success', 'Itinerary marked as completed.');
      router.replace('/home/itineraries/itineraries');
    } else {
      setError(result.errorMessage || 'Failed to mark as completed');
    }
  };

  const handleCancel = async () => {
    if (!itinerary?.id || !session?.accessToken) {
      Alert.alert('Error', 'No access token available');
      return;
    }
    setLoading(true);
    const result = await cancelItineraryApi(itinerary.id, session.accessToken);
    setLoading(false);
    if (result.success) {
      setItinerary({ ...itinerary, status: 'cancelled', manuallyUpdated: true });
      Alert.alert('Success', 'Itinerary cancelled.');
      router.replace('/home/itineraries/itineraries');
    } else {
      setError(result.errorMessage || 'Failed to cancel itinerary');
    }
  };

  const handleDelete = async () => {
    if (!itinerary?.id) return;
    Alert.alert(
      'Delete Itinerary',
      'Are you sure you want to delete this itinerary? Doing so will remove the itinerary permanently.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive', onPress: async () => {
            if (!session?.accessToken) {
              Alert.alert('Error', 'No access token available');
              return;
            }
            setLoading(true);
            const result = await deleteItineraryApi(itinerary.id, session.accessToken);
            setLoading(false);
            if (result.success) {
              Alert.alert('Deleted', 'Itinerary deleted.');
              router.replace('/home/itineraries/itineraries');
            } else {
              setError(result.errorMessage || 'Failed to delete itinerary');
            }
          }
        }
      ]
    );
  };

  const handleGoToUpdateForm = () => {
    if (!itinerary || typeof itinerary !== 'object') {
      Alert.alert('Error', 'No itinerary data to update.');
      return;
    }
    router.push({
      pathname: '/home/itineraries/itineraries-form',
      params: { itineraryData: JSON.stringify(itinerary) }
    });
  };

  const showFirstOptions =
    itinerary && (itinerary.status === 'upcoming' || itinerary.status === 'current');

  return (
    <ThemedView style={{ flex: 1 }}>
      <BackButton type='floating' />
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

      <BottomSheet snapPoints={[0.25, 0.9]} defaultIndex={0}>
        {showFirstOptions ? (
          <OptionsPopup
            options={[
              <TouchableOpacity style={styles.optionsChild}>
                <ThemedIcons library="MaterialIcons" name="group" size={20} />
                <ThemedText>Create a Group Trip with this Itinerary (n/a)</ThemedText>
              </TouchableOpacity>,
              <TouchableOpacity style={styles.optionsChild}>
                <ThemedIcons library="MaterialIcons" name="edit" size={20} />
                <ThemedText>Update Itinerary</ThemedText>
              </TouchableOpacity>,
              <TouchableOpacity style={styles.optionsChild} onPress={handleMarkAsCompleted}>
                <ThemedIcons library="MaterialIcons" name="check" size={20} />
                <ThemedText>Mark Itinerary as Completed</ThemedText>
              </TouchableOpacity>,
              <TouchableOpacity style={styles.optionsChild} onPress={handleCancel}>
                <ThemedIcons library="MaterialIcons" name="cancel" size={20} />
                <ThemedText>Cancel Itinerary</ThemedText>
              </TouchableOpacity>,
              <TouchableOpacity style={styles.optionsChild} onPress={handleDelete}>
                <ThemedIcons library="MaterialIcons" name="delete" size={20} />
                <ThemedText>Delete Itinerary</ThemedText>
              </TouchableOpacity>,
            ]}
            style={styles.options}
          >
            <ThemedIcons library="MaterialCommunityIcons" name="dots-vertical" size={24} color="#888" />
          </OptionsPopup>
        ) : (
          <OptionsPopup
            options={[
              <TouchableOpacity style={styles.optionsChild}>
                <ThemedIcons library="MaterialIcons" name="history" size={20} />
                <ThemedText>Repeat Itinerary</ThemedText>
              </TouchableOpacity>,
              <TouchableOpacity style={styles.optionsChild} onPress={handleDelete}>
                <ThemedIcons library="MaterialIcons" name="delete" size={20} />
                <ThemedText>Delete Itinerary</ThemedText>
              </TouchableOpacity>
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
  optionsChild:{
    flexDirection: 'row',
    gap: 10,
    padding: 5
  }
});