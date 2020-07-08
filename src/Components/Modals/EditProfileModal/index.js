import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Input, Label, Form, FormGroup, Row, Col, ModalFooter } from 'reactstrap';
const EditProfileModal = (props) => {
    const { isOpen, profile } = props;
    const [firstName, setfirstName] = useState(profile["firstName"])
    const [lastName, setlastName] = useState(profile["lastName"])
    let { userEmail } = profile 
    const toggle = ()=>{
      props.toggleProfileModal();
    }
    const details = (e) => {
      if(e.target.id){
        switch(e.target.id){
          case "firstName": 
            setfirstName(e.target.value)
          break;
          case "lastName":
            setlastName(e.target.value)
          break;
          default:
          break;
        }
      }
    }

    const saveUserDetails = () => {
      props.saveUserDetails(firstName, lastName).then(()=>{

        toggle();
      })
      console.log("saving user details")
    }

    return (
      <div>
        <Modal isOpen={isOpen} toggle={toggle} backdrop={"static"} size={"lg"}>
          <ModalHeader>Edit profile</ModalHeader>
          <ModalBody>
            <Form>
                <Row form>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="firstName">First name</Label>
                            <Input type="text" name="First name" id="firstName" value={firstName} onChange={details} placeholder="Enter your first name" />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="lastName">Last name</Label>
                            <Input type="text" name="Last name" id="lastName" value={lastName} onChange={details} placeholder="Enter your last name" />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label for="email">Email</Label>
                      <Input type="email" name="Email" id="emailId" value={userEmail} disabled={true} />  
                    </FormGroup>
                  </Col>
                </Row>
            </Form>
          </ModalBody>
          <ModalFooter>
                <Button className="commonBtn" onClick={saveUserDetails}>Save</Button>
                <Button className="commonBtn" onClick={toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
  
  export default EditProfileModal;