import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Input, ModalFooter } from 'reactstrap';
const RemoveModal = (props) => {
    const { isOpen, removeType } = props;
    const toggle = () => {
        props.toggleRemoveModal();
        props.toggleRemoveVars();
    }

    const confirm = () => {
      props.confirmRemoval();
    }

    return (
      <div>
        <Modal isOpen={isOpen} toggle={toggle} backdrop={"static"}>
          <ModalHeader toggle={toggle}>Remove {removeType}</ModalHeader>
          <ModalBody>
            <span>Are you sure you want to remove?</span>
          </ModalBody>
          <ModalFooter>
            <Button className="commonBtn" onClick={confirm} style={{ margin: "0rem 0.5rem 0rem 0rem" }}>Confirm</Button>
            <Button className="commonBtn" onClick={toggle} style={{ margin: "0rem 0rem 0rem 0.5rem" }}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
  
  export default RemoveModal;