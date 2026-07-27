import { initializeApp, getApps, getApp, deleteApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut, 
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  initializeFirestore,
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

const getEnvOrConfig = (envVal: string | undefined, configVal: string) => {
  return envVal && envVal.trim().length > 0 ? envVal.trim() : configVal;
};

const firebaseConfig = {
  apiKey: getEnvOrConfig(import.meta.env.VITE_FIREBASE_API_KEY, defaultConfig.apiKey),
  authDomain: getEnvOrConfig(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, defaultConfig.authDomain),
  projectId: getEnvOrConfig(import.meta.env.VITE_FIREBASE_PROJECT_ID, defaultConfig.projectId),
  appId: defaultConfig.appId,
  firestoreDatabaseId: defaultConfig.firestoreDatabaseId,
  storageBucket: defaultConfig.storageBucket,
  messagingSenderId: defaultConfig.messagingSenderId,
};

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore with database ID & force long polling for restricted iframe/network environments
const dbId = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)' 
  ? firebaseConfig.firestoreDatabaseId 
  : undefined;

let firestoreInstance;
try {
  firestoreInstance = initializeFirestore(app, {
    experimentalForceLongPolling: true,
  }, dbId);
} catch (e) {
  firestoreInstance = getFirestore(app, dbId);
}

export const db = firestoreInstance;

// Helper with timeout for initial Firestore reads
async function withTimeout<T>(promise: Promise<T>, timeoutMs: number = 3000, fallback: T): Promise<T> {
  let timer: any;
  const timeoutPromise = new Promise<T>((resolve) => {
    timer = setTimeout(() => resolve(fallback), timeoutMs);
  });
  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timer);
    return result;
  } catch (err) {
    clearTimeout(timer);
    return fallback;
  }
}

// Collection References
export const merchantsCol = collection(db, 'merchants');
export const reportsCol = collection(db, 'reports');

/**
 * Seed initial sample stores into Firestore if collection is empty
 */
export async function seedInitialStoresIfEmpty(): Promise<MerchantStore[]> {
  try {
    const fetchPromise = (async () => {
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
    })();

    return await withTimeout(fetchPromise, 3500, INITIAL_STORES);
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
      if (stores.length > 0) {
        callback(stores);
      } else {
        callback(INITIAL_STORES);
      }
    }, (err) => {
      console.warn('Snapshot error for merchants (operating in offline fallback mode):', err);
      callback(INITIAL_STORES);
    });
  } catch (err) {
    console.warn('Failed to subscribe to merchants:', err);
    callback(INITIAL_STORES);
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
      callback([]);
    });
  } catch (err) {
    console.warn('Failed to subscribe to reports:', err);
    callback([]);
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
      domainVerified: status === 'active',
      crVerified: status === 'active',
      whatsappVerified: status === 'active',
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

/**
 * Creates a secondary admin user on Firebase Auth without disturbing active primary admin session
 */
export async function createSecondaryAdminAccount(email: string, pass: string) {
  const secondaryAppName = `AdminProvision_${Date.now()}`;
  const secondaryApp = initializeApp(firebaseConfig, secondaryAppName);
  const secondaryAuth = getAuth(secondaryApp);
  try {
    const userCred = await createUserWithEmailAndPassword(secondaryAuth, email, pass);
    await signOut(secondaryAuth);
    return userCred.user;
  } finally {
    await deleteApp(secondaryApp).catch(console.warn);
  }
}

export { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut, 
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber
};
