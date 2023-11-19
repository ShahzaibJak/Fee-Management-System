import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.React_APP_apiKey,
    authDomain: process.env.React_APP_authDomain,
    projectId: process.env.React_APP_projectId,
    storageBucket: process.env.React_APP_storageBucket,
    messagingSenderId: process.env.React_APP_messagingSenderId,
    appId: process.env.React_APP_appId,
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const firestore = getFirestore(app)
export const provider = new GoogleAuthProvider();
