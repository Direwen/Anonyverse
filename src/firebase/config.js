import { initializeApp } from "firebase/app";
import { getFirestore, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBwv27Kqe5ec-lTUjI5xvFgYl3mShcnlDg",
  authDomain: "anonyverse-3d5a8.firebaseapp.com",
  projectId: "anonyverse-3d5a8",
  storageBucket: "anonyverse-3d5a8.appspot.com",
  messagingSenderId: "753665467571",
  appId: "1:753665467571:web:d99484fdcb9ac5c024bcc6",
};

const app = initializeApp(firebaseConfig);
let db = getFirestore();
let timestamp = serverTimestamp();
const auth = getAuth(app);

export { app, db, timestamp, auth };
