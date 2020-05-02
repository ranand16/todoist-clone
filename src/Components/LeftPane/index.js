import React from 'react';
const LeftPane = (props) => {
    const selectProj = (e)=>{
        console.log(e.currentTarget.getAttribute("name"));
        props.switchProject(e.currentTarget.getAttribute("name")?e.currentTarget.getAttribute("name"):"Today")
    }
    console.log(props)
    if(props["projects"] && props["projects"].length>0) {   
        console.log(props["projects"])
        return (
            <div className={"dashboard_leftpane"}>
                {
                    props["projects"].map((project, i)=>{
                        console.log(project)
                        const key = project["projectId"]
                        return ( <div key={key} name={key} onClick={selectProj} className={"projTitleLeftPane"} ><span name={key}>{key}</span></div>)
                    })
                }
            </div>
        );
    } else {
        console.log("in else")
    }
    return (
        <div className={"dashboard_leftpane"}>
            <div name={"invisible"} style={{visibility: "hidden"}} className={"projTitleLeftPane"} key={"invisible"} ><span>{"invisible"}</span></div>
        </div>
    );
}
export default LeftPane