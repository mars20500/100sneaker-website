import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDzORl8b13Qo1z1zG393R7KmYaE8B30PPc",
  authDomain: "budgetkicks.firebaseapp.com",
  projectId: "budgetkicks",
  storageBucket: "budgetkicks.firebasestorage.app",
  messagingSenderId: "675263206668",
  appId: "1:675263206668:web:544fb266399c420faaa529",
  measurementId: "G-4NLNFJSNXC",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const ADMIN_EMAIL = "carlabox2050@gmail.com";

export default app;
