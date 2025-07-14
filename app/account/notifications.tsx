import Header from '@/components/Header';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSession } from '@/context/SessionContext';
import { changeNotificationToRead, getNotifications } from '@/services/firestore/notificationDbService';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

type Notification = {
  id: string;
  note: string;
  notifiedOn?: { seconds: number };
  state?: string;
  action?: string;
};

export default function NotificationsScreen() {
  const { session } = useSession();
  const userId = session?.user?.id;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    getNotifications(userId).then((notifs) => {
      // Map to ensure all required fields exist
      const mappedNotifs = notifs.map((n: any) => ({
        id: n.id,
        note: n.note ?? '',
        notifiedOn: n.notifiedOn,
        state: n.state,
        action: n.action,
      }));
      setNotifications(mappedNotifs.sort((a, b) => (b.notifiedOn?.seconds ?? 0) - (a.notifiedOn?.seconds ?? 0)));
      setLoading(false);
    });
  }, [userId]);

  const handleNotificationPress = async (notif: Notification) => {
    if (notif.state === 'unread') {
      await changeNotificationToRead(notif.id);
      setNotifications((prev) => prev.map(n => n.id === notif.id ? { ...n, state: 'read' } : n));
    }
    if (notif.action && typeof notif.action === 'string') {
      router.replace(notif.action as any);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Header label="Notifications" />
      {loading ? (
        <ThemedText>Loading...</ThemedText>
      ) : notifications.length === 0 ? (
        <ThemedText>No notifications.</ThemedText>
      ) : (
        notifications.map((notif) => (
          <TouchableOpacity
            key={notif.id}
            onPress={() => handleNotificationPress(notif)}
            activeOpacity={0.7}
          >
            <ThemedView style={[styles.notification, notif.state === 'unread' && styles.unreadNotification]}>
              <ThemedText style={styles.note}>{notif.note}</ThemedText>
              <ThemedText style={styles.date}>
                {notif.notifiedOn?.seconds ? new Date(notif.notifiedOn.seconds * 1000).toLocaleString() : ''}
              </ThemedText>
            </ThemedView>
          </TouchableOpacity>
        ))
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 18,
  },
  notification: {
    width: 340,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  unreadNotification: {
    backgroundColor: '#e3f0ff',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  note: {
    fontSize: 16,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
});