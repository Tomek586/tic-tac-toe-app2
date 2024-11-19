import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBotJKG9EWGsrgiejAoM1NL0Bvvd33I-W8",
    authDomain: "tic-tac-toe-app-79c26.firebaseapp.com",
    projectId: "tic-tac-toe-app-79c26",
    storageBucket: "tic-tac-toe-app-79c26.firebasestorage.app",
    messagingSenderId: "6533018953",
    appId: "1:6533018953:web:6fa7d5fb91184ca4a2d698",
    measurementId: "G-TX7YLBF3YB"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
