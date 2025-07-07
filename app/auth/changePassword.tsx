import Button from '@/components/Button';
import PasswordField from '@/components/PasswordField';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { changeUserPassword } from '@/services/firestore/userDbService';
import { useNavigation } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleChangePassword = async () => {
    setFormError('');
    if (!currentPassword || !newPassword || !confirmPassword) {
      setFormError('Please fill in all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setFormError('New password and confirmation do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await changeUserPassword(currentPassword, newPassword);
      Alert.alert('Success', 'Your password has been changed.');
      navigation.goBack();
    } catch (err: any) {
      if (err && err.code === 'auth/wrong-password') {
        setFormError('Current password is incorrect.');
      }else if( (err && err.code === 'auth/invalid-credential')){
        setFormError('Incorrect current password.');
      } else {
        setFormError(err?.message || 'Failed to change password.');
      }
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setFormError('');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    navigation.goBack();
  };

    return (
    
      <ThemedView style={styles.content}>
        <KeyboardAvoidingView
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} // Center the container
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
        <View style={styles.container}>
          <ThemedText type="title">
            Change Password
          </ThemedText>
          <ThemedText style={{marginVertical: 10, marginBottom: 20}}>
            Make your account secure by changing your password regularly.
          </ThemedText>

          {formError ? (
            <ThemedText type='error'>
              {formError}
            </ThemedText>
          ) : null}

          <PasswordField
            placeholder="Current Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            onFocus={() => setFocusedInput('current')}
            onBlur={() => setFocusedInput(null)}
            isFocused={focusedInput === 'current'}
          />

          <PasswordField
            placeholder="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            onFocus={() => setFocusedInput('new')}
            onBlur={() => setFocusedInput(null)}
            isFocused={focusedInput === 'new'}
          />

          <PasswordField
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            onFocus={() => setFocusedInput('confirm')}
            onBlur={() => setFocusedInput(null)}
            isFocused={focusedInput === 'confirm'}
          />

          

          <View style={styles.buttonRow}>
            <Button
              title="Cancel"
              onPress={handleCancel}
              type="outline"
              buttonStyle={styles.cancelButton}
            />
            <Button
              title="Submit"
              onPress={handleChangePassword}
              type="primary"
              loading={loading}
              buttonStyle={styles.submitButton}
            />
          </View>
        </View>
        </KeyboardAvoidingView>
      </ThemedView>
    
  );
}

const styles = StyleSheet.create({
  
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  container: {
    width: '100%',
    alignSelf: 'center',

  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    marginRight: 5,
    borderRadius: 25,
  },
  submitButton: {
    flex: 1,
    marginLeft: 5,
    borderRadius: 25,
  },
});