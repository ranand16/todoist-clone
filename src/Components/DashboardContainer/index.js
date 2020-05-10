import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import CustomNavbar from '../CustomNavbar'
import Dashboard from '../Dashboard'
import LeftPane from '../LeftPane'
import RightPane from '../RightPane'
import AddTaskModal from '../Modals/AddTask'
import AddProjectModal from '../Modals/AddProject'
import fetchProjects from '../../Actions/fetchProjects'
import createNewProject from "../../Utility/createProject"
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firestoreConnect, withFirestore } from 'react-redux-firebase'
import { withHandlers } from 'recompose'
import './dashboard.css'

class DashboardContainer extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectedProj: "Today",
            project: null, // will be used while creating a new task for a project
            newTaskModalIsOpen: false,
            newProjectModalIsOpen: false,
            profileProjects: [],
            profileProjs: null,
            selectedProjStructure: null,
            selectedsectionIndex: null
        }
    }

    componentDidMount(){
        const { profile, firebase, firestore, uid, profile2 } = this.props;
        firestore.setListener({ collection: 'userDetails', doc: uid })
        const profileProjs = profile2?profile2[uid]?profile2[uid]["projects"]:profile["projects"]:profile["projects"];
        profileProjs.map((project)=>{
            if(project["projectId"] === "Today") { 
                this.setState({selectedProj: project["id"]});
            }
            return null
        })
        // this.props.fetchProjects(projectDocIds, firebase).then((res)=>{// for the bug  that the new project is not live updated, projectDocIds is only set once during the component did mount
        this.props.fetchProjects(firebase).then((res)=>{// for the bug  that the new project is not live updated, projectDocIds is only set once during the component did mount
            console.log(this.state)
        })
    }

    /**
     * @param {id} id will have the project id that needs to be selected
     * @param {projectName} projectName will have the project name that needs to be selected
     */
    switchProject = async (id, projectName) => {
        console.log(id, projectName, this.props)
        const { fetchProject } = this.props;
        const { selectedProj } = this.state;
        if(id && id !== selectedProj){
            this.setState({ selectedProj: id })
        }
    }

    /**
     * @param {project} project will have the structure for the project in whih the new task will be added
     * if project is not present set selectedProjStructure as null
     * which means that cancel/cross was pressed
     */
    toggleNewTaskModal = (project, sectionIndex) =>{
        this.setState(prevState => ({ newTaskModalIsOpen: !prevState.newTaskModalIsOpen, selectedProjStructure: project, selectedsectionIndex: sectionIndex }));
    } 

    /**
     * This functon toggles the modal used for adding a new project
     */
    toggleNewProjectModal = () => {
        this.setState(prevState => ({ newProjectModalIsOpen: !prevState.newProjectModalIsOpen }));
    }

    /**
     * @param {task} 
     */
    addNewTask = async (task) => {
        const { updateUserDetails, updateSection, firebase, profile } = this.props;
        let { selectedProj, selectedProjStructure, selectedsectionIndex } = this.state;
        const currentUser = firebase.auth().currentUser
        const selected = {"Today":1, "Inbox": 0};
        task["date"] = Date.now();
        if(selectedProjStructure["projectId"]==="Inbox" || selectedProjStructure["projectId"]==="Today"){
            const newUser = Object.assign({}, profile);
            newUser["projects"][selected[selectedProjStructure["projectId"]]]["sections"][selectedsectionIndex]["tasks"].push(task)
            delete newUser["isEmpty"];delete newUser["isLoaded"];delete newUser["token"];
            await updateUserDetails(currentUser.uid, newUser)
            this.toggleNewTaskModal(null);
        } else {
            console.log(selectedProjStructure, task)
            selectedProjStructure["sections"][selectedsectionIndex]["tasks"].push(task)
            console.log(selectedProjStructure)
            if(selectedProjStructure["id"]) await updateSection(selectedProjStructure["id"], selectedProjStructure["sections"])
            this.toggleNewTaskModal(null);
        }
    }

    addNewSectionToProject = async (name, project) => {
        const { updateUserDetails, updateSection, firebase, profile } = this.props;
        let { selectedProj } = this.state;
        const currentUser = firebase.auth().currentUser
        const selected = {"Today":1, "Inbox": 0};
        const newSection = {
            date: Date.now(),
            name,
            tasks: []
        }
        if(project["projectId"]==="Inbox"){ // Today cannot have sections
            const newUser = Object.assign({}, profile);
            newUser["projects"][selected[project["projectId"]]]["sections"].push(newSection)
            delete newUser["isEmpty"];delete newUser["isLoaded"];delete newUser["token"];
            await updateUserDetails(currentUser.uid, newUser)
        } else {
            project["sections"].push(newSection)
            if(project["id"]) await updateSection(project["id"], project["sections"])
        }
        return true        
    }

    addNewProject = async (project) => {
        const { addNewProjectToProjects, addNewProjectToUserProfile, firestore, firebase, profile } = this.props;
        const currentUser = firebase.auth().currentUser
        if(!project) return; // guarding
        const newProject = createNewProject(project, firestore);
        addNewProjectToProjects(newProject).then(async(res)=>{
            await addNewProjectToUserProfile(currentUser.uid, {id: newProject["id"]});
            this.props.fetchProjects(firebase).then((res)=>{// for the bug  that the new project is not live updated, projectDocIds is only set once during the component did mount
                console.log(res, this.state)
                this.toggleNewProjectModal();
            })

        })
    }

    render(){
        console.log(this.props, this.state)
        const { selectedProj, newTaskModalIsOpen, newProjectModalIsOpen } = this.state
        const { profile, profile2, projects, uid } = this.props;
        this.profile = profile2?profile2[uid]?profile2[uid]:profile:profile;
        const profileProjs = profile2?profile2[uid]?profile2[uid]["projects"].filter((proj)=>{
            if(proj["projectId"] === "Inbox" || proj["projectId"] === "Today") return proj
            return null
        }):null:null;
        if(!profileProjs) return null
        const dispProjects = [...profileProjs, ...projects]
        const projectToDisplay = dispProjects.find((proj)=>{
            return proj["id"] === selectedProj
        })
        return (
            <>
                {/* MODALS/POPUPS  */}
                <AddProjectModal 
                    isOpen={newProjectModalIsOpen} 
                    toggleNewProjectModal={this.toggleNewProjectModal} 
                    addNewProject={this.addNewProject} 
                />
                <AddTaskModal 
                    isOpen={newTaskModalIsOpen} 
                    toggleNewTaskModal={this.toggleNewTaskModal} 
                    addNewTask={this.addNewTask} 
                />
                
                {/* UI */}
                <CustomNavbar firebase={this.props.firebase}/>
                <div className={"contents-container"}>
                    <LeftPane 
                        projects={dispProjects}
                        switchProject={this.switchProject}
                        toggleNewProjectModal={this.toggleNewProjectModal}
                    />
                    <Dashboard 
                        profile={this.profile} 
                        toggleNewTaskModal={this.toggleNewTaskModal} 
                        projects={dispProjects}
                        selectedProj={selectedProj}
                        projectToDisplay={projectToDisplay}
                        addNewSectionToProject = {this.addNewSectionToProject}
                    />
                    <RightPane />
                </div>
            </>
        )
    }
}

