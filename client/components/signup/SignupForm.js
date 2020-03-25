import React from 'react';
import timezones from '../../data/timezones';
import map from 'lodash/map';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import TextFieldGroup from "../common/TextFieldGroup";
import validateInput from '../../../server/shared/validations/signup';
import { Redirect } from 'react-router-dom';

class SignupForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            passwordConfirmation: '',
            timezone: '',
            errors: {},
            isLoading: false,
            redirect: false,
            invalid: false,
        }
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.checkUserExists = this.checkUserExists.bind(this);
    }
    onChange(e){
        this.setState({[e.target.name]:e.target.value});
    }
    isValid() {
      const {errors, isValid } = validateInput(this.state);
      if(!isValid){
        this.setState({errors});
      }
      return isValid;
    }

    checkUserExists(e) {
      const field = e.target.name;
      const val = e.target.value;
      if (val !== '') {
        this.props.isUserExists(val).then(res => {
          let errors = this.state.errors;
          let invalid;
          if (res.data) {
            errors[field] = field + "already exists";
            invalid = true;
          } else {
            errors[field] = '';
            invalid = false;
          }
          this.setState({ errors, invalid });
        });
        console.log("checkUserExists end");
      }
    }

    onSubmit(e){
        e.preventDefault();
        if(this.isValid()) {
          this.setState({ errors: {}, isLoading:true });
          this.props.userSignupRequest(this.state).then(
            () => {
              this.props.addFlashMessage({
                type: 'success',
                text: 'You signed up successfully, Welcome!'
              });
              this.setState({redirect:true});
            },
            (err) => this.setState({
              errors:err.response.data, 
              isLoading: false,
            })
          );
        }
    }
    render() {
        if(this.state.redirect){
          console.info(this.state.redirect);
          return <Redirect to='/'/>;
        }
        const options = map(timezones,(val,key) =>
            <option key ={val} value={val}>{key}</option>
        );
        return (
          <form onSubmit={this.onSubmit}>
            <h1>Sign up Page</h1>
            <TextFieldGroup
              error={this.state.errors.username}
              label="Username"
              onChange={this.onChange}
              checkUserExists={this.checkUserExists}
              value={this.state.username}
              field="username"
            />

            <TextFieldGroup
              error={this.state.errors.email}
              label="Email"
              onChange={this.onChange}
              checkUserExists={this.checkUserExists}
              value={this.state.email}
              field="email"
            />

            <TextFieldGroup
              error={this.state.errors.password}
              label="Password"
              onChange={this.onChange}
              value={this.state.password}
              field="password"
              type="password"
            />

            <TextFieldGroup
              error={this.state.errors.passwordConfirmation}
              label="Password Confirmation"
              onChange={this.onChange}
              value={this.state.passwordConfirmation}
              field="passwordConfirmation"
              type="password"
            />
              
            <div className={classnames("form-group",{ 'has-error' : this.state.errors.timezone})}>
              <label className="control-label">Timezone</label>
              <select 
                value={this.state.timezone}
                onChange={this.onChange}
                type ="password" 
                name="timezone"
                className="form-control">
                <option value="" disabled>Choose Your Timezone</option>
                  {options}
              </select>
              {this.state.errors.timezone && 
              <span className = "help-block">{this.state.errors.timezone}</span>}
              </div>
              <div className="form-group">
                <button type="submit" disabled={this.state.isLoading || this.state.invalid} className ="btn btn-primary btn-lg">
                  Sign Up
                </button>
              </div>
          </form>

        );
    }
}

SignupForm.propTypes = {
  userSignupRequest: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired,
  isUserExists: PropTypes.func.isRequired
}


export default SignupForm;