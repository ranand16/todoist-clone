import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Input, Button } from 'reactstrap';
import './dashboard.css'

class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state = {
            addSectionForm: false,
            newSectionName: ""
        };
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

    render() {
        const { selectedProj, projectToDisplay } = this.props
        const { addSectionForm, newSectionName } = this.state
        console.log(projectToDisplay);
        return(
            <div className={"contents"}>
                <div>
                    {<span><h2>{projectToDisplay?projectToDisplay["projectId"]:""}</h2></span>}<br/>
                    {projectToDisplay?projectToDisplay.sections.length>0?projectToDisplay.sections.map((section, i)=>{
                        return (
                            <div key={section["name"]?section["name"]:i}>
                                <h4>{section["name"]}</h4>
                                    {section["tasks"]?section["tasks"].map((task, i)=>{
                                        return <h5 key={task["date"]+i}>{task["task"]}</h5>
                                    }):null}
                                <div></div>
                                <span><button onClick={()=>{this.props.toggleNewTaskModal(projectToDisplay, i)}}>Add task to section</button></span>
                            </div>
                        )
                    }):null:null}
                    {projectToDisplay["projectId"]!=="Today"?<div className="addSectionLayout">
                        <button onClick={this.toggleAddSection}>Add Section</button>
                    </div>:""}
                    {
                        addSectionForm && 
                        <div className="addSectionForm">
                            <Input onChange={this.newSectionValueOnChange} value={newSectionName}/>
                            <Button onClick={this.addNewSection} className="commonBtn" disabled={newSectionName===""}>Add section</Button>
                            <a onClick={this.toggleAddSection} href="#" className="alert-link">Cancel</a>
                        </div>
                    }
                </div>
            </div> 
        )
    }
}
export default (withRouter(Dashboard))