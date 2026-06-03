// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHDbCK-4Z8uJlRQaAFfPNwc8POaEiT-gw",
  authDomain: "todo-ac7ea.firebaseapp.com",
  projectId: "todo-ac7ea",
  storageBucket: "todo-ac7ea.firebasestorage.app",
  messagingSenderId: "998956064024",
  appId: "1:998956064024:web:2cf53ba5b74c3d3cde526d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);