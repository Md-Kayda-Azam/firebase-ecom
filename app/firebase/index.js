import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: "learn-projects-61fb8.firebaseapp.com",
  projectId: "learn-projects-61fb8",
  storageBucket: "learn-projects-61fb8.appspot.com",
  messagingSenderId: "15938807850",
  appId: "1:15938807850:web:21fc09ac116e9421e93b53"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseApp = app
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const facebookProvider = new FacebookAuthProvider()



