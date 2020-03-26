import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useParams,
    useRouteMatch
  } from "react-router-dom";

import NavigationBar from './NavigationBar';
import Greetings from './Greetings';
import SignupPage from './signup/SignupPage';
import LoginPage from './login/LoginPage';
import FlashMessageList from './flash/FlashMessageList';

class App extends React.Component{
    render(){
        return(
            <div className="container">
                <Router>
                    <div>
                        <NavigationBar/>
                        <FlashMessageList />
                        <Switch>
                            <Route path="/" component={Greetings} exact />
                            <Route path="/signup" component={SignupPage} />
                            <Route path="/login" component={LoginPage} />
                        </Switch>
                    </div>
                </Router>
            </div>
        );
    }
}


export default App;