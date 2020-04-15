import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter }  from 'react-router-dom';
import App from './Components/App/App';
import './App.css'
import Firebase, { FirebaseContext, config } from './Firebase';
// import Firebase, { config } from './Firebase/firebase'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import allReducers from './Reducers';
import thunk from 'redux-thunk'
// import logger from './logger/logger'

import { getFirebase, ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { createFirestoreInstance } from 'redux-firestore';

let fbInstance = new Firebase();
let initialState = {};
let store = createStore(allReducers, initialState, compose(applyMiddleware(thunk.withExtraArgument({getFirebase}))));

const rrfProps = {
  firebase: fbInstance.firebase,
  config: config,
  useFirestoreForProfile: true,
  dispatch: store.dispatch,
  createFirestoreInstance 
}
ReactDOM.render(
  <Provider store={store}>
    <FirebaseContext.Provider value={fbInstance}>
      <ReactReduxFirebaseProvider {...rrfProps}>  
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ReactReduxFirebaseProvider>
    </FirebaseContext.Provider>, document.getElementById('root')
  </Provider>, document.getElementById('root')
);