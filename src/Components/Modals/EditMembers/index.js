import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Input, ModalFooter } from 'reactstrap';
const EditMembersModal = (props) => {
    const [newCollab, setNewCollab] = useState({}); // "" not null
    const [newViewers, setNewViewers] = useState({}); // "" not null
    const { isOpen, userDetails, projectToDisplay } = props;
    console.log(userDetails)
    console.log(projectToDisplay)
    const userDetailsUids = Object.keys(userDetails)
    console.log(userDetailsUids)
    const toggle = () => {
        if(!isOpen){
          setNewCollab(projectToDisplay["collaborators"])
          setNewViewers(projectToDisplay["viewers"])  
        } else {
          setNewCollab({});
          setNewViewers({});
        }
        props.toggleNewMembersModal();
    }

    const addMembers = () => {
      console.log(newCollab, newViewers)
      console.log(Object.keys(newCollab), Object.keys(newViewers))

      if(Object.keys(newCollab).length<=0 && Object.keys(newViewers.length)<=0) return; // guarding
      console.log(props)
      props.editMembers(newCollab, newViewers).then((res)=>{
        console.log(res);
      }).catch((err)=>{
        console.log(err);
      });
    }

    const onChangeCollabStatus = (e) => {
      console.log(e.target.name)
      console.log(e.target.checked)
      console.log("collab")
      console.log(newCollab)
      if(e.target.name) newCollab[e.target.name] = e.target.checked?true:undefined 
      setNewCollab(newCollab)
    }

    const onChangeViewerStatus = (e) => {
      console.log(e.target.name)
      console.log(e.target.checked)
      console.log("viewer")
      console.log(newViewers)
      if(e.target.name) newViewers[e.target.name] = e.target.checked?true:undefined 
      setNewViewers(newViewers)
    }

    console.log(userDetailsUids)
    console.log(userDetails[userDetailsUids[0]])
    console.log(newCollab)
    return (
      
      <div>
        <Modal isOpen={isOpen} toggle={toggle} backdrop={"static"}>
          <ModalHeader toggle={toggle}>Add members</ModalHeader>
          <ModalBody>
            <div className={"editMembersSpan"}><span>{"Name"}</span><span>{"Collaborator"}</span><span>{"Viewer"}</span></div>
            {userDetailsUids.length>0 && userDetailsUids.map((uid)=>{
            return (
              <div key={uid} className={"editMembersSpan"}>
                <span>{userDetails[uid]["firstName"]} {userDetails[uid]["lastName"]}</span>
                <span><Input name={uid} checked={newCollab[uid]} onChange={onChangeCollabStatus} type="checkbox" /></span>
                <span><Input name={uid} checked={newViewers[uid]} onChange={onChangeViewerStatus} type="checkbox" /></span>
              </div>
            )
            })}
          </ModalBody>  
          <ModalFooter>
            <Button onClick={addMembers}>Save</Button>
            <Button onClick={toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
  
  export default EditMembersModal;