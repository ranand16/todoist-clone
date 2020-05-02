import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state = {};
    }

    render() {
        console.log(this.props)
        const { profile, addNewTask, selectedProj } = this.props
        console.log(selectedProj)
        const sections = (selectedProj==="Today" || selectedProj==="Inbox")?profile["projects"]:null;
        return(
            <div className={"contents"}>
                <div>
                    {<span><h2>{selectedProj}</h2></span>}<br/>
                    <span><button onClick={()=>{this.props.toggleNewTaskModal()}}>Add</button></span>
                </div>
            </div> 
        )
    }
}
export default (withRouter(Dashboard))