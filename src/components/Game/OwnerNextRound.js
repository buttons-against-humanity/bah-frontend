import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class OwnerNextRound extends PureComponent {
  static propTypes = {
    onNextRound: PropTypes.func.isRequired,
    onEndGame: PropTypes.func.isRequired
  };

  render() {
    return (
      <div className="container">
        <div className="alert p-3 alert-dark">
          <button className="btn btn-dark m-2" onClick={this.props.onNextRound}>
            NEXT ROUND
          </button>
          <button className="btn btn-dark m-2" onClick={this.props.onEndGame}>
            END GAME
          </button>
        </div>
      </div>
    );
  }
}

export default OwnerNextRound;
