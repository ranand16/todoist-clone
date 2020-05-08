/**
 * @param {projectName contains the name for the new project} projectName 
 * @param {firestore instance to create a unique id in this function} firestore 
 */
const creatNewProject = (projectName, firestore) => {
    return {
        "projectId": projectName,
        "id": firestore.collection("projects").doc().id,
        "sections": []
    }
}

 export default creatNewProject;