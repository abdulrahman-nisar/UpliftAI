// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, set, get, child, update, remove, push } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";


const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: "upliftai-44452.firebaseapp.com",
  projectId: "upliftai-44452",
  storageBucket: "upliftai-44452.firebasestorage.app",
  messagingSenderId: "939225164085",
  appId: "1:939225164085:web:509ab40016abbb97fcc47c",
  measurementId: "G-PJ2HDKGWWQ"
};
console.log("Firebase Config:", firebaseConfig);



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
