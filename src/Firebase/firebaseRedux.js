import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAAOzNvqgBIrcRz6GWNuyYk38CEOMwgOxs",
    authDomain: "todoist-c206d.firebaseapp.com",
    databaseURL: "https://todoist-c206d.firebaseio.com",
    projectId: "todoist-c206d",
    storageBucket: "todoist-c206d.appspot.com",
    messagingSenderId: "178908135458",
    appId: "1:178908135458:web:8e7f4faf8ccec1c15a0a7b",
    measurementId: "G-0VBWD9CEFP"
};

// Initialize Firebase
try {
	firebase.initializeApp(firebaseConfig);
	firebase.firestore();
	console.log("Firebase Initialized");
} catch (err) {
	console.log("Error Initializing Firebase");
}

export default firebase;
