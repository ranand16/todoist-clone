import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Input } from 'reactstrap';
const RemoveModal = (props) => {
    const { isOpen } = props;
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
          <ModalHeader toggle={toggle}>Remove task/section</ModalHeader>
          <ModalBody>
            <Button className="commonBtn" onClick={confirm} >Confirm</Button>
            <Button className="commonBtn" onClick={toggle} >Cancel</Button>
          </ModalBody>
        </Modal>
      </div>
    );
  }
  
  export default RemoveModal;