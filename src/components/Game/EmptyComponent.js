import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class EmptyComponent extends PureComponent {
  static propTypes = {
    some: PropTypes.string
  };

  render() {
    return <div />;
  }
}

export default EmptyComponent;
