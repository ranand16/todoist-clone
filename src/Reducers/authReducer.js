let init = {
    user:[]
}
const authReducer = (state=init, action) => {
    // console.log(action)
    switch(action.type){
        case "FETCH_USER_DETAILS":
            return {
                user: action.newUser
            }
        default: 
    }
    return state 
}

export default authReducer