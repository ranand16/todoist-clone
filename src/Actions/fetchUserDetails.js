/**
 * @param {User details provided while signin or signup} newUser 
 * @param {firebase instance for calling signin or signup function} fb 
 * @param {function to create a new user details in cloud firestore} createNewUser 
 */

const fetchUserDetails = (newUser, fb, createNewUser) => {
    if(newUser["isNewUser"]){ // its a signup function
        console.log("This is sign up.")
        return async (dispatch) => {
            const _firebaseRef = fb;
            const _firestoreRef = _firebaseRef.firestore;
            let signUpResponse =  await _firebaseRef.doCreateUserWithEmailAndPassword(newUser["signUpEmail"], newUser["signUpPassword"])
            console.log(signUpResponse)
            const newUserObj = createNewUser(signUpResponse["user"]["uid"], signUpResponse["user"]["email"], _firestoreRef)
            const userDetailsRes = await _firestoreRef.collection("userDetails").doc(signUpResponse["user"]["uid"]).set(newUserObj)
            console.log(userDetailsRes)
            dispatch({ type: "FETCH_USER_DETAILS", newUser: newUserObj })
        }
    } else { // its a signin function
        console.log("This is sign in.")
        return async (dispatch) => {
            const _firebaseRef = fb;
            const _firestoreRef = _firebaseRef.firestore;
            let signInResponse =  await _firebaseRef.doSignInWithEmailAndPassword(newUser["signInEmail"], newUser["signInPassword"])
            console.log(signInResponse)
            // const newUserObj = createNewUser(signInResponse["user"]["uid"], signInResponse["user"]["email"], _firestoreRef)
            const userDetailsRes = await _firestoreRef.collection("userDetails").doc(signInResponse["user"]["uid"]).get()
            console.log(userDetailsRes)
            dispatch({ type: "FETCH_USER_DETAILS", newUser: userDetailsRes.data() })
        }
    }
}
export default fetchUserDetails;