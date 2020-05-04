/**
 * @param {This is an array containing all the project id needed to be fetched} projectIds 
 */

const fetchProjects = (projectIds, fb) => {
    const _firebaseRef = fb;
    const _firestoreRef = _firebaseRef.firestore();
    return async (dispatch) => {
        console.log(projectIds, _firestoreRef)
        _firestoreRef.collection("projects").where('id', 'in', projectIds).onSnapshot((projectRes)=>{
            console.log(projectRes)
            dispatch({ type: "FETCH_PROJECTS", response: projectRes.docs })
        })
        
    }
}
export default fetchProjects;