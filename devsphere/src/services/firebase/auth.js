import {
  GoogleAuthProvider, createUserWithEmailAndPassword, sendPasswordResetEmail,
  signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from './config';

async function ensureProfile(user, name) {
  const ref = doc(db, 'users', user.uid);
  if ((await getDoc(ref)).exists()) return;
  await setDoc(ref, {
    uid: user.uid, email: user.email, displayName: name || user.displayName || user.email.split('@')[0],
    photoURL: user.photoURL || '', role: 'user', createdAt: serverTimestamp(),
  });
}

export async function register(name, email, password) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(user, { displayName: name });
  await ensureProfile(user, name);
}
export async function login(email, password) {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  await ensureProfile(user);
}
export async function loginWithGoogle() {
  const { user } = await signInWithPopup(auth, new GoogleAuthProvider());
  await ensureProfile(user);
}
export const logout = () => signOut(auth);
export const resetPassword = (email) => sendPasswordResetEmail(auth, email);
export const setDisplayName = (user, name) => updateProfile(user, { displayName: name });
