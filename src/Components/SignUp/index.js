import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { withFirebase } from '../Firebase';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

class SignUp extends Component {
    constructor(props){
        super(props)
        this.signUpEmail = null;
        this.signUpPassword = null;
        console.log(props)
    }
    // Ra129238928 // ranand16@gmail.com
    onSignUp = (e) => {
        this.signUpEmail = document.getElementById('signUpEmail').value
        this.signUpPassword = document.getElementById('signUpPassword').value
        e.preventDefault();
        console.log(e, this.props, document.getElementById('signUpEmail').value, document.getElementById('signUpPassword').value) 
        this.props.firebase.doCreateUserWithEmailAndPassword(this.signUpEmail, this.signUpPassword).then((response)=>{
            console.log(response)
            this.props.history.push({
                pathname: '/dashboard',
                params: {response:response,edit:true}
            })
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
export default withFirebase(withRouter(SignUp))
