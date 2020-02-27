  
import React from 'react';
import SignupFrom from './SignupForm';
class SignupPage extends React.Component {
  render() {
    return (
        <div className="row">
            <div className="col-md-4 col-md-offset-4">
                <SignupFrom />
            </div>
        </div>
    );
  }
}

export default SignupPage;