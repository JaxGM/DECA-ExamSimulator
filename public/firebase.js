// https://firebase.google.com/docs/auth/web/email-link-auth



// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFxnV3RRKXDv9EccwAIAtjx8ey2L3OzqM",
  authDomain: "deca-examsimulator.firebaseapp.com",
  projectId: "deca-examsimulator",
  storageBucket: "deca-examsimulator.firebasestorage.app",
  messagingSenderId: "565902611634",
  appId: "1:565902611634:web:a2bc18199ebae4d60f25ab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };