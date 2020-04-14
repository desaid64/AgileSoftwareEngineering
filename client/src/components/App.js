import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import NavigationBar from './NavigationBar';
import Greetings from './Greetings';
import SignupPage from './signup/SignupPage';
import LoginPage from './login/LoginPage';
import RulesConfigPage from './rules-config/RulesConfigPage'
import FlashMessageList from './flash/FlashMessageList';
import NewEventPage from './events/NewEventPage';
import requireAuth from '../utils/requireAuth';
class App extends React.Component {
  render() {
    return (
      <div className="container">
        <Router>
          <div>
            <NavigationBar />
            <FlashMessageList />
            <Switch>
              <Route path="/" component={Greetings} exact />
              <Route path="/signup" component={SignupPage} />
              <Route path="/login" component={LoginPage} />
              <Route path="/config/:dept_id" component={requireAuth(RulesConfigPage)} exact />
              <Route path="/new-event" component={requireAuth(NewEventPage)} />
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}


export default App;