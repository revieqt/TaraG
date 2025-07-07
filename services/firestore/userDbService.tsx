import {
  createUserWithEmailAndPassword,
  User as FirebaseUser,
  sendEmailVerification,
  signInWithEmailAndPassword,
  updatePassword,
} from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { auth, db } from './config';

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

// Change password for current user
export async function changeUserPassword(newPassword: string) {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error('No user is currently signed in.');
  await updatePassword(currentUser, newPassword);
}

export async function loginUserAndFetchProfile(email: string, password: string) {
  const user = await loginUser(email, password);
  const db = getFirestore();
  const userDoc = await getDoc(doc(db, 'users', user.uid));
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
    id: user.uid,
    fname: userData.fname,
    mname: userData.mname,
    lname: userData.lname,
    username: userData.username,
    email: email,
    bdate: userData.bdate?.toDate ? userData.bdate.toDate() : userData.bdate,
    age: userData.age,
    gender: userData.gender,
    contactNumber: userData.contactNumber,
    profileImage: userData.profileImage,
    status: userData.status,
    type: userData.type,
    createdOn: userData.createdOn?.toDate ? userData.createdOn.toDate() : userData.createdOn,
    groups: userData.groups || [],
  };
}

// ...existing code...