import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyDiTLr5KO1m8cAV4bSN_MC4FZpPCVQ54BI",
  authDomain: "ogshoots.firebaseapp.com",
  projectId: "ogshoots",
  storageBucket: "ogshoots.firebasestorage.app",
  messagingSenderId: "408203666587",
  appId: "1:408203666587:web:37572c80929a6ab8c0d23e",
  measurementId: "G-2H1MZZJP9J"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
