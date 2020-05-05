import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Input } from 'reactstrap';
const AddProjectModal = (props) => {
    const [project, setProject] = useState(""); // "" not null
    const { isOpen } = props;
    const toggle = () => {
        props.toggleNewProjectModal();
    }

    const onChangeProject = (e) => {
      setProject(e.target.value?e.target.value:"")
    }

    const addProject = () => {
      if(project==="") return; // guarding
      props.addNewProject({project});
    }

    return (
      <div>
        <Modal isOpen={isOpen} toggle={toggle} backdrop={"static"}>
          <ModalHeader toggle={toggle}>Add project</ModalHeader>
          <ModalBody>
            <Input placeholder={"e.g. Thunder"} onChange={onChangeProject} value={project} style={{margin:"0rem 0rem 0.5rem 0rem"}} />
            <Button color="primary" onClick={addProject} disabled={!project}>Add project</Button>
          </ModalBody>
        </Modal>
      </div>
    );
  }
  
  export default AddProjectModal;