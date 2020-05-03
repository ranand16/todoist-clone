let init = {
    projects: []
}
const projectsReducer = (state=init, action) => {
    console.log(action)
    switch(action.type){
        case "FETCH_PROJECTS":
            return {
                projects: action.response
            }
        default: 
    }
    return state 
}

export default projectsReducer