import FabMenu from '@/components/FabMenu';
import Header from '@/components/Header';
import HorizontalSections from '@/components/HorizontalSections';
import { ThemedIcons } from '@/components/ThemedIcons';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Alert, TouchableOpacity } from 'react-native';
import { useGetItinerariesByUser } from '@/services/firestore/itinerariesDbService';
import { ThemedText } from '@/components/ThemedText';
import { deleteItinerary } from '@/services/firestore/itinerariesDbService';
import OptionsPopup from '@/components/OptionsPopup';
import LoadingAnimation from '@/components/LoadingAnimation';

export default function ItinerariesScreen() {
  const getItineraries = useGetItinerariesByUser();
  const [itineraries, setItineraries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      const result = await getItineraries();
      if (result.success) {
        setItineraries(result.data || []);
      } else {
        setError(result.errorMessage || 'Failed to fetch itineraries');
      }
      setLoading(false);
    })();
  }, []);

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Itinerary',
      'Are you sure you want to delete this itinerary?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive', onPress: async () => {
            const result = await deleteItinerary(id);
            if (result.success) {
              setItineraries((prev) => prev.filter((it) => it.id !== id));
            } else {
              Alert.alert('Error', result.errorMessage || 'Failed to delete itinerary');
            }
          }
        }
      ]
    );
  };

  // Helper for navigation to itinerary view
  const goToViewItinerary = (id: string) => {
    router.push(`/home/itineraries/${id}` as any);
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <Header label="Itineraries" />
      <HorizontalSections
        labels={['Pending', 'History']}
        type="fullTab"
        containerStyle={{ flex: 1 }}
        sections={[
        <View key="pending" style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'stretch', padding: 16 }}>
          {loading && 
          <ThemedView style={styles.loading}>
            <LoadingAnimation />
          </ThemedView>
          
          }
          {error && <ThemedView><ThemedIcons library="MaterialIcons" name="error" size={24} color="red" /></ThemedView>}
          {!loading && !error && itineraries.length === 0 && (
            <ThemedView><ThemedText>No itinerary found.</ThemedText></ThemedView>
          )}
          {!loading && !error && itineraries.map((itinerary) => (
            <ThemedView key={itinerary.id} shadow='soft' roundness={12} style={{ padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={() => goToViewItinerary(itinerary.id)} activeOpacity={0.7}>
                  <ThemedText type='defaultSemiBold'>{itinerary.title}</ThemedText>
                  <ThemedText>{`${itinerary.startDate?.slice(0,10)} to ${itinerary.endDate?.slice(0,10)}`}</ThemedText>
                  <ThemedText>{itinerary.type}</ThemedText>
                </TouchableOpacity>
              </View>
              <OptionsPopup
                actions={[
                  {
                    label: 'View Itinerary',
                    icon: <ThemedIcons library="MaterialIcons" name="visibility" size={20} color="#222" />,
                    onPress: () => goToViewItinerary(itinerary.id),
                  },
                  {
                    label: 'Delete Itinerary',
                    icon: <ThemedIcons library="MaterialIcons" name="delete" size={20} color="red" />,
                    onPress: () => handleDelete(itinerary.id),
                  },
                ]}
                style={{ marginLeft: 12 }}
              >
                <ThemedIcons library="MaterialCommunityIcons" name="dots-vertical" size={24} color="#888" />
              </OptionsPopup>
            </ThemedView>
          ))}
        </View>,
        <View key="history" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ThemedView>
          </ThemedView>
        </View>]}
      />
      <FabMenu
        mainLabel="Create Itinerary"
        mainIcon={<ThemedIcons library='MaterialIcons' name="add" size={32} color="#fff" />}
        mainOnPress={() => router.push('/home/itineraries/itineraries-create')}
        actions={[]}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  itineraryRow:{
    padding: 12,
  },
  loading:{
    width: '100%',
    height: 100,
    borderRadius: 10,
  }
});