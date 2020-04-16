import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
// import { withFirebase } from '../../Firebase';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
// import createUser from '../../Actions/createUser'
// import { connect } from 'react-redux';
import { withFirebase } from '../../Firebase';

class SignUp extends Component {
    constructor(props){
        super(props)
        this.signUpDetails = {
            signUpEmail: null,
            signUpPassword: null
        }
        console.log(props)
    }
    onSignUp = (e) => {
        this.signUpDetails["signUpEmail"] = document.getElementById('signUpEmail').value
        this.signUpDetails["signUpPassword"] = document.getElementById('signUpPassword').value
        e.preventDefault();
        console.log(this.signUpDetails)
        // this.props.signup(this.signUpDetails, this.props.firebase, this.props.history);
        this.props.firebase.doCreateUserWithEmailAndPassword(this.signUpDetails["signUpEmail"], this.signUpDetails["signUpPassword"]).then((response)=>{
            console.log(response.user)
            const createUserDetails = this.props.firebase.functions.httpsCallable('createUserDetails');
            const res = createUserDetails({ uid: response["user"]["uid"], email: response["user"]["email"] });
            console.log(res);
        }).then((response)=>{
            // this.props.history.push({
            //     pathname: '/dashboard',
            //     params: {response:response,edit:true}
            // })
        }).catch((e)=>{
            this.props.firebase.handleFirebaseError(e);
        })
    }

    render(){
        return (
            <>
                <div id="signInWrapper">
                    {/* <div style={{ position: "absolute", margin: "0 auto" }}> */}
                        <Form onSubmit={this.onSignUp} style={{ width: "100%" }}>
                            <h3>Sign up</h3>
                            <br/>
                            <FormGroup>
                                <Label for="signUpEmail">Email</Label>
                                <Input type="text" name="email" className="form-field" id="signUpEmail" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" placeholder="Email" required/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="signUpPassword">Password</Label>
                                <Input type="password" name="pwd" className="form-field" id="signUpPassword" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" placeholder="Password" required/>
                            </FormGroup>
                            
                            <br/>
                            <FormGroup className="text-center">
                                <Button color="success" type="submit" >Submit</Button>  
                            </FormGroup>
                        </Form>
                    {/* </div> */}
                </div>
            </>
        )
    }
}

// const mapDispatchToProps = (dispatch) => {
//     return {
//         signup: (newUser, fb, history) => dispatch(createUser(newUser, fb, history))
//     }
// }

export default withFirebase(withRouter(SignUp));