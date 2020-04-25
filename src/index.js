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
import firebase from "./Firebase/firebaseRedux";

import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { createFirestoreInstance } from 'redux-firestore';

console.log(firebase)
const rrfConfig = {
  userProfile: 'userDetails',
  useFirestoreForProfile: true, // Firestore for Profile instead of Realtime DB
  enableClaims: true
}

let initialState = {};
let store = createStore(allReducers, initialState, compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance // <- needed if using firestore
}
ReactDOM.render(
  <Provider store={store}>
    {/* <FirebaseContext.Provider value={new Firebase()}> */}
    <ReactReduxFirebaseProvider {...rrfProps}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ReactReduxFirebaseProvider>
    {/* </FirebaseContext.Provider> */}
  </Provider>, document.getElementById('root')
);