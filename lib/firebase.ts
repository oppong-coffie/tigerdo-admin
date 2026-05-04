import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAC1ziH47_xQ1Lh8yyN82bpXlV413KTSj8",
  authDomain: "tigerdo-be3e5.firebaseapp.com",
  projectId: "tigerdo-be3e5",
  storageBucket: "tigerdo-be3e5.firebasestorage.app",
  messagingSenderId: "208387163535",
  appId: "1:208387163535:web:7cfdd1ce7f0965422977fa"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, app };
