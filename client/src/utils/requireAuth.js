import React from 'react';
import { connect } from 'react-redux';
import { addFlashMessage } from '../actions/flashMessages';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
export default function(ComposedComponent) {
  class Authenticate extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            redirect: false,
            redirectValue: ''
        }
    }
    componentWillMount() {
      if (!this.props.isAuthenticated) {
        this.props.addFlashMessage({
          type: 'error',
          text: 'You need to login to access this page'
        });
        this.setState({redirect:true,redirectValue: "/login"});
      }
    }

    componentWillUpdate(nextProps) {
      if (!nextProps.isAuthenticated) {
        this.setState({redirect:true,redirectValue: "/"});
      }
    }

    render() {
        if(this.state.redirect){
            //console.info(this.state.redirect);
            return <Redirect to={this.state.redirectValue} />;
          }
        return (
            <ComposedComponent {...this.props} />
        );
    }
  }

  Authenticate.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    addFlashMessage:PropTypes.func.isRequired
  }


  function mapStateToProps(state) {
    return {
      isAuthenticated: state.auth.isAuthenticated
    };
  }

  return connect(mapStateToProps, { addFlashMessage })(Authenticate);
}
