import FabMenu from '@/components/FabMenu';
import Header from '@/components/Header';
import HorizontalSections from '@/components/HorizontalSections';
import OptionsPopup from '@/components/OptionsPopup';
import { ThemedIcons } from '@/components/ThemedIcons';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function RoutesScreen() {

  return (
    <ThemedView style={{ flex: 1 }}>
      <Header 
        label="Routes" 
        rightButton={
          <OptionsPopup actions={[]}> 
            <ThemedIcons library="MaterialCommunityIcons" name="dots-vertical" size={22} color="#222" />
          </OptionsPopup>
        }
      />
      <HorizontalSections
        labels={['Pending', 'Archives']}
        type="fullTab"
        containerStyle={{ flex: 1 }}
        sections={[
        <View key="pending" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ThemedView>
          </ThemedView>
        </View>,
        <View key="archives" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
  
});