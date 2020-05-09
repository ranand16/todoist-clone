import React from 'react';
import './leftPane.css'

const LeftPane = (props) => {
    const selectProj = (e)=>{
        props.switchProject(e.currentTarget.getAttribute("name"), e.currentTarget.getAttribute("project"))
    }

    const toggleAddNewProject = (e) => {
        console.log(e.currentTarget.getAttribute("name"))
        props.toggleNewProjectModal();
    }

    if(props["projects"] && props["projects"].length>0) {   
        return (
            <div className={"dashboard_leftpane"}>
                {
                    props["projects"].map((project, i)=>{
                        const key = project["id"]
                        return ( <div key={key} name={key} project={project["projectId"]} onClick={selectProj} className={"projTitleLeftPane"} ><span name={key}>{project['projectId']}</span></div>)
                    })
                }
                {
                    (<div name={"newproject"} onClick={toggleAddNewProject} className={"projTitleLeftPane"} ><span className={"addNew"}>Add new project</span></div>)
                }
            </div>
        );
    }
    return (
        <div className={"dashboard_leftpane"}>
            <div name={"invisible"} style={{visibility: "hidden"}} className={"projTitleLeftPane"} key={"invisible"} ><span>{"invisible"}</span></div>
        </div>
    );
}
export default LeftPane