import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  User as FirebaseUser,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updatePassword,
} from 'firebase/auth';
import { collection, doc, getDoc, getDocs, getFirestore, query, setDoc, where } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

// Login user with email and password
export async function loginUser(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

// Register user and create Firestore user document
export async function registerUser(
  email: string,
  password: string,
  userData: Record<string, any>
) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  // Save additional user data in Firestore
  await setDoc(doc(db, 'users', user.uid), {
    ...userData,
    email,
    createdOn: new Date().toISOString(),
  });
  return user;
}

// Send email verification to current user
export async function verifyUserEmail(user?: FirebaseUser) {
  const currentUser = user || auth.currentUser;
  if (!currentUser) throw new Error('No user is currently signed in.');
  await sendEmailVerification(currentUser);
}

// Re-authenticate user with current password
export async function reauthenticateCurrentUser(currentPassword: string) {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error('No user is currently signed in.');
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
}

// Change password for current user (with re-authentication)
export async function changeUserPassword(currentPassword: string, newPassword: string) {
  const user = auth.currentUser;
  if (!user) throw new Error('No user is currently signed in.');
  await reauthenticateCurrentUser(currentPassword);
  await updatePassword(user, newPassword);
}

export async function loginUserAndFetchProfile(email: string, password: string) {
  const user = await loginUser(email, password);
  return await fetchUserProfile(user.uid, email);
}

export async function fetchUserProfile(userId: string, email?: string) {
  const db = getFirestore();
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (!userDoc.exists()) {
    throw 'User profile not found. Please contact support.';
  }
  const userData = userDoc.data();

  const requiredFields = [
    'fname', 'lname', 'username', 'email', 'bdate', 'age', 'gender',
    'contactNumber', 'profileImage', 'status', 'type', 'createdOn'
  ];
  
  const missing = requiredFields.filter(field => userData[field] === undefined || userData[field] === null);
  if (missing.length > 0) {
    throw 'User profile is incomplete. Missing: ' + missing.join(', ');
  }

  return {
    id: userId,
    fname: userData.fname,
    mname: userData.mname,
    lname: userData.lname,
    username: userData.username,
    email: email || userData.email,
    bdate: userData.bdate?.toDate ? userData.bdate.toDate() : userData.bdate,
    age: userData.age,
    gender: userData.gender,
    contactNumber: userData.contactNumber,
    profileImage: userData.profileImage,
    isProUser: userData.isProUser ?? false,
    status: userData.status,
    type: userData.type,
    createdOn: userData.createdOn?.toDate ? userData.createdOn.toDate() : userData.createdOn,
    groups: userData.groups || [],
    isFirstLogin: userData.isFirstLogin ?? true,
    likes: userData.likes || [],
    emergencyContact: userData.emergencyContact || [],
  };
}

// Send password reset email
export async function sendUserPasswordResetEmail(email: string) {
  await sendPasswordResetEmail(auth, email);
}

export async function hasUnreadNotifications(userId: string): Promise<boolean> {
  const q = query(
    collection(db, 'notifications'),
    where('userID', '==', userId),
    where('state', '==', 'unread')
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}