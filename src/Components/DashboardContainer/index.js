import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import CustomNavbar from '../CustomNavbar';
import Dashboard from '../Dashboard';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'

class DashboardContainer extends Component {
    constructor(props){
        super(props);
        this.state = {

        }
        console.log(props, this.state)
    }

    render(){
        console.log(this.state)
        return (
            <>
                <CustomNavbar firebase={this.props.firebase}/>
                <div className={"contents-container"}>
                    <a>Todoist</a>
                    <a>About</a>
                    <a>Github</a>
                    <Dashboard />
                    <a id="lastSpan">Logout</a>
                </div>
            </>
        )
    }

}

export default compose(firestoreConnect((props) => [{ collection: 'todos' }]), 
    connect((state, props) => ({ todosList: state.firestore.data.todos }))
)(withRouter(DashboardContainer));
