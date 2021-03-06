import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Input, Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import './dashboard.css'

class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state = {
            addSectionForm: false, // new section toggle
            newSectionName: "", // new section name when adding a new section to this project
            editedTaskValue: "", // on-going editing task task updated task value,
            editedSectionValue: "", // on-going editing task task updated task value,
            editedProjectValue: "", // on-going editing task task updated task value,
            sectionHamToggle: false, // section hamburger menu
            projectHamToggle: false // project hamburger menu
        };
    }

    componentDidMount(){
        document.addEventListener("keydown", this.documentKeyDown)
    }

    documentKeyDown = (e) => {
        // console.log(e, e.keyCode)
        if(e && e.keyCode){
            switch(e.keyCode){
                case 27: // this is escape
                    this.editToogle(null, null, null, null, null);
                    break;
                default: 
                    break;
            }
        }
    }

    toggleSectionHamToggle = (sectionIndex) => {
        this.setState(prevState=>  { 
            if(prevState.sectionHamToggle===sectionIndex) return { sectionHamToggle: false }
            else return { sectionHamToggle: sectionIndex }
        })
    }

    toggleProjectHamToggle = (projectId) => {
        this.setState(prevState=>  { 
            if(prevState.projectHamToggle===projectId) return { projectHamToggle: false }
            else return { projectHamToggle: projectId }
        })
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
    editToogle = (section, sectionIndex, task, taskIndex, project, e) => {
        // console.log(task, e, this.props)
        console.log(project)
        const { updateToggle } = this.props;
        const taskName = task?task["task"]:"";
        const sectionName = section?section["name"]:"";
        updateToggle(taskIndex, sectionIndex, project)
        this.setState({ editedTaskValue: taskName, editedSectionValue: sectionName, editedProjectValue: project?project["projectId"]:"" })
    }

    removeToogle = (sectionIndex, taskIndex, project, e) => {
        console.log(sectionIndex, taskIndex, project);
        const { toggleRemove } = this.props;
        if((taskIndex!==false || taskIndex!==null || taskIndex!==undefined) && (sectionIndex!==false || sectionIndex!==null || sectionIndex!==undefined) && !project) {
            console.log(sectionIndex, taskIndex, "task");
            toggleRemove(sectionIndex, taskIndex, null, "task");
        } else if((sectionIndex!==false || sectionIndex!==null || sectionIndex!==undefined) && (taskIndex===null || taskIndex===undefined || taskIndex===false) && !project) {
            console.log(sectionIndex, taskIndex, "section");
            toggleRemove(sectionIndex, taskIndex, null, "section");
        } else if(!sectionIndex && !taskIndex && project){
            if(project["projectId"]!=="Today" || project["projectId"]!=="Inbox") toggleRemove(sectionIndex, taskIndex, project["id"], "project");
        }
    }

    addMember = (project, e) => {
        const { toggleEditProjectMembers } = this.props;
        toggleEditProjectMembers(project);
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
    editedTaskKeyValue = (task, e) => {
        console.log(e, e.keyCode)
        // 27 for esc 13 for enter
        if(e && e.keyCode){
            switch(e.keyCode){
                case 27: // this is escape
                    this.editToogle(null, null, null, null, null);
                    break;
                case 13: // this is confirm
                    this.confirmEdit(task, null, e);
                    break;
                default: 
                    break;
            }
        }
    }

    /**
     * This function is onchange handler for task/section name edit
     */
    editedSectionValue = (e) => {
        console.log(e, e.key)
        this.setState({ editedSectionValue: e.target.value?e.target.value:"" })
    }

    /**
     * This function is onchange handler for project name edit
     */
    editedProjectValue = (e) => {
        console.log(e, e.key)
        this.setState({ editedProjectValue: e.target.value?e.target.value:"" })   
    }

    /**
     * This function deals with esc and enter button press from keyboard while editing section name
     */
    editedSectionKeyValue = (section, e) => {
        // 27 for esc 13 for enter
        if(e && e.keyCode){
            switch(e.keyCode){
                case 27: // this is escape
                    this.editToogle(null, null, null, null, null);
                    break;
                case 13: // this is confirm
                    this.confirmEdit(null, section, e);
                    break;
                default: 
                    break;
            }
        }
    }

    /**
     * This function deals with esc and enter button press from keyboard while editing project name
     */
    editedProjectKeyValue = (project, e) => {
        // 27 for esc 13 for enter
        if(e && e.keyCode){
            switch(e.keyCode){
                case 27: // this is escape
                    this.editToogle(null, null, null, null, null);
                    break;
                case 13: // this is confirm
                    this.confirmEdit(null, project, e);
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
                case "projectNameEdit":
                case "sectionNameEdit":
                case "taskCancelEdit":
                    this.editToogle(null, null, null, null, null);
                    break;
                default: 
                    break;
            }
        }
    }

    /**
     * This Single function can be used to handle confirm operation for edit section name or task
     */
    confirmEdit = (task, section, e) => {
        console.log(task, e)
        const { confirmEditTask, confirmEditSection, confirmEditProject } = this.props;
        const { editedTaskValue, editedSectionValue, editedProjectValue } = this.state
        if(e && e.currentTarget.getAttribute("name")){
            const name = e.currentTarget.getAttribute("name")
            console.log(name)
            switch(name){
                case "taskConfirmEdit":
                    console.log(editedTaskValue)
                    let newTask = Object.assign({}, task)
                    newTask["task"] = editedTaskValue;
                    // need to call the dashboard container function to update this task value to the db
                    confirmEditTask(newTask).then((res)=>{
                        console.log(res)
                        this.setState({ editedTaskValue: "" });
                    })
                    break;
                case "sectionNameEdit":
                    console.log(editedSectionValue)
                    let newSection= Object.assign({}, section)
                    newSection["name"] = editedSectionValue;
                    // need to call the dashboard container function to update this task value to the db
                    confirmEditSection(newSection).then((res)=>{
                        console.log(res)
                        this.setState({ editedSectionValue: "" });
                    })
                    break;
                case "projectNameEdit":
                    console.log("projectNameEdit")
                    confirmEditProject(editedProjectValue).then((response)=>{
                        console.log(response)
                        if(response["status"]){
                            // success
                        } else {
                            // there was an error
                        }
                        this.editToogle(null, null, null, null, null);
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
        const { projectToDisplay, editTaskToggle, editSectionToggle, editProjectToggle } = this.props
        const { addSectionForm, editedTaskValue, editedSectionValue, newSectionName, sectionHamToggle, projectHamToggle, editedProjectValue } = this.state
        if(!projectToDisplay) return <div className={"nocontents"}>No project selected</div>
        return(
            <div className={"contents"}>
                <div>
                    {
                        <span>
                            <h2 className={"flexHeader"}>
                                {projectToDisplay?
                                    editProjectToggle?
                                        <div>
                                            <Input name="projectNameEdit" value={editedProjectValue} onChange={this.editedProjectValue} onKeyDown={this.editedProjectKeyValue.bind(this, projectToDisplay)} autoFocus />
                                            <span className={"editSubtext"}>Press Esc to <a onClick={this.cancelEdit} name="projectNameEdit">cancel</a> and Enter to <a onClick={this.confirmEdit.bind(this, null, null)} name="projectNameEdit">confirm</a>.</span>
                                        </div>
                                    :<span onClick={(!projectToDisplay["projectId"] && !projectToDisplay["projectId"])?this.editToogle.bind(this, null, null, null, null, projectToDisplay):this.block}>{projectToDisplay["projectId"]}</span>                                            
                                :""}
                                {(!projectToDisplay["isToday"] && !projectToDisplay["isInbox"]) && <ButtonDropdown className={"dropDwonMwnu"} isOpen={projectHamToggle} toggle={this.toggleProjectHamToggle.bind(this, projectToDisplay["projectId"])}>
                                    <DropdownToggle style={{ color: "grey" }} color="link">
                                        <svg className="bi bi-three-dots-vertical" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M9.5 13a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm0-5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm0-5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" clipRule="evenodd"/>
                                        </svg>
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem><span onClick={this.editToogle.bind(this, null, null, null, null, projectToDisplay)}>Edit</span></DropdownItem>
                                        <DropdownItem><span onClick={this.removeToogle.bind(this, null, null, projectToDisplay)}>Remove</span></DropdownItem>
                                        <DropdownItem><span onClick={this.addMember.bind(this, projectToDisplay)}>Add member</span></DropdownItem>
                                    </DropdownMenu>
                                </ButtonDropdown>}
                            </h2>
                        </span>
                    }
                    <br/>
                    {projectToDisplay?projectToDisplay.sections.length>0?projectToDisplay.sections.map((section, i)=>{
                        return (
                            <div className="section" key={section["name"]?section["name"]:i}>
                                <h4 className={"sectionHeader"}>
                                    {(editSectionToggle===i && (editTaskToggle===false || editTaskToggle===null))?
                                        <div>
                                            <Input name="sectionNameEdit" value={editedSectionValue} onChange={this.editedSectionValue} onKeyDown={this.editedSectionKeyValue.bind(this, section)} autoFocus />
                                            <span className={"editSubtext"}>Press Esc to <a onClick={this.cancelEdit} name="sectionNameEdit" >cancel</a> and Enter to <a onClick={this.confirmEdit.bind(this, null, section)} name="sectionNameEdit">confirm</a>.</span>
                                        </div>:
                                        <span onClick={this.editToogle.bind(this, section, i, null, null, null)}>{section["name"]}</span>
                                    }
                                    <ButtonDropdown isOpen={sectionHamToggle===i} toggle={this.toggleSectionHamToggle.bind(this, i)}>
                                        <DropdownToggle style={{ color: "grey" }} color="link">
                                            <svg className="bi bi-three-dots-vertical" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M9.5 13a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm0-5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm0-5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" clipRule="evenodd"/>
                                            </svg>
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            {/* <DropdownItem header>Header</DropdownItem> */}
                                            {/* <DropdownItem divider /> */}
                                            {/* <DropdownItem disabled>Action</DropdownItem> */}
                                            <DropdownItem><span onClick={this.editToogle.bind(this, section, i, null, null, null)}>Edit</span></DropdownItem>
                                            <DropdownItem><span onClick={this.removeToogle.bind(this, section, i, null)}>Remove</span></DropdownItem>
                                            <DropdownItem>Archive</DropdownItem>
                                        </DropdownMenu>
                                    </ButtonDropdown>    
                                </h4>
                                <hr/>
                                {section["tasks"]?section["tasks"].map((task, j)=>{
                                    return <div key={task["date"]+j}> 
                                        <div className={"taskContainer"}>
                                            {(editTaskToggle===j && editSectionToggle===i)?
                                                <div>
                                                    <Input  name="taskConfirmEdit" value={editedTaskValue} onChange={this.editedTaskValue} onKeyDown={this.editedTaskKeyValue.bind(this, task)} autoFocus />
                                                    <span className={"editSubtext"}>Press Esc to <a onClick={this.cancelEdit} name="taskCancelEdit">cancel</a> and Enter to <a onClick={this.confirmEdit.bind(this, task)} name="taskConfirmEdit">confirm</a>.</span>
                                                </div> : <span onClick={this.editToogle.bind(this, section, i, task, j, null)} className={"taskName"}>{task["task"]}</span>
                                            }
                                            {(editTaskToggle===j && editSectionToggle===i)?<></>:<span className="taskActions">
                                                <button onClick={this.editToogle.bind(this, section, i, task, j, null)}>
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
                                                    <svg onClick={this.removeToogle.bind(this, i, j, null)} className="bi bi-dash-circle" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
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
                    {!projectToDisplay["isToday"]?<div className="addSectionLayout">
                        <button onClick={this.toggleAddSection}><span></span>Add Section</button>
                    </div>:""}
                    {
                        addSectionForm && 
                        <div className="addSectionForm">
                            <Input onChange={this.newSectionValueOnChange} value={newSectionName}/>
                            <Button onClick={this.addNewSection} className="commonBtn" disabled={newSectionName===""}>Add section</Button>
                            <a onClick={this.toggleAddSection} className="alert-link">Cancel</a>
                        </div>
                    }
                </div>
            </div> 
        )
    }
}
export default (withRouter(Dashboard))
