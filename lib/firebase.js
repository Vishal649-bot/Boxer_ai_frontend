// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDm0mwta6fFGBvWF4znlzMAvtv6E4Y2x_4",
  authDomain: "boxer-ai-bf5e5.firebaseapp.com",
  projectId: "boxer-ai-bf5e5",
  storageBucket: "boxer-ai-bf5e5.firebasestorage.app",
  messagingSenderId: "303218550832",
  appId: "1:303218550832:web:460ab24120ac5c1eac25f5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)