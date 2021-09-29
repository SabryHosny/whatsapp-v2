// import firebase from "firebase";
import * as firebase from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "@firebase/auth";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDCoYW4emCWKBi4oY0DbCDqhYMh8RVhwWo",
  authDomain: "whatsapp-2-dbc38.firebaseapp.com",
  projectId: "whatsapp-2-dbc38",
  storageBucket: "whatsapp-2-dbc38.appspot.com",
  messagingSenderId: "982503145391",
  appId: "1:982503145391:web:f7e1a0757c79d1a6d9395a",
};

const app = !firebase.getApps().length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.getApp();

const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };
