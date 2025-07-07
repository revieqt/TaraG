import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ViewProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>View Profile</Text>
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
  },
});