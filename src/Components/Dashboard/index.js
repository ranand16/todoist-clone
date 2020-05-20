import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Input, Button } from 'reactstrap';
import './dashboard.css'

class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state = {
            addSectionForm: false, // new section toggle
            newSectionName: "", // new section name when adding a new section to this project
            editedTaskValue: "", // on-going editing task task updated task value,
        };
    }

    componentDidMount(){
        document.addEventListener("keydown", this.documentKeyDown)
    }

    documentKeyDown = (e) => {
        console.log(e, e.keyCode)
        if(e && e.keyCode){
            switch(e.keyCode){
                case 27: // this is escape
                    this.editToogle(false, false, false, "task");
                    break;
                default: 
                    break;
            }
        }
    }
    
    toggleAddSection = () => {
        this.setState(prevState=> ({ addSectionForm: !prevState.addSectionForm, newSectionName: "" }))
    }

    newSectionValueOnChange = (e) => {
        this.setState({ newSectionName: e.target.value?e.target.value:"" })
    }

    addNewSection = async () => {
        const { newSectionName } = this.state
        const { addNewSectionToProject, projectToDisplay } = this.props
        const res = await addNewSectionToProject(newSectionName, projectToDisplay)
        if(res){
            this.toggleAddSection();
        }
    }

    /**
     * This function toggles edit input field for task or section edit.
     */
    editToogle = (sectionIndex, task, taskIndex, type, e) => {
        console.log(task, e, this.props)
        const { updateToggle } = this.props;
        const taskName = task?task["task"]:"";
        switch(type){
            case "task":
                updateToggle(taskIndex , sectionIndex)
                this.setState({ editedTaskValue: taskName })
                break;
            case "section":
                break;
            default: 
                break;
        }
    }

    /**
     * This function is onchange handler for task/section name edit
     */
    editedTaskValue = (e) => {
        console.log(e, e.key)
        this.setState({ editedTaskValue: e.target.value?e.target.value:"" })
    }

    /**
     * This function deals with esc and enter button press from keyboard while editing task or section name
     */
    editedTaskKeyValue = (e) => {
        console.log(e, e.keyCode)
        // 27 for esc 13 for enter
        if(e && e.keyCode){
            switch(e.keyCode){
                case 27: // this is escape
                    this.editToogle(false, false, false, "task");
                    break;
                case 13: // this is confirm
                    this.confirmEditTask(e);
                    break;
                default: 
                    break;
            }
        }
    }

    /**
     * This Single function can be used to handle cancel operation for edit section name or task
     */
    cancelEdit = (e) => {
        console.log(e)
        console.log(e.currentTarget.getAttribute("name"))
        if(e && e.currentTarget.getAttribute("name")){
            const name = e.currentTarget.getAttribute("name")
            switch(name){
                case "taskCancelEdit":
                    this.editToogle(false, false, false, "task");
                    break;
                default: 
                    break;
            }
        }
    }

    /**
     * This Single function can be used to handle confirm operation for edit section name or task
     */
    confirmEditTask = (e) => {
        console.log(e)
        console.log(e.currentTarget.getAttribute("name"))
        const { editedTaskValue } = this.state
        if(e && e.currentTarget.getAttribute("name")){
            const name = e.currentTarget.getAttribute("name")
            switch(name){
                case "taskConfirmEdit":
                    console.log(editedTaskValue)
                    // need to call the dashboard container function to update this task value to the db
                    this.props.confirmEditTask(editedTaskValue).then((res)=>{
                        console.log(res)
                        this.setState({ editedTaskValue: "" });
                    })
                    break;
                default: 
                    break;
            }
        }
    }

    block = () => {
        
    }

    render() {
        const { projectToDisplay, editTaskToggle, editSectionToggle } = this.props
        const { addSectionForm, editedTaskValue, newSectionName } = this.state
        console.log(projectToDisplay);
        return(
            <div className={"contents"}>
                <div>
                    {<span><h2>{projectToDisplay?projectToDisplay["projectId"]:""}</h2></span>}<br/>
                    {projectToDisplay?projectToDisplay.sections.length>0?projectToDisplay.sections.map((section, i)=>{
                        return (
                            <div className="section" key={section["name"]?section["name"]:i}>
                                <h4>{section["name"]}</h4>
                                <hr/>
                                {section["tasks"]?section["tasks"].map((task, j)=>{
                                    return <div key={task["date"]+j}> 
                                        <div className={"taskContainer"}>
                                            {(editTaskToggle===j && editSectionToggle===i)?
                                                <div>
                                                    <Input  name="taskConfirmEdit" value={editedTaskValue} onChange={this.editedTaskValue} onKeyDown={this.editedTaskKeyValue} autoFocus />
                                                    <span className={"taskEditSubtext"}>Press Esc to <a onClick={this.cancelEdit} name="taskCancelEdit" href={this.block}>cancel</a> and Enter to <a onClick={this.confirmEditTask} name="taskConfirmEdit" href={this.block}>confirm</a>.</span>
                                                </div> : <span onClick={this.editToogle.bind(this, i, task, j, "task")} className={"taskName"}>{task["task"]}</span>
                                            }
                                            {(editTaskToggle===j && editSectionToggle===i)?<></>:<span className="taskActions">
                                                <button onClick={this.editToogle.bind(this, i, task, j, "task")}>
                                                    <svg className="bi bi-pencil-square" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M15.502 1.94a.5.5 0 010 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 01.707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 00-.121.196l-.805 2.414a.25.25 0 00.316.316l2.414-.805a.5.5 0 00.196-.12l6.813-6.814z"/>
                                                        <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 002.5 15h11a1.5 1.5 0 001.5-1.5v-6a.5.5 0 00-1 0v6a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5v-11a.5.5 0 01.5-.5H9a.5.5 0 000-1H2.5A1.5 1.5 0 001 2.5v11z" clipRule="evenodd"/>
                                                    </svg>
                                                </button>
                                                <button>
                                                    <svg className="bi bi-chat-square-dots" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" d="M14 1H2a1 1 0 00-1 1v8a1 1 0 001 1h2.5a2 2 0 011.6.8L8 14.333 9.9 11.8a2 2 0 011.6-.8H14a1 1 0 001-1V2a1 1 0 00-1-1zM2 0a2 2 0 00-2 2v8a2 2 0 002 2h2.5a1 1 0 01.8.4l1.9 2.533a1 1 0 001.6 0l1.9-2.533a1 1 0 01.8-.4H14a2 2 0 002-2V2a2 2 0 00-2-2H2z" clipRule="evenodd"/>
                                                        <path d="M5 6a1 1 0 11-2 0 1 1 0 012 0zm4 0a1 1 0 11-2 0 1 1 0 012 0zm4 0a1 1 0 11-2 0 1 1 0 012 0z"/>
                                                    </svg>
                                                </button>
                                                <button>
                                                    <svg className="bi bi-dash-circle" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" d="M8 15A7 7 0 108 1a7 7 0 000 14zm0 1A8 8 0 108 0a8 8 0 000 16z" clipRule="evenodd"/>
                                                        <path fillRule="evenodd" d="M3.5 8a.5.5 0 01.5-.5h8a.5.5 0 010 1H4a.5.5 0 01-.5-.5z" clipRule="evenodd"/>
                                                    </svg>
                                                </button>
                                            </span>}
                                        </div>
                                        <hr/>
                                    </div>
                                }):null}
                                <button className="addTask" onClick={()=>{this.props.toggleNewTaskModal(projectToDisplay, i)}}>
                                    <svg className="bi bi-plus-circle-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor">
                                        <path fillRule="evenodd" d="M16 8A8 8 0 110 8a8 8 0 0116 0zM8.5 4a.5.5 0 00-1 0v3.5H4a.5.5 0 000 1h3.5V12a.5.5 0 001 0V8.5H12a.5.5 0 000-1H8.5V4z" clipRule="evenodd"/>
                                    </svg>Add task
                                </button>
                            </div>
                        )
                    }):null:null}
                    {projectToDisplay["projectId"]!=="Today"?<div className="addSectionLayout">
                        <button onClick={this.toggleAddSection}><span></span>Add Section</button>
                    </div>:""}
                    {
                        addSectionForm && 
                        <div className="addSectionForm">
                            <Input onChange={this.newSectionValueOnChange} value={newSectionName}/>
                            <Button onClick={this.addNewSection} className="commonBtn" disabled={newSectionName===""}>Add section</Button>
                            <a onClick={this.toggleAddSection} href={this.block} className="alert-link">Cancel</a>
                        </div>
                    }
                </div>
            </div> 
        )
    }
}
export default (withRouter(Dashboard))
