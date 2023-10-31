import { initializeApp } from "firebase/app";
import {getFirestore} from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBhvhnYffA_PDIPevnnHzhRkTRomhT47z0",
  authDomain: "curo-1c571.firebaseapp.com",
  projectId: "curo-1c571",
  storageBucket: "curo-1c571.appspot.com",
  messagingSenderId: "400040348524",
  appId: "1:400040348524:web:f7222a1d4bb1e0c2bfc149"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);