import FabMenu from '@/components/FabMenu';
import Header from '@/components/Header';
import HorizontalSections from '@/components/HorizontalSections';
import { ThemedIcons } from '@/components/ThemedIcons';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function ItinerariesScreen() {
  const labels = ['Pending', 'Archives'];
  const sections = [
    <View key="pending" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedView>
      </ThemedView>
    </View>,
    <View key="archives" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedView>
      </ThemedView>
    </View>,
  ];

  return (
    <ThemedView style={{ flex: 1 }}>
      <Header label="Itineraries" />
      <HorizontalSections
        labels={labels}
        sections={sections}
        type="fullTab"
        containerStyle={{ flex: 1 }}
      />
      <FabMenu
        mainLabel="Create Itinerary"
        mainIcon={<ThemedIcons library='MaterialIcons' name="add" size={32} color="#fff" />}
        mainOnPress={() => router.push('/home/itineraries-create')}
        actions={[]}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  
});