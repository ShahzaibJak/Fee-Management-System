import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore'
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgZMBhDilF5oxrYiYwGBAe3PEM-t9WS4Q",
  authDomain: "react-social-media-app-a036d.firebaseapp.com",
  projectId: "react-social-media-app-a036d",
  storageBucket: "react-social-media-app-a036d.appspot.com",
  messagingSenderId: "1030572471859",
  appId: "1:1030572471859:web:8f6a43e5004c3dbd899546"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const firestore = getFirestore(app)
export const provider = new GoogleAuthProvider();