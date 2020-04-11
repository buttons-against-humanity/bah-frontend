import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { history } from './store';
import TopMenu from './components/TopMenu';
import Main from './components/Main';

class BaseAppComp extends PureComponent {
  static propTypes = {
    store: PropTypes.object.isRequired
  };

  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Router>
            <div className="root-wrapper d-flex flex-column">
              <div className="header-wrapper">
                <TopMenu />
              </div>
              <div className="main-outer flex-grow-1">
                <Switch>
                  <Route path="/" component={Main} />
                </Switch>
              </div>
            </div>
          </Router>
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default BaseAppComp;
