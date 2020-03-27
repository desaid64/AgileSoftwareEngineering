import React from 'react';
import TextFieldGroup from "../common/TextFieldGroup";
import validateInput from '../../validations/login';
import { Redirect } from 'react-router-dom';
import {connect} from 'react-redux';
import {login} from '../../actions/authActions';
import PropTypes from 'prop-types';

class LoginForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            identifier: '',
            password: '',
            errors: {},
            isLoading: false,
            redirect: false
        }
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
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

    onSubmit(e){
        e.preventDefault(); 
        if(this.isValid()) {
            this.setState({ errors: {}, isLoading:true });
            this.props.login(this.state).then(
                (res) => {this.setState({redirect:true});},
                (err) => this.setState({ 
                    errors:err.response.data.errors,
                    isLoading: false,
                })
                
            );
        }
    }

    render() {
        if(this.state.redirect){
            //console.info(this.state.redirect);
            return <Redirect to='/'/>;
        }
        return (
          <form onSubmit={this.onSubmit}>
            <h1>Login</h1>

            {this.state.errors.form && <div className ="alert alert-danger">{this.state.errors.form}</div>}

            <TextFieldGroup
              error={this.state.errors.identifier}
              label="Username / Email"
              onChange={this.onChange}
              checkUserExists={this.checkUserExists}
              value={this.state.identifier}
              field="identifier"
            />

            <TextFieldGroup
              error={this.state.errors.password}
              label="Password"
              onChange={this.onChange}
              value={this.state.password}
              field="password"
              type="password"
            />

              <div className="form-group">
                <button type="submit" disabled={this.state.isLoading} className ="btn btn-primary btn-lg">
                  Login
                </button>
              </div>
          </form>

        );
    }
}

LoginForm.propTypes = {
    login: PropTypes.func.isRequired
  }

export default connect(null, { login })(LoginForm);