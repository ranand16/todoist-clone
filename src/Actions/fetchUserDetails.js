/**
 * @param {User details provided while signin or signup} newUser 
 * @param {firebase instance for calling signin or signup function} fb 
 * @param {function to create a new user details in cloud firestore} createNewUser 
 */

const fetchUserDetails = (newUser, fb, createNewUser) => {
    const _firebaseRef = fb;
    const _firestoreRef = _firebaseRef.firestore();
    if(newUser["isNewUser"]){ // its a signup function
        // console.log("This is sign up.")
        return async (dispatch) => {
            let signUpResponse =  await _firebaseRef.auth().createUserWithEmailAndPassword(newUser["signUpEmail"], newUser["signUpPassword"])
            const newUserObj = createNewUser(signUpResponse["user"]["uid"], signUpResponse["user"]["email"], _firestoreRef)
            const userDetailsRes = await _firestoreRef.collection("userDetails").doc(signUpResponse["user"]["uid"]).set(newUserObj)
            dispatch({ type: "FETCH_USER_DETAILS", newUser: {data: newUserObj, uid: signUpResponse["user"]["uid"]} })
        }
    } else { // its a signin function
        // console.log("This is sign in.")
        return async (dispatch) => {
            let signInResponse =  await _firebaseRef.auth().signInWithEmailAndPassword(newUser["signInEmail"], newUser["signInPassword"])
            const userDetailsRes = await _firestoreRef.collection("userDetails").doc(signInResponse["user"]["uid"]).get()
            dispatch({ type: "FETCH_USER_DETAILS", newUser: { data: userDetailsRes.data(), uid: signInResponse["user"]["uid"] }  })
        }
    }
}
export default fetchUserDetails;