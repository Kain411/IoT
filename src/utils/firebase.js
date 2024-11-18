import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCT2W4m1gviSq_RDO2DHSCIsRdBP2VLnsY",
  authDomain: "esp32-dht11-cf6e4.firebaseapp.com",
  databaseURL: "https://esp32-dht11-cf6e4-default-rtdb.firebaseio.com",
  projectId: "esp32-dht11-cf6e4",
  storageBucket: "esp32-dht11-cf6e4.firebasestorage.app",
  messagingSenderId: "2705149218",
  appId: "1:2705149218:web:defb14ea1af7b335a3a97b",
  measurementId: "G-V4TWHK0PSY"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app)
const fs = getFirestore(app)
const auth = getAuth(app)

export {db, fs, auth}