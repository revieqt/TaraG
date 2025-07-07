import Button from '@/components/Button';
import { Collapsible } from '@/components/Collapsible';
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
    <ScrollView
      style={{ width: '100%' }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.profileButton} onPress={() => {router.push('/account/viewProfile')}}>
          <Image
            source={
              user?.profileImage
                ? { uri: user?.profileImage }
                : require('@/assets/images/defaultUser.jpg')
            }
            style={styles.profileImage}
          />
          <View style={{justifyContent: 'center'}}>
            <ThemedText >{fullName}</ThemedText>
            <ThemedText >@{user?.username}</ThemedText>
            <ThemedText type='link'>View Profile</ThemedText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/account/notifications')} style={styles.notifications}>
          <ThemedIcons library='MaterialIcons' name='notifications' size={24}></ThemedIcons>
        </TouchableOpacity>
      </View>
      

      <ThemedView style={styles.options}>
        <ThemedText type='subtitle'>Settings</ThemedText>
        <Collapsible title="General Information">
          <ThemedView style={styles.collapsibleChild}>
            <ThemedText>Name: {user?.fname} {user?.mname} {user?.lname}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.collapsibleChild}>
            <ThemedText>Username: {user?.username}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.collapsibleChild}>
            <ThemedText>Gender: {user?.gender}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.collapsibleChild}>
            <ThemedText>Email: {user?.email}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.collapsibleChild}>
            <ThemedText>Phone: {user?.contactNumber}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.collapsibleChild}>
            <ThemedText>Type: {user?.type}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.collapsibleChild}>
            <ThemedText>Status: {user?.status}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.collapsibleChild}>
            <ThemedText>Created: {user?.createdOn instanceof Date ? user?.createdOn.toLocaleString() : ''}</ThemedText>
          </ThemedView>
        </Collapsible>

        <Collapsible title="Privacy and Security">

          <TouchableOpacity>
            <ThemedView style={styles.collapsibleChild} >
              <ThemedIcons library='MaterialIcons' name='notifications' size={15}/><ThemedText>Push Notifications</ThemedText>
            </ThemedView>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/auth/changePassword')}>
            <ThemedView style={styles.collapsibleChild} >
              <ThemedIcons library='MaterialIcons' name='vpn-key' size={15}/><ThemedText>Change Password</ThemedText>
            </ThemedView>
          </TouchableOpacity>

          { !auth.currentUser?.emailVerified ? 
            <TouchableOpacity onPress={() => router.push('/auth/verifyEmail')}>
              <ThemedView style={styles.collapsibleChild} >
                <ThemedIcons library='MaterialIcons' name='mark-email-read' size={15}/><ThemedText>Verify your Email</ThemedText>
              </ThemedView>
            </TouchableOpacity>
            : null
          }

          
          
        </Collapsible>

        <Collapsible title="Tour Guide Settings">
          {user?.type === 'tourGuide' ? 
            <View>
              <TouchableOpacity>
                <ThemedView style={styles.collapsibleChild} >
                  <ThemedIcons library='MaterialIcons' name='tour' size={15}/><ThemedText >View Tour Guide Information</ThemedText>
                </ThemedView>
              </TouchableOpacity>
              <TouchableOpacity >
                <ThemedView style={styles.collapsibleChild} >
                  <ThemedIcons library='MaterialIcons' name='tour' size={15}/><ThemedText >Manage Tours</ThemedText>
                </ThemedView>
              </TouchableOpacity>
            </View>
            :
            <TouchableOpacity>
              <ThemedView style={styles.collapsibleChild} >
                <ThemedIcons library='MaterialIcons' name='tour' size={15}/><ThemedText >Apply as Tour Guide</ThemedText>
              </ThemedView>
            </TouchableOpacity>
          }
        </Collapsible>

        {/* UNFINISHED AREA */}
        <Collapsible title="Help and Support">
          <TouchableOpacity>
            <ThemedView style={styles.collapsibleChild}>
              <ThemedIcons library='FontAwesome' name='file-text' size={15}/><ThemedText >App Manual</ThemedText>
            </ThemedView>
          </TouchableOpacity>
          <TouchableOpacity>
            <ThemedView style={styles.collapsibleChild}>
              <ThemedIcons library='FontAwesome' name='paste' size={15}/><ThemedText >Terms and Conditions</ThemedText>
            </ThemedView>
          </TouchableOpacity>
          <TouchableOpacity>
            <ThemedView style={styles.collapsibleChild}>
              <ThemedIcons library='MaterialIcons' name='contact-support' size={15}/><ThemedText >Contact Support</ThemedText>
            </ThemedView>
          </TouchableOpacity>
        </Collapsible>


        
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
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    height: 100,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  profileImage: {
    width: 80,
    aspectRatio: 1,
    borderRadius: 50,
    marginBottom: 16,
    backgroundColor: '#eee',
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
    marginTop: 30,
    gap: 10,
    width: '100%',
  },
  collapsibleChild: {
    padding: 10,
    fontSize: 15,
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    overflow: 'hidden',
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