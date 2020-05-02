import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import CustomNavbar from '../CustomNavbar';
import Dashboard from '../Dashboard';
import LeftPane from '../LeftPane';
import RightPane from '../RightPane';
import AddTaskModal from '../AddTask'
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
    }

    switchProject = (proj) => {
        console.log(proj)
        if(proj && proj!==this.state.selectedProj){
            console.log("hello therw")
            this.setState({ selectedProj: proj })
        }
    }

    toggleNewTaskModal = () =>{
        this.setState(prevState => ({ newTaskModalIsOpen: !prevState.newTaskModalIsOpen }));
    }

    addNewTask = async (task) => {
        const { addNewPersonalTask, addNewTask, firebase, profile } = this.props;
        const { selectedProj } = this.state;
        const currentUser = firebase.auth().currentUser
        const selected = {"Today":0, "Inbox": 1};
        console.log(currentUser);
        if(!currentUser) return
        if(!currentUser.uid) return 
        switch(selectedProj){
            case "Today":
            case "Inbox":
                const newUser = Object.assign({}, profile);
                newUser["projects"][selected[selectedProj]]["sections"].push(task)
                console.log(currentUser.uid, newUser)
                delete newUser["isEmpty"];delete newUser["isLoaded"];delete newUser["token"];
                await addNewPersonalTask(currentUser.uid, newUser)

            break;
            default:
            break;
        }
        this.toggleNewTaskModal();
        // addNewTask(task).then((res)=>{
        //     this.toggleNewTaskModal();
        // });
    }

    render(){
        console.log(this.props,this.state)
        const { selectedProj, newTaskModalIsOpen } = this.state
        console.log(this.props.firebase.auth().currentUser);
        const { profile } = this.props;
        const profileProjs = profile["projects"];
        const projects = profileProjs?[...profileProjs]:null
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
                        projects={projects}
                        switchProject={this.switchProject}
                    />
                    <Dashboard 
                        profile={profile} 
                        toggleNewTaskModal={this.toggleNewTaskModal} 
                        selectedProj={selectedProj}
                    />
                    <RightPane />
                </div>
            </>
        )
    }
}

const highOrderWrap = compose(
    withFirestore,
    withHandlers({ 
        addNewTask: props => async (newTodo) => props.firestore.add({ collection: 'todos' }, newTodo), 
        addNewPersonalTask: props => async (userDocId, usersDetail) => props.firestore.collection('userDetails').doc(userDocId).set(usersDetail)
        // addNewPersonalTask: props => async (userDocId, usersDetail) => props.firestore.collection('userDetails').doc(userDocId).set(usersDetail)
    }),
    firestoreConnect((props) => [{ collection: 'todos' }]), 
    withRouter,
    connect((state, props) => ({ 
        profile: state.firebase.profile,
        todosList: state.firestore.ordered.todos 
    }))
);

export default highOrderWrap(DashboardContainer);
