import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class PlayersBar extends PureComponent {
  static propTypes = {
    round: PropTypes.object,
    players: PropTypes.array
  };

  render() {
    const { players, round } = this.props;
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
            .map((player, i) => {
              const card_czar = round && round.card_czar.uuid === player.uuid;
              return (
                <span key={i} className={'ml-3 p-2 ' + (card_czar ? ' bg-dark text-white' : '')}>
                  {player.name} - Points: {player.points}
                </span>
              );
            })}
          {round && (
            <div className="float-right mr-3 p-2">
              <strong>Round {round.n}</strong>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default PlayersBar;
