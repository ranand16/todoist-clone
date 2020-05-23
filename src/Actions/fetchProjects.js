/**
 * @param {This is an array containing all the project id needed to be fetched} projectIds 
 */

// const fetchProjects = (projectIds, fb) => {
const fetchProjects = (profile, fb) => {
    const _firebaseRef = fb;
    const _firestoreRef = _firebaseRef.firestore();
    // console.log(profile)    
    const profileProjs = profile["projects"];
    let projectDocIds = [];
    profileProjs.map((project)=>{
        if(project["projectId"] === "Today" || project["projectId"] === "Inbox") return null;
        projectDocIds.push(project["id"])
    })

    // console.log(_firebaseRef, profile, projectDocIds)
    return async (dispatch) => {
        // console.log(projectDocIds, _firestoreRef)
        if(projectDocIds.length>0){
            _firestoreRef.collection("projects").where('id', 'in', projectDocIds).onSnapshot((projectRes)=>{ // for the bug  that the new project is not live updated, projectIds is only set once during the component did mount
                // console.log(projectRes)
                dispatch({ type: "FETCH_PROJECTS", response: projectRes.docs })
            })
        }
    }
}
export default fetchProjects;