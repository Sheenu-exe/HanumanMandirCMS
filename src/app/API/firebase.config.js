import { initializeApp } from "firebase/app";
import { getStorage } from "@firebase/storage";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "@firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDfOOVzfYSv9JSoa195cqd_EaDEIsHuV9I",
  authDomain: "jaihanuman-33628.firebaseapp.com",
  projectId: "jaihanuman-33628",
  storageBucket: "jaihanuman-33628.appspot.com",
  messagingSenderId: "643078033325",
  appId: "1:643078033325:web:20859855ee6ba5ecdadb24"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)
export const auth = getAuth(app)
export const db = getFirestore()
