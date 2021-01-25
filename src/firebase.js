import firebase from "firebase";

const firebaseApp =firebase.initializeApp({
  apiKey: "AIzaSyCoNCC5jSnfquwZS85wR_N5lmuQs7sAyzQ",
  authDomain: "todopp-c2c8b.firebaseapp.com",
  projectId: "todopp-c2c8b",
  storageBucket: "todopp-c2c8b.appspot.com",
  messagingSenderId: "952573267755",
  appId: "1:952573267755:web:57c6b19425524074597f6e"

});
const db=firebaseApp.firestore();
export default db ;