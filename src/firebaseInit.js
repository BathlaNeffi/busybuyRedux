// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCrL4R67m4Cl-n6h9BpkcysFgsC2cf2Fu8",
  authDomain: "busybuyredux-b2e92.firebaseapp.com",
  projectId: "busybuyredux-b2e92",
  storageBucket: "busybuyredux-b2e92.appspot.com",
  messagingSenderId: "447691124556",
  appId: "1:447691124556:web:aa8f036e1ae392cc41a9e9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export {db};