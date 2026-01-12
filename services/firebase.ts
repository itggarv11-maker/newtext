import { initializeApp, getApp, getApps } from "https://esm.sh/firebase/app";
import { 
    getAuth, 
    GoogleAuthProvider 
} from "https://esm.sh/firebase/auth";
import { getFirestore } from "https://esm.sh/firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD0se3ss2CELT7Li2kP_1-T-bM-ZkF_5Xk",
  authDomain: "itg-blogs.firebaseapp.com",
  projectId: "itg-blogs",
  storageBucket: "itg-blogs.firebasestorage.app",
  messagingSenderId: "437730855856",
  appId: "1:437730855856:web:331465616737afaaa6a475",
  measurementId: "G-PQE2F83X50"
};

export const isFirebaseConfigured = firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY_HERE";

let app;
if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };