import React from 'react';
import LoginForm from './LoginForm';
//import {connect} from 'react-redux';
//import {userSignupRequest,isUserExists} from '../../actions/signupActions';
//import PropTypes from 'prop-types';
//import {addFlashMessage} from '../../actions/flashMessages.js';

class LoginPage extends React.Component {
  render() {
    const {userSignupRequest,addFlashMessage,isUserExists} = this.props;
    return (
        <div className="row">
            <div className="col-md-4 col-md-offset-4">
                <LoginForm />
            </div>
        </div>
    );
  }
}

export default LoginPage;