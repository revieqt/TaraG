import Button from '@/components/Button';
import { ThemedIcons } from '@/components/ThemedIcons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSession } from '@/context/SessionContext';
import { auth } from '@/services/firestore/config';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import React from 'react';
import { Alert, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function AccountScreen() {
  const { session, clearSession } = useSession();
  const user = session?.user;

  const fullName = [user?.fname, user?.mname, user?.lname].filter(Boolean).join(' ');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await clearSession();
      router.replace('/auth/login');
    } catch (err) {
      Alert.alert('Logout Failed', 'An error occurred while logging out.');
    }
  };

  return (
    <ThemedView>
      <ScrollView
        style={{ width: '100%' }}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={true}
      >
        <ThemedView style={styles.header}>
          <TouchableOpacity style={styles.profileButton} onPress={() => {router.push({ pathname: '/account/viewProfile', params: { userId: user?.id } })}}>
            <Image
              source={
                user?.profileImage
                  ? { uri: user?.profileImage }
                  : require('@/assets/images/defaultUser.jpg')
              }
              style={styles.profileImage}
            />
            <View style={{justifyContent: 'center'}}>
              <ThemedText type='defaultSemiBold'>{fullName}</ThemedText>
              <ThemedText >@{user?.username}</ThemedText>
            </View>
            <View style={{position: 'absolute', right: 0}}>
              <ThemedIcons library='MaterialIcons' name='arrow-forward-ios' size={20}/>
            </View>
            
          </TouchableOpacity>
        </ThemedView>
        
        <ThemedView style={styles.options}>
          <ThemedText style={styles.optionsTitle} type='defaultSemiBold'>Privacy and Security</ThemedText>
          <TouchableOpacity>
            <ThemedView style={styles.optionsChild} >
              <ThemedIcons library='MaterialIcons' name='notifications' size={15}/><ThemedText>Push Notifications</ThemedText>
            </ThemedView>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/auth/changePassword')}>
            <ThemedView style={styles.optionsChild} >
              <ThemedIcons library='MaterialIcons' name='vpn-key' size={15}/><ThemedText>Change Password</ThemedText>
            </ThemedView>
          </TouchableOpacity>

          {/* Tour Guide Settings */}
          <ThemedText style={styles.optionsTitle} type='defaultSemiBold'>Tour Guide Settings</ThemedText>
          {user?.type === 'tourGuide' ? 
            <View>
              <TouchableOpacity>
                <ThemedView style={styles.optionsChild} >
                  <ThemedIcons library='MaterialIcons' name='tour' size={15}/><ThemedText >View Tour Guide Information</ThemedText>
                </ThemedView>
              </TouchableOpacity>
              <TouchableOpacity >
                <ThemedView style={styles.optionsChild} >
                  <ThemedIcons library='MaterialIcons' name='tour' size={15}/><ThemedText >Manage Tours</ThemedText>
                </ThemedView>
              </TouchableOpacity>
            </View>
            :
            <TouchableOpacity>
              <ThemedView style={styles.optionsChild} >
                <ThemedIcons library='MaterialIcons' name='tour' size={15}/><ThemedText >Apply as Tour Guide</ThemedText>
              </ThemedView>
            </TouchableOpacity>
          }

          {/* Help and Support */}
          <ThemedText style={styles.optionsTitle} type='defaultSemiBold'>Help and Support</ThemedText>
          <TouchableOpacity>
            <ThemedView style={styles.optionsChild}>
              <ThemedIcons library='FontAwesome' name='file-text' size={15}/><ThemedText >App Manual</ThemedText>
            </ThemedView>
          </TouchableOpacity>
          <TouchableOpacity>
            <ThemedView style={styles.optionsChild}>
              <ThemedIcons library='FontAwesome' name='paste' size={15}/><ThemedText >Terms and Conditions</ThemedText>
            </ThemedView>
          </TouchableOpacity>
          <TouchableOpacity>
            <ThemedView style={styles.optionsChild}>
              <ThemedIcons library='MaterialIcons' name='contact-support' size={15}/><ThemedText >Contact Support</ThemedText>
            </ThemedView>
          </TouchableOpacity>
        </ThemedView>

        {/* Logout Button */}
        <Button
          title="Logout"
          onPress={handleLogout}
          type="primary"
          buttonStyle={styles.logoutButton}
          textStyle={styles.logoutText}
        />
      </ScrollView>
    </ThemedView>
    
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 100,
    marginTop: 10,
  },
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 50,
    aspectRatio: 1,
    borderRadius: 50,
    marginRight: 16,
  },
  notifications:{
    width: 80,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  fullName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  options: {
    gap: 10,
    width: '100%',
  },
  optionsTitle: {
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
  },
  optionsChild: {
    padding: 10,
    fontSize: 15,
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  logoutButton: {
    width: '100%',
    marginTop: 30,
  },
  logoutText: {
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
});