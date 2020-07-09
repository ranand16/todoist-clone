/**
 * @param {projectName contains the name for the new project} projectName 
 * @param {firestore instance to create a unique id in this function} firestore 
 */
const creatNewProject = (projectName, uid, firestore) => {
    return {
        projectId: projectName,
        id: firestore.collection("projects").doc().id,
        owner: uid,
        viewers: {}, // so that while check viwers[uid] can verify as user's presence in the project
        collaborators: {},
        sections: []
    }
}

 export default creatNewProject;