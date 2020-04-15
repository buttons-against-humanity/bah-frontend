import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import settings from '../../lib/settings';

class TopMenu extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  render() {
    return (
      <nav className="navbar navbar-expand-lg bg-dark">
        <Link to="/" className="navbar-brand">
          {settings.appDescription}
        </Link>
        <Link to="/cockpit">Cockpit</Link>
      </nav>
    );
  }
}
export default withRouter(TopMenu);
