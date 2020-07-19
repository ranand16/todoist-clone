/**
 * @param {email for the new user} email 
 * @param {uid that returned from the signup funtion} uid 
 * @param {firestore instance to create a unique id in this function} firestore 
 */
const creatNewUser = (name, uid, email, firestore) => {
    return {
        firstName: name,
        lastName: null,
        userEmail: email,
        projects: [
            {
                "projectId":"Inbox",
                "id": firestore.collection("userDetails").doc().id,
                "sections": [],
                "isInbox": true
            },
            {
                "projectId": "Today",
                "id": firestore.collection("userDetails").doc().id,
                "sections": [],
                "isToday": true
            }
        ]
    }
}

 export default creatNewUser;