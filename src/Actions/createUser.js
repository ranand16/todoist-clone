export const createUser = (newUser, fb, history) => {
    return (dispatch) => {
        console.log(fb)
        fb.doCreateUserWithEmailAndPassword(newUser.signUpEmail, newUser.signUpPassword).then((response)=>{
            // dispatch({ type: "CREATE_USER", newUser });
            history.push({
                pathname: '/dashboard',
                params: {response:response,edit:true}
            })
        }).catch((e)=>{ 
            fb.handleFirebaseError(e);
        })
    }
}
export default createUser;