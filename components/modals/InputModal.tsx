import React, { useState } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { ThemedIcons } from '../ThemedIcons';
import TextField from '../TextField';
import ContactNumberField from '../ContactNumberField';
import Button from '../Button';
import { useThemeColor } from '@/hooks/useThemeColor';

interface InputModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (value: string | { areaCode: string; number: string }) => void;
  label: string;
  description?: string;
  type: 'text' | 'contactNumber';
  initialValue?: string;
  placeholder?: string;
}

const InputModal: React.FC<InputModalProps> = ({
  visible,
  onClose,
  onSubmit,
  label,
  description,
  type,
  initialValue = '',
  placeholder = ''
}) => {
  const [textValue, setTextValue] = useState(initialValue);
  const [areaCode, setAreaCode] = useState('63+');
  const [contactNumber, setContactNumber] = useState('');
  
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'text');

  const handleSubmit = () => {
    if (type === 'text') {
      if (!textValue.trim()) {
        Alert.alert('Error', 'Please enter a value');
        return;
      }
      onSubmit(textValue.trim());
    } else if (type === 'contactNumber') {
      if (!contactNumber.trim()) {
        Alert.alert('Error', 'Please enter a contact number');
        return;
      }
      onSubmit({ areaCode, number: contactNumber });
    }
    
    // Reset values
    setTextValue('');
    setContactNumber('');
    setAreaCode('63+');
    onClose();
  };

  const handleClose = () => {
    // Reset values
    setTextValue('');
    setContactNumber('');
    setAreaCode('63+');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <ThemedView style={[styles.modalContainer, { backgroundColor, borderColor }]}>
          {/* Header */}
          <View style={styles.header}>
            <ThemedText type="subtitle" style={styles.title}>
              {label}
            </ThemedText>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <ThemedIcons library="MaterialIcons" name="close" size={24} />
            </TouchableOpacity>
          </View>

          {/* Description */}
          {description && (
            <ThemedText style={styles.description}>
              {description}
            </ThemedText>
          )}

          {/* Input Field */}
          <View style={styles.inputContainer}>
            {type === 'text' ? (
              <TextField
                placeholder={placeholder || `Enter ${label.toLowerCase()}`}
                value={textValue}
                onChangeText={setTextValue}
                autoCapitalize="words"
              />
            ) : (
              <ContactNumberField
                areaCode={areaCode}
                onAreaCodeChange={setAreaCode}
                number={contactNumber}
                onNumberChange={setContactNumber}
                placeholder={placeholder || "Contact Number"}
              />
            )}
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              title="Cancel"
              onPress={handleClose}
              type="outline"
              buttonStyle={[styles.button, styles.cancelButton]}
            />
            <Button
              title="Continue"
              onPress={handleSubmit}
              type="primary"
              buttonStyle={[styles.button, styles.submitButton]}
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    flex: 1,
    marginRight: 16,
  },
  closeButton: {
    padding: 4,
  },
  description: {
    marginBottom: 20,
    opacity: 0.7,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
  },
  cancelButton: {
    marginRight: 6,
  },
  submitButton: {
    marginLeft: 6,
  },
});

export default InputModal;