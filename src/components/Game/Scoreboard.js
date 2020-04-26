import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Scoreboard extends PureComponent {
  static propTypes = {
    players: PropTypes.func.isRequired,
    onContinue: PropTypes.func.isRequired
  };

  render() {
    const { players, onContinue } = this.props;
    return (
      <div className="container text-center">
        <div className="alert alert-dark mt-4">
          <h3>Scoreboard</h3>
          <table className="table table-hover table-striped table-dark">
            <thead>
              <tr>
                <th>Player</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {players
                .sort((a, b) => {
                  if (a.points > b.points) return -1;
                  if (a.points < b.points) return 1;
                  return 0;
                })
                .map((player, i) => {
                  return (
                    <tr key={i}>
                      <td>{player.name}</td>
                      <td>{player.points}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          <div className="mt-4">
            <button className="btn btn-dark" onClick={onContinue}>
              CONTINUE
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Scoreboard;
