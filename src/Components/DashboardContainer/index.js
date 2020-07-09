import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import CustomNavbar from '../CustomNavbar'
import Dashboard from '../Dashboard'
import LeftPane from '../LeftPane'
import RightPane from '../RightPane'
import AddTaskModal from '../Modals/AddTask'
import AddProjectModal from '../Modals/AddProject'
import EditMembersModal from '../Modals/EditMembers'
import EditProfileModal from '../Modals/EditProfileModal'
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
            settingsGearToggle: false, // toggle the settings panel clicking the gear icon
            profileModalToggle: false, // toggle profile panel to edit profile details

            //dashboard
            editTaskToggle: false, // editing task is on-going 
            editSectionToggle: false, // editing task's section
            editProjectToggle: false, // editing project
            editProjectMembersModalIsOpen: false, // editing memebers in the project
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
        let { profile, firebase, firestore, uid, userDetails } = this.props;
        firestore.setListener({ collection: 'userDetails' })
        // firestore.setListener({ collection: 'userDetails' })
        let profileProjs = userDetails?userDetails[uid]?userDetails[uid]["projects"]:profile["projects"]:profile["projects"];
        profileProjs.map((project)=>{
            if(project["projectId"] === "Today") { 
                this.setState({selectedProj: project["id"]});
            }
            return null
        })
        // this.props.fetchProjects(projectDocIds, firebase).then((res)=>{// for the bug  that the new project is not live updated, projectDocIds is only set once during the component did mount
        this.props.fetchProjects(firebase).then(()=>{// for the bug  that the new project is not live updated, projectDocIds is only set once during the component did mount
            // console.log(this.state)
        })
    }



    /**
     * @param {id} id will have the project id that needs to be selected
     * @param {projectName} projectName will have the project name that needs to be selected
     */
    switchProject = async (id, projectName) => {
        console.log(id, projectName, this.props)
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
        let { selectedProjStructure, selectedsectionIndex } = this.state;
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
        let { addNewProjectToProjects, addNewProjectToUserProfile, firestore, firebase } = this.props;
        let currentUser = firebase.auth().currentUser
        if(!project) return; // guarding
        let newProject = createNewProject(project, currentUser.uid, firestore);
        addNewProjectToProjects(newProject).then(async(res)=>{
            await addNewProjectToUserProfile(currentUser.uid, {id: newProject["id"], isOwner: true});
            this.props.fetchProjects(firebase).then((res)=>{// for the bug  that the new project is not live updated, projectDocIds is only set once during the component did mount
                // console.log(res, this.state)
                this.toggleNewProjectModal();
            })
        })
    }

    toggleEdit = (editTaskToggle, editSectionToggle, project) => {
        console.log(editTaskToggle, editSectionToggle, project)
        this.setState({ editTaskToggle, editSectionToggle, editProjectToggle: false })
        if(project && (project["projectId"]!=="Today" || project["projectId"]!=="Inbox")) this.setState({ editProjectToggle: project["id"] })
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

    toggleEditProjectMembers = () => {
        this.setState((prevState)=>{ return { editProjectMembersModalIsOpen: !prevState.editProjectMembersModalIsOpen } })
    }

    toggleSettingsGear = () => {
        this.setState((prevState)=>{ return { settingsGearToggle: !prevState.settingsGearToggle } });
    }

    toggleProfileModal = () => {
        this.setState((prevState)=>{ return { profileModalToggle: !prevState.profileModalToggle } })
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

    error = async (error) => {
        return new Error(error)
    }

    /**
     * This gets triggered when you press confirm after editing project name
     */
    confirmEditProject = async (newName) => {
        const { editProject } = this.props;
        const { selectedProj } = this.state;
        const project = this.dispProjects.find(proj=>proj["id"] === selectedProj)
        let dupProject = Object.assign({}, project);
        dupProject["projectId"] = newName;
        console.log(dupProject, newName);
        console.log({ id: dupProject["id"], dupProject });
        return editProject(dupProject["id"], dupProject).then(()=>{
            return { status: true }
        }).catch((err)=>{
            return { status: false, error: err }
        })
    }

    /**
     * This function gets called when someone presses confirm on the remove dialog box
     */
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

    /**
     * 
     * @param {new first name} firstName 
     * @param {new last name} lastName 
     */
    saveUserDetails = async (firstName, lastName) => {
        let { updateUserDetails, firebase, profile } = this.props;
        let currentUser = firebase.auth().currentUser
        let newUser = Object.assign({}, profile);
        newUser["firstName"] = firstName
        newUser["lastName"] = lastName
        delete newUser["isEmpty"];delete newUser["isLoaded"];delete newUser["token"];
        return await updateUserDetails(currentUser.uid, newUser)
    }

    render(){
        // console.log(this.props, this.state)
        let { selectedProj, newTaskModalIsOpen, newProjectModalIsOpen, editProjectMembersModalIsOpen, settingsGearToggle, profileModalToggle, editTaskToggle, editSectionToggle, showSpinner, removeModalToggle, removeType, editProjectToggle } = this.state
        let { profile, userDetails, projects, uid } = this.props;
        this.profile = userDetails?userDetails[uid]?userDetails[uid]:profile:profile;
        let profileProjs = userDetails?userDetails[uid]?userDetails[uid]["projects"].filter((proj)=>{
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
                <EditMembersModal 
                    isOpen={editProjectMembersModalIsOpen}
                    toggleNewMembersModal={this.toggleEditProjectMembers}
                    editMembers = {this.editMembers}
                    userDetails={userDetails}
                />
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
                <EditProfileModal 
                    isOpen={profileModalToggle}
                    toggleProfileModal={this.toggleProfileModal}
                    profile={profile}
                    saveUserDetails={this.saveUserDetails}
                />

                {/* UI */}
                <CustomNavbar 
                    isSettingOpen={settingsGearToggle}
                    firebase={this.props.firebase} 
                    toggleSettingsGear={this.toggleSettingsGear} 
                    toggleProfileModal={this.toggleProfileModal} 
                />
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
                        editProjectToggle = {editProjectToggle} // editing project's id
                        updateToggle = {this.toggleEdit}
                        toggleRemove={this.toggleRemove}
                        toggleEditProjectMembers = {this.toggleEditProjectMembers}
                        confirmEditTask = {this.confirmEditTask}
                        confirmEditSection = {this.confirmEditSection}
                        confirmEditProject = {this.confirmEditProject}
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
    let userDetails = state.firestore["data"]["userDetails"];
    return {
        userDetails,
        profile,
        uid,
        fetchProjects: async (firebase) => props.dispatch(fetchProjects(userDetails?userDetails[uid]:profile, firebase)), 
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
        deleteDoc: props => async (collectionName, docId) => props.firestore.collection(collectionName).doc(docId).delete(),
        editProject: props => async (docId, newProjObj) => props.firestore.collection("projects").doc(docId).update(newProjObj)
        
    }), 
    // firestoreConnect((state, props) => { 
    //     return [{ collection: 'userDetails', doc: state.authReducer["uid"] }]
    // }),
    connect(mapStateToProps),
    withRouter
);

export default highOrderWrap(DashboardContainer);