import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state = {};
    }

    render() {
        const { selectedProj, projectToDisplay } = this.props
        console.log(projectToDisplay);
        return(
            <div className={"contents"}>
                <div>
                    {<span><h2>{projectToDisplay?projectToDisplay["projectId"]:""}</h2></span>}<br/>
                    {projectToDisplay?projectToDisplay.sections.length>0?projectToDisplay.sections.map((section, i)=>{
                        return (
                            <div key={section["name"]?section["name"]:i}>
                                <h4>{section["name"]}</h4>
                                    {section["tasks"]?section["tasks"].map((task)=>{
                                        return <h5 key={task["task"]}>{task["task"]}</h5>
                                    }):null}
                                <div></div>
                                <span><button onClick={()=>{this.props.toggleNewTaskModal(projectToDisplay, i)}}>Add task to section</button></span>
                            </div>
                        )
                    }):null:null}
                </div>
            </div> 
        )
    }
}
export default (withRouter(Dashboard))