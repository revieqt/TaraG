import EmailVerificationModal from '@/components/modals/EmailVerificationModal';
import { ThemedView } from '@/components/ThemedView';
import { auth } from '@/services/firestore/config';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ExploreScreen() {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'Explore' | 'Tours' | 'Your Groups'>('Explore');
  const [search, setSearch] = useState('');

  useFocusEffect(
    useCallback(() => {
      if (auth.currentUser && !auth.currentUser.emailVerified) {
        setShowModal(true);
      } else {
        setShowModal(false);
      }
    }, [auth.currentUser])
  );

  const tabOrder = ['Explore', 'Tours', 'Your Groups'] as const;

  const renderTabChooser = () => (
    <ThemedView style={styles.tabChooserContainer}>
      {tabOrder.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[
            styles.tabButton,
            { flex: 1 }, 
          ]}
          onPress={() => setActiveTab(tab)}
          activeOpacity={0.7}
        >
          <View style={styles.tabInnerContainer}>
            <Text style={[
              styles.tabButtonText,
              activeTab === tab && styles.activeTabButtonText,
            ]}>{tab}</Text>
          </View>
          <View style={[
            styles.tabUnderline,
            activeTab === tab && styles.activeTabUnderline,
          ]} />
        </TouchableOpacity>
      ))}
    </ThemedView>
  );

  const renderExploreTab = () => {
    return (
      <Text style={styles.tabText}>Explore Tab Content</Text>
    );
  };

  const renderToursTab = () => {
    return (
      <Text style={styles.tabText}>Tours Tab Content</Text>
    );
  };

  const renderYourGroupsTab = () => {
    return (
      <Text style={styles.tabText}>Your Groups Tab Content</Text>
    );
  };
  
  return (
    <ThemedView style={styles.container}>
      <EmailVerificationModal visible={showModal} onClose={() => setShowModal(false)} />

      {renderTabChooser()}
      <View style={styles.tabStackContainer}>
        <View
          style={[
            styles.tabContent,
            { zIndex: activeTab === 'Explore' ? 3 : 0, display: activeTab === 'Explore' ? 'flex' : 'none' },
          ]}
          pointerEvents={activeTab === 'Explore' ? 'auto' : 'none'}
        >
          {renderExploreTab()}
        </View>
        <View
          style={[
            styles.tabContent,
            { zIndex: activeTab === 'Tours' ? 3 : 0, display: activeTab === 'Tours' ? 'flex' : 'none' },
          ]}
          pointerEvents={activeTab === 'Tours' ? 'auto' : 'none'}
        >
          {renderToursTab()}
        </View>
        <View
          style={[
            styles.tabContent,
            { zIndex: activeTab === 'Your Groups' ? 3 : 0, display: activeTab === 'Your Groups' ? 'flex' : 'none' },
          ]}
          pointerEvents={activeTab === 'Your Groups' ? 'auto' : 'none'}
        >
          {renderYourGroupsTab()}
        </View>
      </View>

      {/* <FabMenu
        mainLabel="Create Group"
        mainIcon={<MaterialIcons name="add" size={32} color="#fff" />}
        mainOnPress={() => router.push('/groups/create')}
        actions={[
          {
            label: 'Join with Invite code',
            icon: <MaterialIcons name="input" size={20} color="#00FFDE" />,
            onPress: () => setJoinModalVisible(true),
          },
          {
            label: 'Send New Message',
            icon: <AntDesign name="mail" size={20} color="#00FFDE" />,
            onPress: () => setJoinModalVisible(true),
          },
        ]}
      /> */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 25,
  },
  tabChooserContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    height: 48,
  },
  tabButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    height: '100%',
  },
  tabInnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
  },
  tabButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  activeTabButtonText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  tabUnderline: {
    height: 3,
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: 2,
  },
  activeTabUnderline: {
    backgroundColor: '#007AFF',
  },
  tabStackContainer: {
    flex: 1,
    position: 'relative',
  },
  tabContent: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    // Add padding or styles for tab content as needed
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  tabText: {
    textAlign: 'center',
    fontSize: 20,
    color: '#333',
    marginTop: 32,
    fontWeight: '500',
  },
});