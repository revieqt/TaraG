import CubeButton from '@/components/CubeButton';
import Header from '@/components/Header';
import HorizontalSections from '@/components/HorizontalSections';
import { ThemedIcons } from '@/components/ThemedIcons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { deleteItinerary, useGetItinerariesByUser } from '@/services/itinerariesApiService';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

function segregateItineraries(itineraries: any[]) {
  const ongoing: any[] = [];
  const upcoming: any[] = [];
  const history: any[] = [];
  itineraries.forEach(it => {
    if (it.status === 'ongoing') ongoing.push(it);
    else if (it.status === 'upcoming') upcoming.push(it);
    else history.push(it);
  });
  return { ongoing, upcoming, history };
}

export default function ItinerariesScreen() {
  const getItineraries = useGetItinerariesByUser();
  const getItinerariesRef = React.useRef(getItineraries);
  getItinerariesRef.current = getItineraries;

  const [itineraries, setItineraries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshFlag, setRefreshFlag] = useState(0);

  // Set up a timer to refresh at midnight Asia/Manila
  useEffect(() => {
    function msUntilNextManilaMidnight() {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const manilaNow = new Date(utc + 8 * 60 * 60000);
      const nextMidnight = new Date(manilaNow);
      nextMidnight.setHours(24, 0, 0, 0);
      return nextMidnight.getTime() - manilaNow.getTime();
    }
    const timer = setTimeout(() => {
      setRefreshFlag(f => f + 1);
    }, msUntilNextManilaMidnight());
    return () => clearTimeout(timer);
  }, [refreshFlag]);

  // Fetch itineraries when refreshFlag changes
  useEffect(() => {
    setLoading(true);
    setError(null);
    getItinerariesRef.current().then(result => {
      if (result.success) {
        setItineraries(result.data || []);
      } else {
        setError(result.errorMessage || 'Failed to fetch itineraries');
      }
      setLoading(false);
    });
  }, [refreshFlag]);

  // Call this after data changes (delete, cancel, mark as completed)
  const handleDataChanged = () => {
    setRefreshFlag(f => f + 1);
  };

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
              handleDataChanged();
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

  const { ongoing, upcoming, history } = segregateItineraries(itineraries);

  return (
    <ThemedView style={{ flex: 1 }}>
      <Header label="Itineraries" />
      <HorizontalSections
        labels={['Ongoing', 'Upcoming', 'History']}
        type="fullTab"
        containerStyle={{ flex: 1 }}
        sections={[
        <View key="ongoing" style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'stretch', padding: 16 }}>
          {loading && 
            <ActivityIndicator size="large" style={{marginTop: 20}}/>
          }
          {error && <ThemedView><ThemedIcons library="MaterialIcons" name="error" size={24} color="red" /></ThemedView>}
          {!loading && !error && ongoing.length === 0 && (
            <ThemedView><ThemedText>No ongoing itinerary found.</ThemedText></ThemedView>
          )}
          {!loading && !error && ongoing.map((itinerary) => (
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
        <View key="upcoming" style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'stretch', padding: 16 }}>
          {loading && 
            <ActivityIndicator size="large" style={{marginTop: 20}}/>
          }
          {error && <ThemedView><ThemedIcons library="MaterialIcons" name="error" size={24} color="red" /></ThemedView>}
          {!loading && !error && upcoming.length === 0 && (
            <ThemedView><ThemedText>No upcoming itinerary found.</ThemedText></ThemedView>
          )}
          {!loading && !error && upcoming.map((itinerary) => (
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
        <View key="history" style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'stretch', padding: 16 }}>
          {loading && 
            <ActivityIndicator size="large" style={{marginTop: 20}}/>
          }
          {error && <ThemedView><ThemedIcons library="MaterialIcons" name="error" size={24} color="red" /></ThemedView>}
          {!loading && !error && history.length === 0 && (
            <ThemedView><ThemedText>No itinerary history found.</ThemedText></ThemedView>
          )}
          {!loading && !error && history.map((itinerary) => (
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
        </View>
        ]}
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