import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage'
import 'firebase/firestore'
import 'firebase/functions'

const config = {
    apiKey: "AIzaSyAAOzNvqgBIrcRz6GWNuyYk38CEOMwgOxs",
    authDomain: "todoist-c206d.firebaseapp.com",
    databaseURL: "https://todoist-c206d.firebaseio.com",
    projectId: "todoist-c206d",
    storageBucket: "todoist-c206d.appspot.com",
    messagingSenderId: "178908135458",
    appId: "1:178908135458:web:8e7f4faf8ccec1c15a0a7b",
    measurementId: "G-0VBWD9CEFP"
};

class Firebase {
    constructor(){
        app.initializeApp(config);
        this.auth = app.auth();
        this.storage = app.storage();
        this.firestore = app.firestore();
        this.functions = app.functions();
        this.firestoreRef = app.firestore;
        this.currentUser = null;
        // Required for side-effects
        this.firestore.enablePersistence()
          .catch(function (err) {
            if (err.code === 'failed-precondition') {
                console.log("failed-precondition")
              // Multiple tabs open, persistence can only be enabled
              // in one tab at a a time.
              // ...
            } else if (err.code === 'unimplemented') {
                console.log("unimplemented")
              // The current browser does not support all of the
              // features required to enable persistence
              // ...
            }
        });
    }

    doCreateUserWithEmailAndPassword = (email, password) => this.auth.createUserWithEmailAndPassword(email, password);
    getUserdetails = () => this.auth.currentUser;
    doSignInWithEmailAndPassword = (email, password) => this.auth.signInWithEmailAndPassword(email, password);
    doSignOut = () => this.auth.signOut();
    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
    doPasswordUpdateViaEmail = (emailCode, password) => this.auth.confirmPasswordReset(emailCode, password);
    createUserWithPersonalInfo = (email, emailVerified, phoneNumber, password, displayName) => this.auth().createUser(email, emailVerified, phoneNumber, password, displayName);
    handleFirebaseError = (e) =>{
      console.log(e)
      switch(e.code){
        case "auth/operation-not-allowed": 
          console.log("The given sign in provider is disabled for server. Please contact adminstrator.")
          break;
        default: console.log("There was a problem in processing the request from the server side. Try again later.")
      }
    }

}

export default Firebase;
