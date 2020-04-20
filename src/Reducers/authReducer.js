let init = {
    user:[]
}
const authReducer = (state=init, action) => {
    console.log(action)
    switch(action.type){
        case "FETCH_USER_DETAILS":
            console.log("Load user data from user's info collection in firestore. This function will be callled at time of creation of a new user or sign in");
            return {
                user: action.newUser
            }
        default: 
            console.log("This is default.") 
    }
    return state 
}

export default authReducer