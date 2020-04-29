import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import CustomNavbar from '../CustomNavbar';
import Dashboard from '../Dashboard';
import LeftPane from '../LeftPane';
import RightPane from '../RightPane';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'

class DashboardContainer extends Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }

    render(){
        console.log(this.props.todosList)
        return (
            <>
                <CustomNavbar firebase={this.props.firebase}/>
                <div className={"contents-container"}>
                    <LeftPane />
                    <Dashboard />
                    <RightPane />
                </div>
            </>
        )
    }

}

export default compose(firestoreConnect((props) => [{ collection: 'todos' }]), 
    connect((state, props) => ({ todosList: state.firestore.ordered.todos }))
)(withRouter(DashboardContainer));
