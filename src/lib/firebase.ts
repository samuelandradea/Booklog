// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyALpmsLJ3uzaELFi73QIVg-JVMOoYKIgvw",
  authDomain: "booklog-40ce6.firebaseapp.com",
  projectId: "booklog-40ce6",
  storageBucket: "booklog-40ce6.firebasestorage.app",
  messagingSenderId: "290492336424",
  appId: "1:290492336424:web:c2eda1d205eb153bef281d",
  measurementId: "G-S5M8REXTDQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);