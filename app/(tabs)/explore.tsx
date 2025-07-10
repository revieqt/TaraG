import NotificationsButton from '@/components/custom/NotificationsButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSession } from '@/context/SessionContext';
import { auth } from '@/services/firestore/config';
import { hasUnreadNotifications } from '@/services/firestore/userDbService';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ExploreScreen() {
  const [activeTab, setActiveTab] = useState<'Explore' | 'Tours' | 'Your Groups'>('Explore');
  const [search, setSearch] = useState('');
  const { session } = useSession();
  const userId = session?.user?.id;
  const [hasUnread, setHasUnread] = useState(false);

  useFocusEffect(
    useCallback(() => {
      // Removed email verification modal logic
    }, [auth.currentUser])
  );

  useEffect(() => {
    if (!userId) return;
    hasUnreadNotifications(userId).then(setHasUnread);
  }, [userId]);

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
            <ThemedText style={[
              styles.tabButtonText,
              activeTab === tab && styles.activeTabButtonText,
            ]}>{tab}</ThemedText>
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
      <ThemedView style={styles.header}>
        <ThemedText type='subtitle'>Explore</ThemedText>
        <NotificationsButton userId={userId} />
      </ThemedView>
      
      {renderTabChooser()}
      <ThemedView style={styles.tabStackContainer}>
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
      </ThemedView>

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
  header:{
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 20,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
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