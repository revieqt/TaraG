import CollapsibleHeader from '@/components/CollapsibleHeader';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function SafetyScreen() {

  return (
    <ThemedView style={{flex: 1}}>
      <CollapsibleHeader/>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});