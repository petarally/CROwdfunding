import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCYz9p_OFzW-y2v4RrhN_lGbvjvoCsYJC0",
  authDomain: "crowdfunding-44df5.firebaseapp.com",
  projectId: "crowdfunding-44df5",
  storageBucket: "crowdfunding-44df5.appspot.com",
  messagingSenderId: "96077735636",
  appId: "1:96077735636:web:b519c42a71e299f23efd41",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);

export { db, auth, storage, firebaseApp };
