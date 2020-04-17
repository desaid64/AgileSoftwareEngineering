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
import adminHomepage from './admin/homepage';
import userHomepage from './user/homepage';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
class App extends React.Component {

  render() {
    const isAdmin = this.props.auth.user.isAdmin;
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
              {isAdmin ?
                <Route path="/homepage" component={requireAuth(adminHomepage)} />
                : <Route path="/homepage" component={requireAuth(userHomepage)} />
              }
              <Route path="/rulesconfig" component={requireAuth(RulesConfigPage)} exact />
              <Route path="/new-event" component={requireAuth(NewEventPage)} />
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

App.propTypes = {
  auth: PropTypes.object.isRequired,
}
function mapStateToProps(state) {
  return {
    auth: state.auth
  };
}
export default connect(mapStateToProps, {})(App);
//export default App;