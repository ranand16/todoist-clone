import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter }  from 'react-router-dom';
import App from './Components/App/App';
import './App.css'
// import Firebase, { FirebaseContext } from './Firebase';
// import Firebase, { config } from './Firebase/firebase'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import allReducers from './Reducers';
import thunk from 'redux-thunk'
// import logger from './logger/logger'

import { getFirebase, ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { createFirestoreInstance } from 'redux-firestore';

import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage'
import 'firebase/firestore'
import 'firebase/functions'

export const config = {
    apiKey: "AIzaSyAAOzNvqgBIrcRz6GWNuyYk38CEOMwgOxs",
    authDomain: "todoist-c206d.firebaseapp.com",
    databaseURL: "https://todoist-c206d.firebaseio.com",
    projectId: "todoist-c206d",
    storageBucket: "todoist-c206d.appspot.com",
    messagingSenderId: "178908135458",
    appId: "1:178908135458:web:8e7f4faf8ccec1c15a0a7b",
    measurementId: "G-0VBWD9CEFP"
};
console.log(app)
app.initializeApp(config);
const auth = app.auth();
const storage = app.storage();
const firestore = app.firestore();
const functions = app.functions();
const firestoreRef = app.firestore;
let currentUser = null;

function middleWare(){
  return compose(applyMiddleware(thunk.withExtraArgument({getFirebase})));
}

let initialState = {};
let store = createStore(allReducers, initialState, middleWare());
// const firebase = new Firebase();

const rrfProps = {
  firebase: app,
  config: config,
  useFirestoreForProfile: true,
  dispatch: store.dispatch,
  createFirestoreInstance 
}
ReactDOM.render(
  <Provider store={store}>
    {/* <FirebaseContext.Provider value={new Firebase()}> */}
    <ReactReduxFirebaseProvider {...rrfProps}>  
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ReactReduxFirebaseProvider>
    {/* </FirebaseContext.Provider>, document.getElementById('root') */}
  </Provider>, document.getElementById('root')
);