import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../actions/authActions';

class NavigationBar extends React.Component {
  logout(e) {
    e.preventDefault();
    this.props.logout();
  }

  render() {
    const { isAuthenticated } = this.props.auth;
    const isAdmin = this.props.auth.user.isAdmin;
  
    const adminLinks = (
      <ul className="nav navbar-nav navbar-right">
        <li><Link to="#" onClick={this.logout.bind(this)}>Logout</Link></li>
      </ul>
    )
 
    const userLinks = (
      <ul className="nav navbar-nav navbar-right">
        <li><Link to={`config`} >Rules Config</Link></li>
        <li><Link to="#" onClick={this.logout.bind(this)}>Logout</Link></li>
      </ul>
    );
  
    
    const guestLinks = (
      <ul className="nav navbar-nav navbar-right">
        <li><Link to="signup">Sign up</Link></li>
        <li><Link to="login">Login</Link></li>
      </ul>
    );
    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <Link className="navbar-brand" to="/">Shift Management</Link>
          </div>
          <div className="collapse navbar-collapse">
            {!isAuthenticated ? guestLinks : (isAdmin ? adminLinks : userLinks)}
          </div>
        </div>
      </nav>
    );
  }
}

NavigationBar.propTypes = {
  auth: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired
}
function mapStateToProps(state) {
  return {
    auth: state.auth
  };
}

export default connect(mapStateToProps, { logout })(NavigationBar); 