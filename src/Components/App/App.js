import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Switch }  from 'react-router-dom';
import * as ROUTES from '../../Constants/routes'

import SignIn from '../SingIn';
import SignUp from '../SignUp';
import Dashboard from '../Dashboard';
import About from '../About';

function App() {
    const isSignedIn = false
    return (
        <Switch>
            <Route exact path={ROUTES.HOME} component={isSignedIn?null:SignIn} />
            <Route exact path={ROUTES.SIGNIN} component={SignIn} />
            <Route exact path={ROUTES.SIGNUP} component={SignUp} />
            <Route exact path={ROUTES.DASHBOARD} component={Dashboard} />
            <Route exact path={ROUTES.ABOUT} component={About} />
        </Switch>
    );
}

export default App;
