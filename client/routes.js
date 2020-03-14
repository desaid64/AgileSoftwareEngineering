import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useRouteMatch
  } from "react-router-dom";

import App from './components/App';
import Greetings from './components/Greetings';
import SignupPage from './components/signup/SignupPage';

export default function main() {
    return (
        <Router>
            <Route path="/home" component={App}>
                <Switch>
                <Route path="/" component={Greetings} />
                <Route path="signup" component={SignupPage} />
                </Switch>
            </Route>
        </Router>    
    );
}