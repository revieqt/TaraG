import Header from '@/components/Header';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { StyleSheet } from 'react-native';

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