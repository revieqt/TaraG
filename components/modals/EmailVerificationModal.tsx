import Button from '@/components/Button';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';

interface EmailVerificationModalProps {
  visible: boolean;
  onClose?: () => void;
}

const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <ThemedView style={styles.card}>
          <ThemedText type="title" style={styles.title}>
            Email Verification Needed
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Please verify your email to access this area. Check your inbox for a verification link or verify now.
          </ThemedText>
          <View style={styles.buttonRow}>
            <Button
              title="Go to Home"
              type="outline"
              onPress={() => {
                router.replace('/(tabs)/home');
                onClose && onClose();
              }}
              buttonStyle={styles.button}
            />
            <Button
              title="Verify Email"
              type="primary"
              onPress={() => {
                router.replace('/auth/verifyEmail');
                onClose && onClose();
              }}
              buttonStyle={styles.button}
              gradientColors={['#205781', '#7AB2D3']}
            />
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000055',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 370,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 28,
    alignItems: 'center',
    elevation: 8,
  },
  title: {
    marginBottom: 10,
    color: '#205781',
    fontWeight: 'bold',
    fontSize: 22,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 22,
    textAlign: 'center',
    fontSize: 15,
    color: '#205781',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    borderRadius: 25,
  },
});

export default EmailVerificationModal;