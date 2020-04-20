// import projectReducer from './projectsReducer'
import authReducer from './authReducer'
import { combineReducers } from 'redux'

const allReducers = combineReducers({
    authReducer
    // projectReducer,
});

export default allReducers;