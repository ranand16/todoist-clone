import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import CustomNavbar from '../CustomNavbar';
import Dashboard from '../Dashboard';
import LeftPane from '../LeftPane';
import RightPane from '../RightPane';
import AddTaskModal from '../AddTask'
import fetchProjects from '../../Actions/fetchProjects'
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
            newTaskModalIsOpen: false
        }
    }

    componentDidMount(){
        console.log(this.props)
        const { profile, firebase } = this.props;
        const profileProjs = profile["projects"];
        console.log(profileProjs);
        let projectDocIds = [];
        profileProjs.map((project)=>{
            if(project["projectId"] === "Today") { 
                this.setState({selectedProj: project["id"]});
                return null;
            }
            if(project["projectId"] === "Inbox") return null;
            projectDocIds.push(project["id"])
        })
        this.props.fetchProjects(projectDocIds, firebase).then((res)=>{
            console.log(this.state)
        })
    }

    switchProject = async (id, projectName) => {
        console.log(id, projectName, this.props)
        const { fetchProject } = this.props;
        const { selectedProj } = this.state;
        if(id && id !== selectedProj){
            this.setState({ selectedProj: id })
        }
    }

    toggleNewTaskModal = () =>{
        this.setState(prevState => ({ newTaskModalIsOpen: !prevState.newTaskModalIsOpen }));
    } 

    addNewTask = async (task) => {
        const { addNewPersonalTask, addNewTask, firebase, profile, projects } = this.props;
        const { selectedProj } = this.state;
        const currentUser = firebase.auth().currentUser
        const selected = {"":"Today", "":"Inbox"};
        const profileProjs = profile["projects"].filter((proj)=>{
            if(proj["projectId"] === "Inbox" || proj["projectId"] === "Today") return proj
            return null
        });
        console.log(selectedProj, [...projects, ...profileProjs], currentUser);
        const allProjects = [...projects, ...profileProjs];
        // allProjects.

        const selectedProject = allProjects.find((proj)=>{
            console.log(proj["id"], selectedProj)
            return proj["id"] === selectedProj
        })
        if(selectedProject["projectId"]==="Inbox" || selectedProject["projectId"]==="Today"){
            const newUser = Object.assign({}, profile);
            newUser["projects"][selected[selectedProj]]["sections"].push(task)
            delete newUser["isEmpty"];delete newUser["isLoaded"];delete newUser["token"];
            await addNewPersonalTask(currentUser.uid, newUser)
        } else {

        }
        this.toggleNewTaskModal();
        // addNewTask(task).then((res)=>{
        //     this.toggleNewTaskModal();
        // });
        return 
        if(!currentUser) return
        if(!currentUser.uid) return 
        switch(selectedProj){
            case "Today":
            case "Inbox":
                const newUser = Object.assign({}, profile);
                newUser["projects"][selected[selectedProj]]["sections"].push(task)
                delete newUser["isEmpty"];delete newUser["isLoaded"];delete newUser["token"];
                await addNewPersonalTask(currentUser.uid, newUser)
            break;
            default:
            break;
        }
        this.toggleNewTaskModal();
        addNewTask(task).then((res)=>{
            this.toggleNewTaskModal();
        });
    }

    render(){
        console.log(this.props, this.state)
        const { selectedProj, newTaskModalIsOpen } = this.state
        const { profile, projects } = this.props;
        const profileProjs = profile["projects"].filter((proj)=>{
            if(proj["projectId"] === "Inbox" || proj["projectId"] === "Today") return proj
            return null
        });
        const projectToDisplay = projects.find((proj)=>{
            console.log(proj["id"], selectedProj)
            return proj["id"] === selectedProj
        })
        const dispProjects = [...profileProjs, ...projects]
        console.log(projects, dispProjects)
        return (
            <>
                <AddTaskModal 
                    isOpen={newTaskModalIsOpen} 
                    toggleNewTaskModal={this.toggleNewTaskModal} 
                    addNewTask={this.addNewTask} 
                />
                <CustomNavbar firebase={this.props.firebase}/>
                <div className={"contents-container"}>
                    <LeftPane 
                        projects={dispProjects}
                        switchProject={this.switchProject}
                    />
                    <Dashboard 
                        profile={profile} 
                        toggleNewTaskModal={this.toggleNewTaskModal} 
                        selectedProj={selectedProj}
                        projectToDisplay={projectToDisplay}
                    />
                    <RightPane />
                </div>
            </>
        )
    }
}

const mapStateToProps = (state, props) =>{ 
    console.log(state, props)
    return {
        profile: state.firebase.profile,
        fetchProjects: async (projectDocIds, fb) => props.dispatch(fetchProjects(projectDocIds, fb)), 
        projects: state.projectsReducer["projects"].map((proj)=>{
            console.log(proj.data())
            return proj.data()
        })
    }
}

const highOrderWrap = compose(
    withFirestore,
    withHandlers({ 
        addNewTask: props => async (newTodo) => props.firestore.add({ collection: 'projects' }, newTodo), 
        addNewPersonalTask: props => async (userDocId, usersDetail) => props.firestore.collection('userDetails').doc(userDocId).set(usersDetail),
    }),
    // firestoreConnect((props) => [{ collection: 'projects' }]), 
    withRouter,
    connect(mapStateToProps)
);

export default highOrderWrap(DashboardContainer);