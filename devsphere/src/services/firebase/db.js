import {
  addDoc, collection, deleteDoc, doc, getCountFromServer, getDoc, limit, onSnapshot,
  orderBy, query, serverTimestamp, setDoc, updateDoc, where,
} from 'firebase/firestore';
import { db } from './config';

const log = (user, action) =>
  addDoc(collection(db, 'logs'), { uid: user.uid, email: user.email, action, createdAt: serverTimestamp() }).catch(() => {});

/** Realtime, ownership-scoped, paginated (limit) listener. Returns the unsubscribe function. */
export function watch(name, { ownerId, max }, onData, onError) {
  const parts = [ownerId && where('ownerId', '==', ownerId), orderBy('createdAt', 'desc'), limit(max)].filter(Boolean);
  return onSnapshot(
    query(collection(db, name), ...parts),
    (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    (err) => onError(err.message),
  );
}

export const crud = (name) => ({
  async create(user, data) {
    await addDoc(collection(db, name), { ...data, ownerId: user.uid, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    log(user, `${name}.create`);
  },
  async update(user, id, data) {
    await updateDoc(doc(db, name, id), { ...data, updatedAt: serverTimestamp() });
    log(user, `${name}.update`);
  },
  async remove(user, id) {
    await deleteDoc(doc(db, name, id));
    log(user, `${name}.delete`);
  },
});

/** Server-side aggregation: one cheap read instead of downloading documents. filters = [[field, op, value], ...] */
export async function count(name, filters = []) {
  const q = query(collection(db, name), ...filters.map((f) => where(...f)));
  return (await getCountFromServer(q)).data().count;
}

export const setUserRole = async (admin, uid, role) => {
  await updateDoc(doc(db, 'users', uid), { role });
  log(admin, `users.role:${role}`);
};
export const updateProfileDoc = (uid, data) => updateDoc(doc(db, 'users', uid), data);
export const getSettings = async () => (await getDoc(doc(db, 'settings', 'app'))).data() || {};
export const saveSettings = (admin, data) => { log(admin, 'settings.update'); return setDoc(doc(db, 'settings', 'app'), data, { merge: true }); };
export const userProfile = (uid, onData, onError) =>
  onSnapshot(doc(db, 'users', uid), (s) => onData(s.exists() ? s.data() : null), (e) => onError(e.message));
