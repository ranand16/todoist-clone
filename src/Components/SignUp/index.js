import React from 'react';
import { withRouter } from 'react-router-dom'
import { withFirebase } from '../Firebase';
 
function SignUp() {
    return (
        <>This is sign up page.</>
    )
}

export default withFirebase(withRouter(SignUp))