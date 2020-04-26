import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class PlayersBar extends PureComponent {
  static propTypes = {
    round: PropTypes.object,
    rounds: PropTypes.number,
    player: PropTypes.object,
    players: PropTypes.array,
    isPlayoff: PropTypes.bool
  };

  render() {
    const { player, players, round, rounds, isPlayoff } = this.props;
    if (players.length === 0) {
      return null;
    }
    return (
      <div className="row my-2">
        <div className="col-12">
          <span className="ml-2">
            <strong>Players:</strong>
          </span>
          {players
            .sort((a, b) => {
              if (a.points > b.points) return -1;
              if (a.points < b.points) return 1;
              return 0;
            })
            .map((_player, i) => {
              const card_czar = round && round.card_czar.uuid === _player.uuid;
              return (
                <span key={i} className={'ml-3 p-2 ' + (card_czar ? ' bg-dark text-white' : '')}>
                  {_player.uuid === player.uuid ? ' * ' : ''}
                  {_player.name} - Points: {_player.points}
                </span>
              );
            })}
          {round && rounds > 0 && (
            <div className="float-right mr-3 p-2">
              <strong>{isPlayoff ? 'Playoff' : `Round ${round.n} / ${rounds}`}</strong>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default PlayersBar;
