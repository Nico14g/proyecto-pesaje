import { initializeApp } from "firebase/app";
import { getFirestore, CACHE_SIZE_UNLIMITED } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAHokW9uQo6JUTACyeN7YlDH-UWrTRR58Q",
  authDomain: "contrato-pesaje.firebaseapp.com",
  projectId: "contrato-pesaje",
  storageBucket: "contrato-pesaje.appspot.com",
  messagingSenderId: "889331894546",
  appId: "1:889331894546:web:047f6e7facaf9eeab04bcb",
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
};

export const firebase = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
