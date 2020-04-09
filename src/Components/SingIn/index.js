import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { withFirebase } from '../Firebase';

class SignIn extends Component{
    constructor(props){
        super(props)
        console.log(props)
        this.signInEmail = null;
        this.signInPassword = null;
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
                        <Form className={"order-0"} onSubmit={this.onSignIn} style={{ width: "100%" }}>
                            <h3>Log In</h3>
                            <br/>
                            <FormGroup className={"mb-2 mr-sm-2 mb-sm-0"}>
                                <Label for="signInEmail">Email</Label>
                                <Input type="text" name="email" className="form-control" id="signInEmail" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" placeholder="Email" required/>
                            </FormGroup>
                            <FormGroup className={"mb-2 mr-sm-2 mb-sm-0"}>
                                <Label for="signInPassword">Password</Label>
                                <Input type="password" name="pwd" className="form-control" id="signInPassword" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" placeholder="Password" required/>
                            </FormGroup>
                            
                            <br/>
                            <FormGroup className="text-center mb-2 mr-sm-2 mb-sm-0">
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