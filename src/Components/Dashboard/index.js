import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state = {};
    }

    render() {
        const { profile, projects, selectedProj, projectToDisplay } = this.props
        console.log(this.props, selectedProj, projects, projectToDisplay)
        // if(!projectToDisplay) return <div></div>
        return(
            <div className={"contents"}>
                <div>
                    {<span><h2>{selectedProj}</h2></span>}<br/>
                    {projectToDisplay?projectToDisplay.sections.map((proj, i)=>{
                        console.log(proj)
                        return <span key={proj["task"]?proj["task"]:i}><h4>{proj["task"]}</h4></span>
                    }):null}
                    <span><button onClick={()=>{this.props.toggleNewTaskModal()}}>Add</button></span>
                </div>
            </div> 
        )
    }
}
export default (withRouter(Dashboard))