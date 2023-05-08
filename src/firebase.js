import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCLY4kkxInNGPGb8oScrerM1_BnxbtmJIE",
  authDomain: "workvio-2cbee.firebaseapp.com",
  databaseURL: "https://workvio-2cbee-default-rtdb.firebaseio.com/",
  storageBucket: "workvio-2cbee.appspot.com",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
export { app, auth, database };