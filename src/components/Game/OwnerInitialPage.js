import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Octicon, { Clippy } from '@primer/octicons-react';
import { akToast } from '../Common/AkToast';
import { copyToClipboard } from '../../lib/utils/commonutils';

class OwnerInitialPage extends PureComponent {
  static propTypes = {
    game_uuid: PropTypes.string.isRequired,
    players: PropTypes.array.isRequired,
    onGameStart: PropTypes.func.isRequired,
    onGameEnd: PropTypes.func.isRequired
  };

  render() {
    return (
      <div className="alert p-3 alert-dark">
        Game UUID: <strong>{this.props.game_uuid}</strong>
        <button
          type="button"
          tabIndex={-1}
          className="btn btn-link btn-sm align-baseline"
          onClick={this.copyToClipboard}
        >
          <Octicon icon={Clippy} size="small" />
        </button>
        <div className="m-3">
          <button
            className="btn btn-success mt-2"
            disabled={this.props.players.length === 0}
            onClick={this.props.onGameStart}
          >
            START
          </button>

          <button className="btn btn-danger ml-4 mt-2" onClick={this.props.onGameEnd}>
            ABORT
          </button>
        </div>
      </div>
    );
  }

  copyToClipboard = e => {
    e.preventDefault();
    copyToClipboard(this.props.game_uuid, () => {
      akToast('Copied to clipboard!');
    });
  };
}

export default OwnerInitialPage;
