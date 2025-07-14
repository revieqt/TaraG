import NotificationsButton from '@/components/custom/NotificationsButton';
import HorizontalSections from '@/components/HorizontalSections';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSession } from '@/context/SessionContext';
import { hasUnreadNotifications } from '@/services/firestore/userDbService';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function ExploreScreen() {
  const { session } = useSession();
  const userId = session?.user?.id;
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    if (!userId) return;
    hasUnreadNotifications(userId).then(setHasUnread);
  }, [userId]);

  const labels = ['Explore', 'Tours', 'Your Groups'];
  const sections = [
    <View key="explore" style={styles.tabContent}>
      <ThemedText style={styles.tabText}>Explore Tab Content</ThemedText>
    </View>,
    <View key="tours" style={styles.tabContent}>
      <ThemedText style={styles.tabText}>Tours Tab Content</ThemedText>
    </View>,
    <View key="your-groups" style={styles.tabContent}>
      <ThemedText style={styles.tabText}>Your Groups Tab Content</ThemedText>
    </View>,
  ];

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type='subtitle'>Explore</ThemedText>
        <NotificationsButton userId={userId} />
      </ThemedView>
      <HorizontalSections
        labels={labels}
        sections={sections}
        type="fullTab"
      />
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
  tabContent: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  tabText: {
    textAlign: 'center',
    fontSize: 20,
    color: '#333',
    marginTop: 32,
    fontWeight: '500',
  },
});