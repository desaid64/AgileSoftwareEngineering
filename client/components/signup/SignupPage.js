  
import React from 'react';
import SignupForm from './SignupForm';
import {connect} from 'react-redux';
import {userSignupRequest} from '../../actions/signupActions';
import PropTypes from 'prop-types';
import {addFlashMessage} from '../../actions/flashMessages.js';

class SignupPage extends React.Component {
  render() {
    const {userSignupRequest,addFlashMessage} = this.props;
    return (
        <div className="row">
            <div className="col-md-4 col-md-offset-4">
                <SignupForm  
                  userSignupRequest={userSignupRequest}
                  addFlashMessage={addFlashMessage} />
            </div>
        </div>
    );
  }
}
SignupForm.propTypes = {
  userSignupRequest: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired
}
export default connect(null,{userSignupRequest,addFlashMessage})(SignupPage);