const mapStateToProps = (state, props) =>{ 
    console.log(state, props)
    const uid = state.authReducer["uid"]
    const profile = state.firebase.profile
    const profile2 = state.firestore["data"]["userDetails"];
    return {
        profile2,
        profile,
        uid,
        fetchProjects: async (firebase) => props.dispatch(fetchProjects(profile2?profile2[uid]:profile, firebase)), 
        projects: state.projectsReducer["projects"].map((proj)=>{
            return proj.data()
        })
    }
}

const highOrderWrap = compose(
    withFirestore,
    withHandlers({ 
        updateSection: props => async (projectId, updatedSection) => props.firestore.collection('projects').doc(projectId).update({sections: updatedSection }),
        updateUserDetails: props => async (userDocId, usersDetail) => props.firestore.collection('userDetails').doc(userDocId).set(usersDetail),
        addNewProjectToProjects: props => async (project) => props.firestore.collection('projects').doc(project["id"]).set(project),
        addNewProjectToUserProfile: props => async (userDocId, newProj) => props.firestore.collection('userDetails').doc(userDocId).update({projects: props.firebase.firestore.FieldValue.arrayUnion(newProj) })
    }), 
    // firestoreConnect((state, props) => { 
    //     return [{ collection: 'userDetails', doc: state.authReducer["uid"] }]
    // }),
    connect(mapStateToProps),
    withRouter
);

export default highOrderWrap(DashboardContainer);