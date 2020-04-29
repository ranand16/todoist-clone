import addTask from './addTask'
import authReducer from './authReducer'
import { combineReducers } from 'redux'
import { firebaseReducer } from 'react-redux-firebase'
import { firestoreReducer } from 'redux-firestore'

const allReducers = combineReducers({
    authReducer,
    addTask,
    firebase: firebaseReducer,
    firestore: firestoreReducer
});

export default allReducers;