import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function WeatherScreen() {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
});