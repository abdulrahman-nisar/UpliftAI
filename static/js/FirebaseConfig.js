// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { getAI, getGenerativeModel, GoogleAIBackend } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-ai.js";

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

const ai = getAI(app, { backend: new GoogleAIBackend() });

const geminiModel = getGenerativeModel(ai, { 
    model: "gemini-2.5-flash"  
});


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { app, database, ai, geminiModel };