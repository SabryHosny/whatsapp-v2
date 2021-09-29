// import firebase from "firebase";
import * as firebase from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "@firebase/auth";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: `${process.env.FIREBASE_API_KEY}`,
  authDomain: "whatsapp-2-dbc38.firebaseapp.com",
  projectId: "whatsapp-2-dbc38",
  storageBucket: "whatsapp-2-dbc38.appspot.com",
  messagingSenderId: "982503145391",
  appId: `${process.env.FIREBASE_App_ID}`,
};

const app = !firebase.getApps().length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.getApp();

const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };
