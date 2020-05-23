import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { withFirebase } from '../../Firebase';
import fetchUserDetails from '../../Actions/fetchUserDetails'
import { connect } from 'react-redux';
import { withFirestore } from 'react-redux-firebase'

class SignIn extends Component{
    constructor(props){
        super(props)
        console.log(props)
        this.signInDetails = {
            signInEmail: null,
            signInPassword: null
        }
    }

    onSignIn = (e) => {
        e.preventDefault();
        this.signInDetails["signInEmail"] = document.getElementById('signInEmail').value;
        this.signInDetails["signInPassword"] = document.getElementById('signInPassword').value;
        this.signInDetails["isNewUser"] = false;
        this.props.fetchUserDetails(this.signInDetails, this.props.firebase).then((res)=>{
            console.log(res)
            this.props.history.push({ pathname: '/dashboard' })
        }).catch((err)=>{
            console.log(err)
            // {
            //     "code": "auth/network-request-failed",
            //     "message": "A network error (such as timeout, interrupted connection or unreachable host) has occurred."
            // }
        });
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

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserDetails: (newUser, fb) => dispatch(fetchUserDetails(newUser, fb))
    }
}

const mapStateToProps = (state) => {
    console.log(state)
}

// export default withFirebase(connect(null, mapDispatchToProps)(withRouter(SignIn)));
export default withFirestore(connect(null, mapDispatchToProps)(withRouter(SignIn)));