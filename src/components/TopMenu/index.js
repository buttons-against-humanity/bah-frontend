import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import settings from '../../lib/settings';

class TopMenu extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  render() {
    return (
      <nav className="navbar navbar-expand-lg bg-dark">
        <Link to="/" className="navbar-brand" href="#">
          {settings.appDescription}
        </Link>
      </nav>
    );
  }
}
export default withRouter(TopMenu);
