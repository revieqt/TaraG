import Button from '@/components/Button';
import OptionsPopup from '@/components/OptionsPopup';
import { ThemedIcons } from '@/components/ThemedIcons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSession } from '@/context/SessionContext';
import { useThemeSwitcher } from '@/hooks/useThemeSwitcher';
import { auth } from '@/services/firestore/config';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import React from 'react';
import { Alert, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function AccountScreen() {
  const { session, clearSession } = useSession();
  const user = session?.user;
  const { theme, setTheme } = useThemeSwitcher();

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
        </ThemedView>
        
        <ThemedView style={styles.options}>
          <ThemedText type='subtitle'>Settings</ThemedText>

          {/* Privacy and Security */}
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

          <ThemedText style={styles.optionsTitle} type='defaultSemiBold'>Personalization</ThemedText>
          <OptionsPopup
            actions={[
              {
                label: 'System Theme',
                icon: <ThemedIcons library='MaterialIcons' name='settings' size={20} />,
                onPress: () => setTheme('system'),
              },
              {
                label: 'Light Mode',
                icon: <ThemedIcons library='MaterialIcons' name='light-mode' size={20} />,
                onPress: () => setTheme('light'),
              },
              {
                label: 'Dark Mode',
                icon: <ThemedIcons library='MaterialIcons' name='dark-mode' size={20} />,
                onPress: () => setTheme('dark'),
              },
            ]}
          >
            <ThemedView style={styles.optionsChild}>
              <ThemedIcons library='MaterialIcons' name='palette' size={15}/>
              <ThemedText>Theme Customization</ThemedText>
            </ThemedView>
          </OptionsPopup>
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
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    height: 100,
  },
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
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