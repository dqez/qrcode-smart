import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCM7yAbcVXNHa_L66GZNmtrSjQqEuPj7jY",
  authDomain: "qrcodesmart-59401.firebaseapp.com",
  projectId: "qrcodesmart-59401",
  storageBucket: "qrcodesmart-59401.firebasestorage.app",
  messagingSenderId: "958377814940",
  appId: "1:958377814940:web:c76484fab2c616bcaaf659"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
