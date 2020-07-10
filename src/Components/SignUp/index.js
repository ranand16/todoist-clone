import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import fetchUserDetails from '../../Actions/fetchUserDetails'
import { connect } from 'react-redux';
// import { withFirebase } from '../../Firebase';
import creatNewUser from '../../Utility/createuser'
import { withFirestore } from 'react-redux-firebase'

class SignUp extends Component {
    constructor(props){
        super(props)
        this.signUpDetails = {
            signUpEmail: null,
            signUpPassword: null,
            name: null
        }
        console.log(props)
    }
    onSignUp = (e) => {
        e.preventDefault();
        this.signUpDetails["signUpEmail"] = document.getElementById('signUpEmail').value
        this.signUpDetails["signUpPassword"] = document.getElementById('signUpPassword').value
        this.signUpDetails["name"] = document.getElementById('name').value
        this.signUpDetails["isNewUser"] = true
        this.props.fetchUserDetails(this.signUpDetails, this.props.firebase, creatNewUser).then((res)=>{
            console.log(res)
            this.props.history.push({ pathname: '/dashboard' })
        });
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
                                <Label for="name">Name</Label>
                                <Input type="text" name="name" className="form-field" id="name" placeholder="Full name" required/>
                            </FormGroup>
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

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserDetails: (newUser, fb, creatNewUser) => dispatch(fetchUserDetails(newUser, fb, creatNewUser))
    }
}

export default withFirestore(connect(null, mapDispatchToProps)(withRouter(SignUp)));