// import projectReducer from './projectsReducer'
import authReducer from './authReducer'
import { combineReducers } from 'redux'
import { firebaseReducer } from 'react-redux-firebase'
import { firestoreReducer } from 'redux-firestore'

const allReducers = combineReducers({
    authReducer,
    firebase: firebaseReducer,
    firestore: firestoreReducer
    // projectReducer,
});

export default allReducers;