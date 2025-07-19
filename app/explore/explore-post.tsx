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
        label="Create Post"
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  
});