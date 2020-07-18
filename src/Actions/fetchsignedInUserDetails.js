/**
 * @param {User details provided already in sign in or signup} user 
 */

const fetchsignedInUserDetails = (user) => {
    console.log(user)
    let newUserObj = user["data"]
    let uid = user["uid"]
    return async (dispatch) => {
        dispatch({ type: "FETCH_USER_DETAILS", newUser: { data: newUserObj, uid: uid }})
    }
}
export default fetchsignedInUserDetails;