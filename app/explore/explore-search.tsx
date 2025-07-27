import { ThemedIcons } from '@/components/ThemedIcons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { Modal, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function ExploreSearchModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={{ marginBottom: 16 }}>Search</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Search..."
          placeholderTextColor="#888"
          // Not functional yet
        />
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <ThemedIcons library="MaterialIcons" name="close" size={30}/>
        </TouchableOpacity>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    opacity: 0.9,
  },
  input: {
    width: '100%',
    height: 44,
    borderColor: '#ccc',
    borderBottomWidth: 1,
    paddingHorizontal: 12,
    marginBottom: 20,
    fontSize: 16,
    color: '#888',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
}); 