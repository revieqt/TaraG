import EmailVerificationModal from '@/components/modals/EmailVerificationModal';
import { auth } from '@/services/firestore/config';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function SOSScreen() {
  const [showModal, setShowModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      // Check if user is logged in and not verified
      if (auth.currentUser && !auth.currentUser.emailVerified) {
        setShowModal(true);
      } else {
        setShowModal(false);
      }
    }, [auth.currentUser])
  );

  return (
    <View style={styles.container}>
      <EmailVerificationModal visible={showModal} onClose={() => setShowModal(false)} />
      <Text style={styles.title}>Explore</Text>
      <Text style={styles.subtitle}>
        {auth.currentUser?.emailVerified
          ? 'Welcome to the Explore area!'
          : 'You need to verify your email to access this area.'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});