import { initializeApp } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js";
export {app, db, storage, auth, ttkey, errorMessage};

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Initialize Firebase
// Enter your firebase configuration here
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    appId: "",
    measurementId: "",
    storageBucket: "",
};

const app = initializeApp( firebaseConfig );
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

const ttkey = '';

let errorMessage = function(error){
    switch(error){
        case "auth/invalid-login-credentials": return "Invalid credentials";
        case "auth/missing-email": return "Account not found";
        case "auth/weak-password": return "Password should be at least 6 characters";
        default: return error;
    }
}