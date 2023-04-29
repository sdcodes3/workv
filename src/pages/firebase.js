// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCLY4kkxInNGPGb8oScrerM1_BnxbtmJIE",
  authDomain: "workvio-2cbee.firebaseapp.com",
  projectId: "workvio-2cbee",
  storageBucket: "workvio-2cbee.appspot.com",
  messagingSenderId: "640952040646",
  appId: "1:640952040646:web:62fe64103567a0b8982bc7",
  measurementId: "G-HY591FZT7C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
export {app, db}

// // Initialize Cloud Firestore and get a reference to the service

// // Add a new document in collection "cities"
// await setDoc(doc(db, "cities", "LA"), {
//   name: "Los Angeles",
//   state: "CA",
//   country: "USA"
// });