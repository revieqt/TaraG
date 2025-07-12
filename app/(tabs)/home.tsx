import CollapsibleHeader from '@/components/CollapsibleHeader';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <ThemedView>
        <CollapsibleHeader
          buttons={
            <>

            </>
          }
        >
        </CollapsibleHeader>
        <Text style={styles.title}>Welcome Home!</Text>
        <Text style={styles.subtitle}>This is your home screen.</Text>

        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuOptions}>
            <ThemedView roundness={50} color='secondary' style={styles.menuButton}></ThemedView>
            <ThemedText>Routes</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuOptions}>
            <ThemedView roundness={50} color='secondary' style={styles.menuButton}></ThemedView>
            <ThemedText>Itineraries</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuOptions}>
            <ThemedView roundness={50} color='secondary' style={styles.menuButton}></ThemedView>
            <ThemedText>Weather</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuOptions}>
            <ThemedView roundness={50} color='secondary' style={styles.menuButton}></ThemedView>
            <ThemedText>TaraAI</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  menu:{
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  menuOptions:{
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  menuButton:{
    width: 50,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});