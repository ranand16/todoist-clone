let init = {
    user:[],
    uid: null
}
const authReducer = (state=init, action, uid) => {
    // console.log(action)
    switch(action.type){
        case "FETCH_USER_DETAILS":
            return {
                user: action.newUser["data"],
                uid: action.newUser["uid"]
            }
        default: 
    }
    return state 
}

export default authReducer