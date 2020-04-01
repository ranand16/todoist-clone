import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

function App() {
    const onSignIn = (e) => {
        e.preventDefault()
        console.log("Submit now.");
    }

    return (
        <>
            <div id="signInWrapper">
                {/* <div style={{ position: "absolute", margin: "0 auto" }}> */}
                    <Form onSubmit={onSignIn} style={{ width: "100%" }}>
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

    );
}

export default App;
