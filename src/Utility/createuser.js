/**
 * @param {email for the new user} email 
 * @param {uid that returned from the signup funtion} uid 
 * @param {firestore instance to create a unique id in this function} firestore 
 */
const creatNewUser = (uid, email, firestore) => {
    return {
        firstName: null,
        lastName: null,
        userEmail: email,
        projects: [
            {
                "projectId":"Inbox",
                "id": firestore.collection("userDetails").doc(uid).id,
                "sections": []
                
            },
            {
                "projectId": "Today",
                "id": firestore.collection("userDetails").doc(uid).id,
                "sections": []
            }
        ]
    }
}

 export default creatNewUser;