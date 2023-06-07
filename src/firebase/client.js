// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBcoY_KJTPNwm7wpAMH_SmTsA85FD6IfD0",
    authDomain: "stylingora.firebaseapp.com",
    projectId: "stylingora",
    storageBucket: "stylingora.appspot.com",
    messagingSenderId: "1077291127090",
    appId: "1:1077291127090:web:efd0467ef8e054b14ec72b",
    measurementId: "G-WR8L1WTGVG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const fireDb = getFirestore(app)
export default app
