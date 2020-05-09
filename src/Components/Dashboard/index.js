import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state = {};
    }

    render() {
        const { selectedProj, projectToDisplay } = this.props
        return(
            <div className={"contents"}>
                <div>
                    {<span><h2>{projectToDisplay?projectToDisplay["projectId"]:""}</h2></span>}<br/>
                    {projectToDisplay?projectToDisplay.sections.map((proj, i)=>{
                        return <span key={proj["task"]?proj["task"]:i}><h4>{proj["task"]}</h4></span>
                    }):null}
                    <span><button onClick={()=>{this.props.toggleNewTaskModal(projectToDisplay)}}>Add</button></span>
                </div>
            </div> 
        )
    }
}
export default (withRouter(Dashboard))