import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { View } from 'react-native';

interface ViewItineraryProps {
  json: any;
}

const ViewItinerary: React.FC<ViewItineraryProps> = ({ json }) => {
  const itinerary = json;

  return (
    <ThemedView style={{ flex: 1 }}>
      {itinerary && (
        <View style={{ padding: 20 }}>
          <ThemedText type="title" style={{ marginBottom: 8 }}>{itinerary.title}</ThemedText>
          <ThemedText>{itinerary.description}</ThemedText>
          <ThemedText style={{ marginTop: 8 }}>Type: {itinerary.type}</ThemedText>
          <ThemedText>Dates: {itinerary.startDate?.slice(0,10)} to {itinerary.endDate?.slice(0,10)}</ThemedText>
          <ThemedText>Plan Daily: {itinerary.planDaily ? 'Yes' : 'No'}</ThemedText>
          <ThemedText style={{ marginTop: 12, fontWeight: 'bold' }}>Locations:</ThemedText>
          {Array.isArray(itinerary.locations) && itinerary.locations.length > 0 ? (
            itinerary.locations.map((loc: any, idx: number) => (
              <View key={idx} style={{ marginBottom: 8, marginLeft: 8 }}>
                {loc.date && <ThemedText style={{ fontWeight: 'bold' }}>Day {idx + 1} ({loc.date?.slice(0,10)})</ThemedText>}
                {Array.isArray(loc.locations) ? (
                  loc.locations.map((l: any, i: number) => (
                    <ThemedText key={i} style={{ marginLeft: 8 }}>- {l.locationName} {l.note ? `(${l.note})` : ''}</ThemedText>
                  ))
                ) : (
                  <ThemedText>- {loc.locationName} {loc.note ? `(${loc.note})` : ''}</ThemedText>
                )}
              </View>
            ))
          ) : (
            <ThemedText style={{ marginLeft: 8 }}>No locations.</ThemedText>
          )}
        </View>
      )}
    </ThemedView>
  );
};

export default ViewItinerary; 