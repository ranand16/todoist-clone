import projectsReducer from './projectsReducer'
import authReducer from './authReducer'
import { combineReducers } from 'redux'
import { firebaseReducer } from 'react-redux-firebase'
import { firestoreReducer } from 'redux-firestore'

const allReducers = combineReducers({
    authReducer,
    projectsReducer,
    firebase: firebaseReducer,
    firestore: firestoreReducer
});

export default allReducers;