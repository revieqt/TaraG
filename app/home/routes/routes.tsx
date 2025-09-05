import RoundedButton from '@/components/RoundedButton';
import Header from '@/components/Header';
import OptionsPopup from '@/components/OptionsPopup';
import { ThemedIcons } from '@/components/ThemedIcons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import LocationDisplay from '@/components/LocationDisplay';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { useSession } from '@/context/SessionContext';

export default function RoutesScreen() {
  const { session, updateSession } = useSession();

  const handleAddRoute = () => {
    if (session?.activeRoute) {
      Alert.alert(
        "Active Route Detected",
        "You must end the active route before creating a new one.",
        [{ text: "OK", style: "default" }]
      );
      return;
    }
    router.push('/home/routes/routes-create');
  };

  const handleEndRoute = async () => {
    Alert.alert(
      "End Route",
      "Are you sure you want to end the current route?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "End Route", 
          style: "destructive",
          onPress: async () => {
            await updateSession({ activeRoute: undefined });
          }
        }
      ]
    );
  };

  const handleGoToMaps = () => {
    router.push('/(tabs)/maps');
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <Header 
        label="Routes" 
        rightButton={
          <OptionsPopup options={[
            <TouchableOpacity style={styles.options} onPress={() => router.push('/home/routes/routes-history')}>
              <ThemedIcons library="MaterialIcons" name="history" size={20} />
              <ThemedText>View History</ThemedText>
            </TouchableOpacity>,
            <TouchableOpacity style={styles.options}>
            <ThemedIcons library="MaterialIcons" name="settings" size={20} />
            <ThemedText>Route Settings</ThemedText>
          </TouchableOpacity>,
          ]}> 
            <ThemedIcons library="MaterialCommunityIcons" name="dots-vertical" size={22} color="#222" />
          </OptionsPopup>
        }
      />
      
      <View style={{padding: 20}}>
        {(session?.activeRoute && (
          <ThemedView color='primary' shadow style={{padding: 20, borderRadius: 10}}>
            <LocationDisplay 
              content={session.activeRoute.location.map((loc, index) => (
                <View key={index}>
                  <ThemedText>
                    {loc.locationName}
                  </ThemedText>
                  <ThemedText style={{opacity: .5}}>
                    {index === 0 ? 'Start' : 
                     index === session.activeRoute!.location.length - 1 ? 'Destination' : 
                     `Waypoint ${index}`}
                  </ThemedText>
                  
                </View>
              ))}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, {borderColor: '#ccc', borderWidth: 1}]} 
                onPress={handleGoToMaps}
              >
                <ThemedIcons library="MaterialIcons" name="map" size={25}/>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, {backgroundColor: '#dc3545',}]} 
                onPress={handleEndRoute}
              >
                <ThemedIcons library="MaterialIcons" name="stop" size={25} color="#fff"/>
              </TouchableOpacity>
            </View>
          </ThemedView>
        ))}
      </View>

      <RoundedButton
        size={60}
        iconName="add"
        iconColor="#fff"
        onPress={handleAddRoute}
        style={{position: 'absolute', bottom: 20, right: 20}}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  options:{
    flexDirection: 'row',
    gap: 10,
    padding: 5,
    flex: 1
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 30,
    gap: 8,
  },
});