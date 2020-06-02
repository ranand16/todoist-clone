import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Input } from 'reactstrap';
const AddTaskModal = (props) => {
    const [task, setTask] = useState("");
    const { isOpen } = props;
    const toggle = () => {
        setTask("");
        props.toggleNewTaskModal();
    }

    const onChangeTask = (e) => {
      setTask(e.target.value?e.target.value:"")
    }

    const addTask = () => {
      if(task==="") return;
      props.addNewTask({task:task});
      setTask("");
    }

    return (
      <div>
        <Modal isOpen={isOpen} toggle={toggle} backdrop={"static"}>
          <ModalHeader toggle={toggle}>Add task</ModalHeader>
          <ModalBody>
            <Input placeholder={"e.g. Get a hair cut"} onChange={onChangeTask} value={task} style={{margin:"0rem 0rem 0.5rem 0rem"}} />
            <Button className="commonBtn" onClick={addTask} disabled={!task}>Add task</Button>
          </ModalBody>
        </Modal>
      </div>
    );
  }
  
  export default AddTaskModal;