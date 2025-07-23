import { ThemedView } from '@/components/ThemedView';
import CollapsibleHeader from '@/components/CollapsibleHeader';
import { ThemedIcons } from '@/components/ThemedIcons';
import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity} from 'react-native';
import BackButton from '@/components/custom/BackButton';
import SOSButton from '@/components/custom/SOSButton';
import { ThemedText } from '@/components/ThemedText';
import GradientMeshBackground from '@/components/GradientMeshBackground';
import OptionsPopup from '@/components/OptionsPopup';


export default function SafetyScreen() {
  

  return (
    <ThemedView style={{flex:1}}>
      <BackButton style={styles.backButton}/>
      <OptionsPopup actions={[]} style={{position: 'absolute', top: 25, right: 20, zIndex: 100}}> 
        <ThemedIcons library="MaterialCommunityIcons" name="dots-vertical" size={22}/>
      </OptionsPopup>
      
      <CollapsibleHeader disableExpand defaultHeight={210}>
        <GradientMeshBackground gradientBackground/>

        <View style={styles.header}>
          <SOSButton/>
          <View style={{height: '100%', justifyContent: 'center'}}>
            <ThemedText type='subtitle'>Emergency State</ThemedText>
            <ThemedText type='defaultSemiBold'>Safety Mode</ThemedText>
          </View>
        </View>
      </CollapsibleHeader>

      <View style={{padding: 20}}>
        <View style={styles.helpMenu}>
          <ThemedView shadow style={styles.helpButton}>
            <TouchableOpacity style={styles.helpButtonContent}>
              <ThemedIcons library='MaterialIcons' name='local-hospital' size={20}/>
              <ThemedText>Hospitals</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          <ThemedView shadow style={styles.helpButton}>
            <TouchableOpacity style={styles.helpButtonContent}>
              <ThemedIcons library='MaterialIcons' name='local-police' size={20}/>
              <ThemedText>Police</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          <ThemedView shadow style={styles.helpButton}>
            <TouchableOpacity style={styles.helpButtonContent}>
              <ThemedIcons library='MaterialIcons' name='local-fire-department' size={20}/>
              <ThemedText>Fire Station</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          <ThemedView shadow style={styles.helpButton}>
            <TouchableOpacity style={styles.helpButtonContent}>
              <ThemedIcons library='MaterialIcons' name='supervised-user-circle' size={20}/>
              <ThemedText>Tourist Desk</ThemedText>
            </TouchableOpacity>
          </ThemedView>

        </View>
      </View>
      
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 70,
    position: 'absolute',
    zIndex: 10,
    flexDirection: 'row',
    gap: 15
  },
  backButton:{
    position: 'absolute',
    zIndex: 100,
    top: 16,
    left: 16,
  },
  helpMenu:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  helpButton:{
    width: "48%",
    height: 50,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  helpButtonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  }
});