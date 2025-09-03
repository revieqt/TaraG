import CubeButton from '@/components/CubeButton';
import Header from '@/components/Header';
import HorizontalSections from '@/components/HorizontalSections';
import OptionsPopup from '@/components/OptionsPopup';
import { ThemedIcons } from '@/components/ThemedIcons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { useSession } from '@/context/SessionContext';

export default function RoutesScreen() {
  const { session } = useSession();

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
        
      </View>

      <CubeButton
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
  }
});