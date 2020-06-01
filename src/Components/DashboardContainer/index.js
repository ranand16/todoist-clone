import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import CustomNavbar from '../CustomNavbar'
import Dashboard from '../Dashboard'
import LeftPane from '../LeftPane'
import RightPane from '../RightPane'
import AddTaskModal from '../Modals/AddTask'
import AddProjectModal from '../Modals/AddProject'
import RemoveModal from '../Modals/RemoveProject'
import fetchProjects from '../../Actions/fetchProjects'
import createNewProject from "../../Utility/createProject"
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withFirestore } from 'react-redux-firebase'
import { withHandlers } from 'recompose'
import './dashboard.css'
import CustomSpinner from "../Spinner"

class DashboardContainer extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectedProj: "Today",
            project: null, // will be used while creating a new task for a project
            newTaskModalIsOpen: false,
            newProjectModalIsOpen: false,
            removeModalToggle: false,
            profileProjects: [],
            profileProjs: null,
            selectedProjStructure: null,
            selectedsectionIndex: null,

            //dashboard
            editTaskToggle: false, // editing task is on-going 
            editSectionToggle: false, // editing task's section
            // spinner
            showSpinner: false,
            removeType: false,
            removeSectionToggle: false, // this will have section index to be removed
            removeTaskToggle: false, // this will have task index to be removed
            removeProjectToggle: false // this will have projectDocId to be removed
        }
        this.dispProjects = null;
    }

    componentDidMount(){
        let { profile, firebase, firestore, uid, profile2 } = this.props;
        firestore.setListener({ collection: 'userDetails', doc: uid })
        let profileProjs = profile2?profile2[uid]?profile2[uid]["projects"]:profile["projects"]:profile["projects"];
        profileProjs.map((project)=>{
            if(project["projectId"] === "Today") { 
                this.setState({selectedProj: project["id"]});
            }
            return null
        })
        // this.props.fetchProjects(projectDocIds, firebase).then((res)=>{// for the bug  that the new project is not live updated, projectDocIds is only set once during the component did mount
        this.props.fetchProjects(firebase).then((res)=>{// for the bug  that the new project is not live updated, projectDocIds is only set once during the component did mount
            // console.log(this.state)
        })
    }

    /**
     * @param {id} id will have the project id that needs to be selected
     * @param {projectName} projectName will have the project name that needs to be selected
     */
    switchProject = async (id, projectName) => {
        console.log(id, projectName, this.props)
        let { fetchProject } = this.props;
        let { selectedProj } = this.state;
        if(id && id !== selectedProj){
            this.setState({ 
                selectedProj: id,
                editTaskToggle: false, editSectionToggle: false // resetting if something is being edited while switching project
            })
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
     * This functon toggles the modal used for removing a task or a section
     */
    toggleRemoveModal = () => {
        this.setState(prevState => ({ removeModalToggle: !prevState.removeModalToggle }));
    }

    toggleRemoveVars = () => {
        this.setState({removeSectionToggle: false, removeType: false, showSpinner: false});
    }

    /**
     * @param {task} 
     */
    addNewTask = async (task) => {
        let { updateUserDetails, updateSection, firebase, profile } = this.props;
        let { selectedProj, selectedProjStructure, selectedsectionIndex } = this.state;
        let currentUser = firebase.auth().currentUser
        let selected = {"Today":1, "Inbox": 0};
        task["date"] = Date.now();
        if(selectedProjStructure["projectId"]==="Inbox" || selectedProjStructure["projectId"]==="Today"){
            let newUser = Object.assign({}, profile);
            newUser["projects"][selected[selectedProjStructure["projectId"]]]["sections"][selectedsectionIndex]["tasks"].push(task)
            delete newUser["isEmpty"];delete newUser["isLoaded"];delete newUser["token"];
            await updateUserDetails(currentUser.uid, newUser)
            this.toggleNewTaskModal(null);
        } else {
            // console.log(selectedProjStructure, task)
            selectedProjStructure["sections"][selectedsectionIndex]["tasks"].push(task)
            // console.log(selectedProjStructure)
            if(selectedProjStructure["id"]) await updateSection(selectedProjStructure["id"], selectedProjStructure["sections"])
            this.toggleNewTaskModal(null);
        }
    }

    addNewSectionToProject = async (name, project) => {
        let { updateUserDetails, updateSection, firebase, profile } = this.props;
        let { selectedProj } = this.state;
        let currentUser = firebase.auth().currentUser
        let selected = {"Today":1, "Inbox": 0};
        let newSection = {
            date: Date.now(),
            name,
            tasks: []
        }
        if(project["projectId"]==="Inbox"){ // Today cannot have sections
            let newUser = Object.assign({}, profile);
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
        let { addNewProjectToProjects, addNewProjectToUserProfile, firestore, firebase, profile } = this.props;
        let currentUser = firebase.auth().currentUser
        if(!project) return; // guarding
        let newProject = createNewProject(project, firestore);
        addNewProjectToProjects(newProject).then(async(res)=>{
            await addNewProjectToUserProfile(currentUser.uid, {id: newProject["id"]});
            this.props.fetchProjects(firebase).then((res)=>{// for the bug  that the new project is not live updated, projectDocIds is only set once during the component did mount
                // console.log(res, this.state)
                this.toggleNewProjectModal();
            })

        })
    }

    toggleEdit = (editTaskToggle, editSectionToggle) => {
        this.setState({ editTaskToggle, editSectionToggle })
    }

    toggleRemove = (sectionIndex, taskIndex, projectDocId, type) => {
        if(type){
            switch(type){
                case "section":
                    this.setState({ removeSectionToggle: sectionIndex, removeType: type })
                    break;
                case "task":
                    this.setState({ removeSectionToggle: sectionIndex, removeTaskToggle: taskIndex, removeType: type })
                    break;
                case "project":
                    this.setState({ removeProjectToggle: projectDocId, removeType: type })
                    break;
                default:
                    break;
            }
            this.toggleRemoveModal();
        }
    }
    /**
     * after pressing confirm/enter after typing a new task name.
     */
    confirmEditTask = async (newTaskValue) => {
        this.setState({ showSpinner: true })
        let { selectedProj, editTaskToggle, editSectionToggle } = this.state
        let { updateSection, updateUserDetails, profile, firebase } = this.props;
        let currentUser = firebase.auth().currentUser
        let { projectId, sections } = this.dispProjects.find(proj=>proj["id"] === selectedProj)
        let editedSections = JSON.parse(JSON.stringify(sections))
        if(projectId==="Today" || projectId==="Inbox"){
            let editedSection = JSON.parse(JSON.stringify(editedSections[editSectionToggle])) ;
            let editedTask = newTaskValue
            editedSection["tasks"][editTaskToggle] = editedTask
            editedSections[editSectionToggle] = editedSection
            let newUser = Object.assign({}, profile);
            let projIndex = newUser["projects"].findIndex(proj=> proj["projectId"]===projectId)
            newUser["projects"][projIndex]["sections"] = editedSections
            delete newUser["isEmpty"];delete newUser["isLoaded"];delete newUser["token"];
            return updateUserDetails(currentUser.uid, newUser).then((res)=>{
                this.toggleTaskSection()
                return res
            }).catch((err)=>{
                console.log(err)
            })
        } else {
            // console.log(sections, editSectionToggle, sections[editSectionToggle]["tasks"], editTaskToggle, sections[editSectionToggle]["tasks"][editTaskToggle])
            sections[editSectionToggle]["tasks"][editTaskToggle] = newTaskValue
            return updateSection(selectedProj, sections).then((res)=>{
                this.toggleTaskSection()
                return res
            }).catch((err)=>{
                console.log(err);
            })
        }
    }
    /**
     * after confirm/enter editing new section.
     */
    confirmEditSection = async (updatedSection) => {
        let { selectedProj, editSectionToggle } = this.state;
        let { updateSection, updateUserDetails, profile, firebase } = this.props;
        let { projectId, sections } = this.dispProjects.find(proj=>proj["id"] === selectedProj)
        let editedSections = JSON.parse(JSON.stringify(sections))
        editedSections[editSectionToggle] = updatedSection;
        let currentUser = firebase.auth().currentUser
        if(projectId === "Inbox" || projectId === "Today"){
            let newUser = Object.assign({}, profile);
            let projIndex = newUser["projects"].findIndex(proj=> proj["projectId"]===projectId)
            newUser["projects"][projIndex]["sections"] = editedSections
            delete newUser["isEmpty"];delete newUser["isLoaded"];delete newUser["token"];
            return updateUserDetails(currentUser.uid, newUser).then((res)=>{
                // console.log(res)
                this.toggleTaskSection()
                // this.setState({ editTaskToggle: false, editSectionToggle: false, showSpinner: false });
                return res
            }).catch((err)=>{
                console.log(err)
            })
        } else {
            updateSection(selectedProj, editedSections).then((response)=>{
                // console.log(response)
                this.toggleTaskSection()
                // this.setState({ editTaskToggle: false, editSectionToggle: false, showSpinner: false });
            }).catch((err)=>{
                console.log(err)
            })
        }
    }

    confirmRemoval = () => {
        const { selectedProj, removeSectionToggle, removeTaskToggle, removeType } = this.state
        const { updateSection, updateUserDetails, profile, deleteDoc, firebase } = this.props;
        let { sections, projectId } = this.dispProjects.find(proj=>proj["id"] === selectedProj)
        console.log(removeType)
        switch(removeType){
            case "section": 
                console.log(selectedProj)
                if(projectId === "Inbox" || projectId === "Today"){
                    let currentUser = firebase.auth().currentUser
                    let newUser = Object.assign({}, profile);
                    let projIndex = newUser["projects"].findIndex(proj=> proj["projectId"]===projectId)
                    newUser["projects"][projIndex]["sections"].splice(removeSectionToggle, 1)
                    delete newUser["isEmpty"];delete newUser["isLoaded"];delete newUser["token"];
                    updateUserDetails(currentUser.uid, newUser).then((res)=>{
                        this.toggleRemoveModal();
                        this.toggleRemoveVars();
                        return res
                    }).catch((err)=>{
                        this.toggleRemoveModal();
                        this.toggleRemoveVars();
                        console.log(err)
                    })
                } else {
                    sections.splice(removeSectionToggle, 1)
                    updateSection(selectedProj, sections).then((res)=>{
                        this.toggleRemoveModal();
                        this.toggleRemoveVars();
                        return res
                    }).catch((err)=>{
                        this.toggleRemoveModal();
                        this.toggleRemoveVars();
                        return err
                    })
                }
                break;
            case "task":
                console.log(removeSectionToggle, removeTaskToggle, removeType)
                console.log("task to be removed")
                if(projectId === "Inbox" || projectId === "Today"){
                    let currentUser = firebase.auth().currentUser
                    let newUser = Object.assign({}, profile);
                    let projIndex = newUser["projects"].findIndex(proj=> proj["projectId"]===projectId)
                    newUser["projects"][projIndex]["sections"][removeSectionToggle]["tasks"].splice(removeTaskToggle, 1)
                    delete newUser["isEmpty"];delete newUser["isLoaded"];delete newUser["token"];
                    updateUserDetails(currentUser.uid, newUser).then((res)=>{
                        this.toggleRemoveModal();
                        this.toggleRemoveVars();
                        return res
                    }).catch((err)=>{
                        this.toggleRemoveModal();
                        this.toggleRemoveVars();
                        console.log(err)
                    })
                } else {
                    let targetSection = Object.assign({}, sections[removeSectionToggle])
                    targetSection["tasks"].splice(removeTaskToggle, 1)
                    sections[removeSectionToggle] = targetSection
                    updateSection(selectedProj, sections).then((res)=>{
                        this.toggleRemoveModal();
                        this.toggleRemoveVars();
                        return res
                    }).catch((err)=>{
                        this.toggleRemoveModal();
                        this.toggleRemoveVars();
                        return err
                    })
                }
                break;
            case "project":
                console.log(selectedProj)
                console.log("project to be deleted")
                deleteDoc("projects",selectedProj).then((res)=>{
                    this.setState({ selectedProj: "Today" })
                    this.toggleRemoveModal();
                    this.toggleRemoveVars();
                    console.log(res)
                }).catch((err)=>{
                    console.log(err)
                })
                break;
            default:
                break;
        }

    }

    render(){
        // console.log(this.props, this.state)
        let { selectedProj, newTaskModalIsOpen, newProjectModalIsOpen, editTaskToggle, editSectionToggle, showSpinner, removeModalToggle, removeType } = this.state
        let { profile, profile2, projects, uid } = this.props;
        this.profile = profile2?profile2[uid]?profile2[uid]:profile:profile;
        let profileProjs = profile2?profile2[uid]?profile2[uid]["projects"].filter((proj)=>{
            if(proj["projectId"] === "Inbox" || proj["projectId"] === "Today") return proj
            return null
        }):null:null;
        if(!profileProjs) return ""
        let dispProjects = profileProjs.concat(projects.filter((item) => profileProjs.indexOf(item) < 0))

        this.dispProjects = dispProjects;
        let projectToDisplay = dispProjects.find((proj)=>{
            return proj["id"] === selectedProj
        })
        return (
            <>
                {/* SPINNER */}
                { showSpinner && <CustomSpinner />}
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
                
                <RemoveModal 
                    isOpen={removeModalToggle} 
                    removeType={removeType}
                    toggleRemoveModal={this.toggleRemoveModal} 
                    confirmRemoval={this.confirmRemoval}
                    toggleRemoveVars={this.toggleRemoveVars}

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
                        editTaskToggle = {editTaskToggle}// editing task is on-going 
                        editSectionToggle = {editSectionToggle}// editing task's section
                        updateToggle = {this.toggleEdit}
                        toggleRemove={this.toggleRemove}
                        confirmEditTask = {this.confirmEditTask}
                        confirmEditSection = {this.confirmEditSection}
                    />
                    <RightPane />
                </div>
            </>
        )
    }
}

const mapStateToProps = (state, props) =>{ 
    // console.log(state, props)
    let uid = state.authReducer["uid"]
    let profile = state.firebase.profile
    let profile2 = state.firestore["data"]["userDetails"];
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
        addNewProjectToUserProfile: props => async (userDocId, newProj) => props.firestore.collection('userDetails').doc(userDocId).update({projects: props.firebase.firestore.FieldValue.arrayUnion(newProj) }),
        deleteDoc: props => async (collectionName, docId) => props.firestore.collection(collectionName).doc(docId).delete()
    }), 
    // firestoreConnect((state, props) => { 
    //     return [{ collection: 'userDetails', doc: state.authReducer["uid"] }]
    // }),
    connect(mapStateToProps),
    withRouter
);

export default highOrderWrap(DashboardContainer);