import CollapsibleHeader from '@/components/CollapsibleHeader';
import TabChooser from '@/components/TabChooser';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <ThemedView>
        <CollapsibleHeader
          buttons={
            <>
              {/* Add your custom buttons here if needed */}
            </>
          }
        >
        </CollapsibleHeader>
        <View style={{width: '100%', paddingHorizontal: 20}}>
          <ThemedText>You're currently at</ThemedText>
          <ThemedText type='subtitle'>Natalio Bacalso Rd., Minglanilla, Cebu</ThemedText>

          <View style={styles.menu}>
            <TouchableOpacity style={styles.menuOptions} onPress={() => router.push('/home/routes')}>
              <ThemedView roundness={50} color='secondary' style={styles.menuButton}></ThemedView>
              <ThemedText>Routes</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuOptions} onPress={() => router.push('/home/itineraries')}>
              <ThemedView roundness={50} color='secondary' style={styles.menuButton}></ThemedView>
              <ThemedText>Itineraries</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuOptions} onPress={() => router.push('/home/weather')}>
              <ThemedView roundness={50} color='secondary' style={styles.menuButton}></ThemedView>
              <ThemedText>Weather</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuOptions} onPress={() => router.push('/home/aiChat')}>
              <ThemedView roundness={50} color='secondary' style={styles.menuButton}></ThemedView>
              <ThemedText>TaraAI</ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.tabChooser}>
            <TabChooser tabs={['Near You', 'About Location', 'Search']} onTabChange={setSelectedTab} />
          </View>

          {/* Stacked tab areas, only one visible at a time, but all mounted */}
          <View style={[styles.tabArea, { display: selectedTab === 0 ? 'flex' : 'none' }]}> 
            <ThemedText type='subtitle'>Near You Content</ThemedText>
            {/* Place your Near You content here */}
          </View>
          <View style={[styles.tabArea, { display: selectedTab === 1 ? 'flex' : 'none' }]}> 
            <ThemedText type='subtitle'>About Location Content</ThemedText>
            {/* Place your About Location content here */}
          </View>
          <View style={[styles.tabArea, { display: selectedTab === 2 ? 'flex' : 'none' }]}> 
            <ThemedText type='subtitle'>Search Content</ThemedText>
            {/* Place your Search content here */}
          </View>
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
    paddingVertical: 20,
    marginBottom: 20,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
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
    alignItems: 'center',
    marginBottom: 5,
  },
  tabChooser:{
    width: '100%'
  },
  tabArea: {
    width: '100%',
    minHeight: 200,
    paddingVertical: 16,
  }
});