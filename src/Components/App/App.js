import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Switch, withRouter }  from 'react-router-dom';
import * as ROUTES from '../../Constants/routes'
import { connect } from 'react-redux';
import { compose } from 'redux'
import fetchsignedInUserDetails from '../../Actions/fetchsignedInUserDetails'

import SignIn from '../SingIn';
import SignUp from '../SignUp';
import DashboardContainer from '../DashboardContainer';
import About from '../About';
import { withFirebase } from 'react-redux-firebase';
import ProtectedRoute from '../ProtectedRoute'

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isSignedIn: false
        };
    }

    componentDidMount(){
        // let user = JSON.parse(window.localStorage.getItem("newUser"));
    }
    render(){
        const { isSignedIn } = this.state;
        return (
            <Switch>
                <Route exact path={ROUTES.HOME} component={isSignedIn?<div>Not signed in </div>:SignIn} />
                <Route exact path={ROUTES.SIGNIN} component={SignIn} />
                <Route exact path={ROUTES.SIGNUP} component={SignUp} />
                <ProtectedRoute path={ROUTES.DASHBOARD} auth={this.props.auth} component={DashboardContainer} />
                <Route exact path={ROUTES.ABOUT} component={About} />
            </Switch>
        );
    }
}

const mapStateToProps = state =>  {
    // console.log(state.firebase)
    return { auth: state.firebase.auth }
}
const mapDispatchToProps = (dispatch) => {
    return {
        fetchsignedInUserDetails:  (user) => dispatch(fetchsignedInUserDetails(user))
    }
}

const highOrderWrap = compose(withFirebase, withRouter, connect(mapStateToProps, mapDispatchToProps));

export default highOrderWrap(App);