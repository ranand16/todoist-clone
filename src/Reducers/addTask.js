let init = {
    
}
const addTask = (state=init, action) => {
    // console.log(action)
    switch(action.type){
        case "ADD_TASK":
            return {
                // user: action.newUser
            }
        default: 
    }
    return state 
}

export default addTask