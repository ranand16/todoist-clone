import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { withFirebase } from '../Firebase';

class SignIn extends Component{
    constructor(props){
        super(props)
        console.log(props)
        let signInEmail = null;
        let signInPassword = null;
    }

    onSignIn = (e) => {
        e.preventDefault();
        this.signInEmail = document.getElementById('signInEmail').value;
        this.signInPassword = document.getElementById('signInPassword').value;
        console.log(this.signInEmail)
        console.log(this.signInPassword)
        this.props.firebase.doSignInWithEmailAndPassword(this.signInEmail, this.signInPassword).then((res)=>{
            console.log(res)
        }).catch((e)=>{
            this.props.firebase.handleFirebaseError(e);
        })
    }

    render(){
        return (
            <>
                <div id="signInWrapper">
                    {/* <div style={{ position: "absolute", margin: "0 auto" }}> */}
                        <Form onSubmit={this.onSignIn} style={{ width: "100%" }}>
                            <h3>Log In</h3>
                            <br/>
                            <FormGroup>
                                <Label for="signInEmail">Email</Label>
                                <Input type="text" name="email" className="form-field" id="signInEmail" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" required/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="signInPassword">Password</Label>
                                <Input type="password" name="pwd" className="form-field" id="signInPassword" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" required/>
                            </FormGroup>
                            
                            <br/>
                            <FormGroup className="text-center">
                                <Button color="success" type="submit" >Submit</Button>  
                            </FormGroup>
                        </Form>
                    {/* </div> */}
                </div>
                {/* <div id={"signUpWrapper"}>
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            title="Must contain at least one  number and one uppercase and lowercase letter, and at least 8 or more characters" 
                </div> */}
                {/* <a style={{position: "absolute", bottom: "10px"}} href="https://www.freepik.com/free-photos-vectors/background">Background vector created by starline - www.freepik.com</a>     */}
            </>
        )
    }
}

export default withFirebase(withRouter(SignIn));