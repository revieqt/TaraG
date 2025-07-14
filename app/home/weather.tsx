import Header from '@/components/Header';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function WeatherScreen() {

  return (
    <ThemedView style={{flex:1}}>
      <Header label='Weather'/>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
});