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
      <TouchableOpacity style={styles.profileButton} onPress={() => {}}>
        <Image
          source={
            user?.profileImage
              ? { uri: user?.profileImage }
              : require('@/assets/images/defaultUser.jpg')
          }
          style={styles.profileImage}
        />
        <View style={{justifyContent: 'center'}}>
          <ThemedText type='subtitle'>{fullName}</ThemedText>
          <ThemedText >@{user?.username}</ThemedText>
          <ThemedText type='link'>View Profile</ThemedText>
        </View>
      </TouchableOpacity>

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
          <TouchableOpacity onPress={() => router.push('/auth/changePassword')}>
            <ThemedView style={styles.collapsibleChild} >
              <ThemedIcons library='MaterialIcons' name='vpn-key' size={15}/><ThemedText>Change Password</ThemedText>
            </ThemedView>
          </TouchableOpacity>
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
    width: '100%',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    height: 100,
  },
  profileImage: {
    width: 80,
    aspectRatio: 1,
    borderRadius: 50,
    marginBottom: 16,
    backgroundColor: '#eee',
    marginRight: 16,
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