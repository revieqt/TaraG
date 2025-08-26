import Button from '@/components/Button';
import { ThemedIcons } from '@/components/ThemedIcons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSession } from '@/context/SessionContext';
import { auth } from '@/services/firestore/config';
import { fetchDocument } from '@/services/documentsApiService';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, TouchableOpacity, View, Modal } from 'react-native';
import { WebView } from 'react-native-webview';
import { SUPPORT_FORM_URL } from '@/constants/Config';

export default function AccountScreen() {
  const { session, clearSession } = useSession();
  const user = session?.user;

  const [showSupport, setShowSupport] = useState(false);

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

  // Helper to load a document and navigate
  const openDocument = async (docName: 'terms-mobileApp' | 'privacyPolicy-mobileApp' | 'manual-mobileApp') => {
    try {
      const doc = await fetchDocument(docName);
      router.push({
        pathname: '/account/info-view',
        params: { data: JSON.stringify(doc) }, // pass JSON as string
      });
    } catch (error) {
      Alert.alert('Error', `Failed to load ${docName}.`);
    }
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView
        style={{ width: '100%' }}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={true}
      >
        {/* User Header */}
        <ThemedView shadow color='primary' style={styles.header}>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() =>
              router.push({
                pathname: '/account/viewProfile',
                params: { userId: user?.id },
              })
            }
          >
            <Image
              source={{ uri: session?.user?.profileImage || 'https://ui-avatars.com/api/?name=User' }}
              style={styles.profileImage}
            />
            <View style={{ justifyContent: 'center' }}>
              <ThemedText type='defaultSemiBold'>{fullName}</ThemedText>
              <ThemedText>@{user?.username}</ThemedText>
            </View>
            <View style={{ position: 'absolute', right: 0 }}>
              <ThemedIcons library='MaterialIcons' name='arrow-forward-ios' size={20} />
            </View>
          </TouchableOpacity>
        </ThemedView>

        {/* Pro User Prompt */}
        {!user?.isProUser ? (
          <Button
            title='Unlock the full TaraG experience'
            onPress={() => router.push('/account/getPro')}
            buttonStyle={{
              width: '100%',
              marginBottom: 15,
            }}
          />
        ) : null}

        {/* Options */}
        <View style={styles.options}>
          <ThemedText style={styles.optionsTitle} type='defaultSemiBold'>
            Privacy and Security
          </ThemedText>
          <TouchableOpacity
            onPress={() => router.push('/auth/changePassword')}
            style={styles.optionsChild}
          >
            <ThemedIcons library='MaterialIcons' name='vpn-key' size={15} />
            <ThemedText>Change Password</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openDocument('privacyPolicy-mobileApp')} style={styles.optionsChild}>
            <ThemedIcons library='MaterialDesignIcons' name='file-eye' size={15} />
            <ThemedText>Privacy Policy</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openDocument('terms-mobileApp')} style={styles.optionsChild}>
            <ThemedIcons library='MaterialDesignIcons' name='file-alert' size={15} />
            <ThemedText>Terms and Conditions</ThemedText>
          </TouchableOpacity>

          <ThemedText style={styles.optionsTitle} type='defaultSemiBold'>
            Help and Support
          </ThemedText>
          <TouchableOpacity onPress={() => openDocument('manual-mobileApp')} style={styles.optionsChild}>
            <ThemedIcons library='MaterialDesignIcons' name='file-find' size={15} />
            <ThemedText>App Manual</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowSupport(true)} style={styles.optionsChild}>
            <ThemedIcons library='MaterialDesignIcons' name='headset' size={15} />
            <ThemedText>Contact Support</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <Button
          title='Logout'
          onPress={handleLogout}
          type='primary'
          buttonStyle={styles.logoutButton}
          textStyle={styles.logoutText}
        />
      </ScrollView>

      {/* Support Modal */}
      <Modal visible={showSupport} animationType="slide">
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowSupport(false)}
          >
            <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>Close</ThemedText>
          </TouchableOpacity>
          <WebView source={{ uri: SUPPORT_FORM_URL }} style={{ flex: 1 }} />
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 80,
    marginTop: 30,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
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
  closeButton: {
    backgroundColor: '#ff4444',
    padding: 12,
    alignItems: 'center',
  },
});
