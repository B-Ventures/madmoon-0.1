import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import defaultConfig from '../firebase-applet-config.json';
import { MerchantStore, DisputeReport } from './types';
import { INITIAL_STORES } from './data/initialStores';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || defaultConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || defaultConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || defaultConfig.projectId,
  appId: defaultConfig.appId,
  firestoreDatabaseId: defaultConfig.firestoreDatabaseId,
  storageBucket: defaultConfig.storageBucket,
  messagingSenderId: defaultConfig.messagingSenderId,
};

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore with database ID
const dbId = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)' 
  ? firebaseConfig.firestoreDatabaseId 
  : undefined;

export const db = getFirestore(app, dbId);

// Collection References
export const merchantsCol = collection(db, 'merchants');
export const reportsCol = collection(db, 'reports');

/**
 * Seed initial sample stores into Firestore if collection is empty
 */
export async function seedInitialStoresIfEmpty(): Promise<MerchantStore[]> {
  try {
    const snapshot = await getDocs(merchantsCol);
    if (snapshot.empty) {
      console.log('Seeding initial stores into Firestore...');
      const seeded: MerchantStore[] = [];
      for (const store of INITIAL_STORES) {
        const storeData: MerchantStore = {
          ...store,
          verificationStatus: 'active',
          tier: 'Tier 2 - Officially Verified',
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'merchants', store.id), storeData);
        seeded.push(storeData);
      }
      return seeded;
    } else {
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as MerchantStore));
    }
  } catch (error) {
    console.warn('Firestore fetch/seed warning:', error);
    return INITIAL_STORES;
  }
}

/**
 * Subscribe to realtime Merchants collection updates
 */
export function subscribeToMerchants(callback: (stores: MerchantStore[]) => void) {
  try {
    return onSnapshot(merchantsCol, (snapshot) => {
      const stores: MerchantStore[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data()
      } as MerchantStore));
      callback(stores);
    }, (err) => {
      console.warn('Snapshot error for merchants:', err);
    });
  } catch (err) {
    console.warn('Failed to subscribe to merchants:', err);
    return () => {};
  }
}

/**
 * Subscribe to realtime Reports collection updates
 */
export function subscribeToReports(callback: (reports: DisputeReport[]) => void) {
  try {
    return onSnapshot(reportsCol, (snapshot) => {
      const reports: DisputeReport[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data()
      } as DisputeReport));
      callback(reports);
    }, (err) => {
      console.warn('Snapshot error for reports:', err);
    });
  } catch (err) {
    console.warn('Failed to subscribe to reports:', err);
    return () => {};
  }
}

/**
 * Add a new store to Firestore
 */
export async function addMerchantToFirestore(store: MerchantStore) {
  try {
    const storeRef = doc(db, 'merchants', store.id);
    const storeData = {
      ...store,
      verificationStatus: store.verificationStatus || 'pending',
      tier: store.tier || 'Tier 1 - Standard',
      createdAt: store.createdAt || new Date().toISOString()
    };
    await setDoc(storeRef, storeData);
  } catch (error) {
    console.error('Error adding store to Firestore:', error);
    throw error;
  }
}

/**
 * Update store status in Firestore
 */
export async function updateMerchantStatusInFirestore(
  storeId: string, 
  status: 'pending' | 'active' | 'rejected',
  tier?: string
) {
  try {
    const storeRef = doc(db, 'merchants', storeId);
    const updateData: Partial<MerchantStore> = {
      verificationStatus: status,
      ...(tier ? { tier } : {}),
      ...(status === 'active' ? { verifiedAt: new Date().toISOString().split('T')[0] } : {})
    };
    await updateDoc(storeRef, updateData);
  } catch (error) {
    console.error('Error updating merchant status in Firestore:', error);
    throw error;
  }
}

/**
 * Increment click count in Firestore
 */
export async function incrementClickCountInFirestore(storeId: string, currentClicks: number) {
  try {
    const storeRef = doc(db, 'merchants', storeId);
    await updateDoc(storeRef, {
      clickCount: currentClicks + 1
    });
  } catch (error) {
    console.warn('Error incrementing click count in Firestore:', error);
  }
}

/**
 * Submit dispute report to Firestore
 */
export async function addReportToFirestore(report: DisputeReport) {
  try {
    const reportRef = doc(db, 'reports', report.id);
    await setDoc(reportRef, report);
  } catch (error) {
    console.error('Error adding report to Firestore:', error);
    throw error;
  }
}

/**
 * Update report status in Firestore
 */
export async function updateReportStatusInFirestore(reportId: string, status: 'pending' | 'reviewing' | 'resolved') {
  try {
    const reportRef = doc(db, 'reports', reportId);
    await updateDoc(reportRef, { status });
  } catch (error) {
    console.error('Error updating report status in Firestore:', error);
    throw error;
  }
}

export { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut, 
  onAuthStateChanged 
};
