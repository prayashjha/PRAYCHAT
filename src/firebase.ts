// Firebase configuration - lazy loaded
// Agar config empty hai to app localStorage mode mein chalegi
// Config bharne pe Firebase automatic switch ho jayega

// TODO: Yahan apni Firebase config daalein
// Firebase Console > Project Settings > General > Your apps > Web app
export const firebaseConfig = {
  apiKey: '',              // TODO: Add your API key
  authDomain: '',          // TODO: Add your auth domain
  projectId: '',           // TODO: Add your project ID
  storageBucket: '',       // TODO: Add your storage bucket
  messagingSenderId: '',   // TODO: Add your messaging sender ID
  appId: '',               // TODO: Add your app ID
};

// Check if Firebase is configured
export const isFirebaseEnabled = (): boolean => {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
};

// Firebase instances - lazy loaded
let fbApp: any = null;
let fbAuth: any = null;
let fbDb: any = null;
let fbStorage: any = null;

// Initialize Firebase (only when needed)
export async function initFirebase() {
  if (!isFirebaseEnabled()) return null;
  if (fbApp) return { app: fbApp, auth: fbAuth, db: fbDb, storage: fbStorage };

  try {
    // Dynamic imports - sirf tab load honge jab Firebase configured ho
    const [{ initializeApp }, { getAuth }, { getFirestore }, { getStorage }] = await Promise.all([
      import('firebase/app'),
      import('firebase/auth'),
      import('firebase/firestore'),
      import('firebase/storage'),
    ]);

    fbApp = initializeApp(firebaseConfig);
    fbAuth = getAuth(fbApp);
    fbDb = getFirestore(fbApp);
    fbStorage = getStorage(fbApp);

    console.log('[PrayChat] Firebase initialized');
    return { app: fbApp, auth: fbAuth, db: fbDb, storage: fbStorage };
  } catch (err) {
    console.warn('[PrayChat] Firebase init failed, using localStorage:', err);
    return null;
  }
}

// Getters (return null if not initialized)
export const getFirebase = () => ({ app: fbApp, auth: fbAuth, db: fbDb, storage: fbStorage });
