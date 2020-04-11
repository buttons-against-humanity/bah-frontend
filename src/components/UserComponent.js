import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Loading from './Common/Loading';
import { withRouter } from 'react-router-dom';

function checkUser(WrappedComponent) {
  return withRouter(
    connect(mapStateToProps)(
      class AdminComponent extends Component {
        static propTypes = {
          user: PropTypes.object.isRequired,
          history: PropTypes.object.isRequired
        };

        render() {
          const { user } = this.props;
          if (!user || !user.isLoaded) {
            return <Loading />;
          }
          if (!user.data) {
            return <div />;
          }
          return <WrappedComponent {...this.props} />;
        }

        componentDidUpdate(prevProps, prevState, snapshot) {
          if (!prevProps.user.isLoaded && this.props.user.isLoaded) {
            if (!this.props.user.data) {
              this.props.history.push('/login');
            }
          }
        }
      }
    )
  );
}

function mapStateToProps(state) {
  const { user } = state;

  return {
    user
  };
}

export default checkUser;
