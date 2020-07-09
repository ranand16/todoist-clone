import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Input } from 'reactstrap';
const EditMembersModal = (props) => {
    const [newMembers, setNewMembers] = useState({ collaborators: [], viewers: [] }); // "" not null
    const { isOpen, userDetails } = props;
    console.log(userDetails)
    const userDetailsUids = Object.keys(userDetails)
    console.log(userDetailsUids)
    const toggle = () => {
        setNewMembers({ collaborators: {}, viewers: {} });
        props.toggleNewMembersModal();
    }

    const addMembers = () => {
      if(Object.keys(newMembers["collaborators"]).length>0 || Object.keys(newMembers["viewers"].length)>0) return; // guarding
      props.editMembers(newMembers);
      setNewMembers({ collaborators: {}, viewers: {} });
    }

    const onChangeCollabStatus = () => {
      console.log("collab")
    }

    const onChangeViewerStatus = () => {
      console.log("viewer")
    }

    return (
      <div>
        <Modal isOpen={isOpen} toggle={toggle} backdrop={"static"}>
          <ModalHeader toggle={toggle}>Add members</ModalHeader>
          <ModalBody>
            <div className={"editMembersSpan"}><span>{"Name"}</span><span>{"Collaborator"}</span><span>{"Viewer"}</span></div>
            {userDetailsUids.map((uid)=>{
            return (
              <div className={"editMembersSpan"}>
                <span>{userDetails[uid]["firstName"]} {userDetails[uid]["lastName"]}</span>
                <span><Input onChange={onChangeCollabStatus} type="checkbox" /></span>
                <span><Input onChange={onChangeViewerStatus} type="checkbox" /></span>
              </div>
            )
            })}
            {/* <Button className="commonBtn" onClick={addMembers} >Add members</Button> */}
          </ModalBody>
        </Modal>
      </div>
    );
  }
  
  export default EditMembersModal;