import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBoR0K9iljakpSjAXJTXwgSZuBf33qVNew",
  authDomain: "lucasocial-a7bd4.firebaseapp.com",
  projectId: "lucasocial-a7bd4",
  storageBucket: "lucasocial-a7bd4.appspot.com",
  messagingSenderId: "701721532760",
  appId: "1:701721532760:web:cbea06594b27f228d6ad2d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export { db, auth, analytics, app, storage};