const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json')
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://todoist-c206d.firebaseio.com"
});
const firestore = admin.firestore();

require('events').EventEmitter.defaultMaxListeners = 15;
// const storage = admin.storage().bucket();

/**
 * The following funciton will run just after the response from registeration is received.
 * This function will create an instance of user details containing details like First name, last name, default projects.
 */
exports.createUserDetails = functions.https.onCall(async (request, response)=>{
    console.log(firestore, request);
    return firestore.collection("userDetails").doc(request.uid).set({
        firstName: null,
        lastName: null,
        userEmail: request.email,
        projects: [
            {
                "Inbox": {
                    "id": firestore.collection("userDetails").doc(request.uid).id,
                    "sections": []
                }
            },
            {
                "Today": {
                    "id": firestore.collection("userDetails").doc(request.uid).id,
                    "sections": []
                }
            }
        ]

    }).then((res)=>{
        return response.status(200).send(res)
    }).catch((e)=>{
        return response.status(500).send(e)
    })
});
// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.addMessage = functions.https.onRequest(async (req, res) => {
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into the Realtime Database using the Firebase Admin SDK.
    const snapshot = await admin.database().ref('/messages').push({original: original});
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    res.redirect(303, snapshot.ref.toString());
});