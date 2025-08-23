import CubeButton from '@/components/CubeButton';
import Header from '@/components/Header';
import HorizontalSections from '@/components/HorizontalSections';
import OptionsPopup from '@/components/OptionsPopup';
import { ThemedIcons } from '@/components/ThemedIcons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { deleteItinerary, useGetItinerariesByUser } from '@/services/firestore/itinerariesDbService';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

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

  // Pass the itinerary data directly to the view screen
  const goToViewItinerary = (itinerary: any) => {
    router.push({
      pathname: '/home/itineraries/itineraries-view',
      params: { itineraryData: JSON.stringify(itinerary) }
    });
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <Header label="Itineraries" />
      <HorizontalSections
        labels={['Current', 'Upcoming', 'History']}
        type="fullTab"
        containerStyle={{ flex: 1 }}
        sections={[
        <View key="current" style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'stretch', padding: 16 }}>
          {loading && 
            <ActivityIndicator size="large" style={{marginTop: 20}}/>
          }
          {error && <ThemedView><ThemedIcons library="MaterialIcons" name="error" size={24} color="red" /></ThemedView>}
          {!loading && !error && itineraries.length === 0 && (
            <ThemedView><ThemedText>No itinerary found.</ThemedText></ThemedView>
          )}
          {!loading && !error && itineraries.map((itinerary) => (
            <View key={itinerary.id} style={styles.itineraryRow}>
              <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={() => goToViewItinerary(itinerary)} activeOpacity={0.7}>
                  <ThemedText type='defaultSemiBold'>{itinerary.title}</ThemedText>
                  <View style={styles.typesContainer}>
                    <ThemedIcons library="MaterialIcons" name="edit-calendar" size={15}/>
                    <ThemedText style={styles.type}>{itinerary.type}</ThemedText>
                    <ThemedIcons library="MaterialDesignIcons" name="calendar" size={15}/>
                    <ThemedText style={styles.type}>{itinerary.startDate?.slice(0,10)}  to  {itinerary.endDate?.slice(0,10)}</ThemedText>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>,
        <View key="upcoming" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ThemedView>
            <ThemedText>Upcoming itineraries will be shown here.</ThemedText>
          </ThemedView>
        </View>,
        <View key="history" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ThemedView>
          </ThemedView>
        </View>]}
      />

      <CubeButton
        size={60}
        iconName="add"
        iconColor="#fff"
        onPress={() => router.push('/home/itineraries/itineraries-form')}
        style={{position: 'absolute', bottom: 20, right: 20}}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  itineraryRow:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  type:{
    marginLeft: 2,
    marginRight: 10,
    fontSize: 13,
    opacity: .5
  },
  typesContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 4
  }
});