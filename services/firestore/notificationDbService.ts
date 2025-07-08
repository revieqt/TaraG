import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from './config';

export async function getNotifications(userId: string) {
  const q = query(collection(db, 'notifications'), where('userID', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
}

export async function changeNotificationToRead(notificationId: string) {
  const notifRef = doc(db, 'notifications', notificationId);
  await updateDoc(notifRef, { state: 'read' });
}
