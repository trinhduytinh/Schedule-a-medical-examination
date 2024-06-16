import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { USER_ROLE } from '../../utils';

export const userIsAuthenticated = (Component) => {
  class AuthenticatedComponent extends React.Component {
    render() {
      const { userInfo } = this.props;

      if (!userInfo) {
        return <Redirect to="/login" />;
      }

      if (userInfo.roleId === USER_ROLE.NEW_USER) {
        return <Redirect to="/system/home" />;
      }

      return <Component {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    userInfo: state.user.userInfo,
  });

  return connect(mapStateToProps)(AuthenticatedComponent);
};

export const userIsNotAuthenticated = (Component) => {
  class NotAuthenticatedComponent extends React.Component {
    render() {
      const { userInfo } = this.props;

      if (userInfo) {
        return <Redirect to="/system/home" />;
      }

      return <Component {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    userInfo: state.user.userInfo,
  });

  return connect(mapStateToProps)(NotAuthenticatedComponent);
};
