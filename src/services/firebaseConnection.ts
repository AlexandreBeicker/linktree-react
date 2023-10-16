import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBdlhOEwyNm8YILWinefg8HotPoAPHG1JI",
  authDomain: "reactlinks-67323.firebaseapp.com",
  projectId: "reactlinks-67323",
  storageBucket: "reactlinks-67323.appspot.com",
  messagingSenderId: "33015703691",
  appId: "1:33015703691:web:6590983f093f2f050ccc8e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };