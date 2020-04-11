import React, { PureComponent } from 'react';
import { akAlert, akPrompt } from './Common/AKAlertConfirm';
import socketIOClient from 'socket.io-client';
import { akToast } from './Common/AkToast';
import Octicon, { Heart } from '@primer/octicons-react';

class Main extends PureComponent {
  state = {
    name: '',
    game_uuid: null,
    owner: false,
    player: null,
    players: [],
    round: null,
    answers: undefined,
    answer: undefined,
    next_round: false,
    answered: false
  };

  socket;

  render() {
    const { game_uuid, name, owner, player, players, round, answers, answer, next_round, answered } = this.state;
    const is_card_czar = round && round.card_czar.uuid === player.uuid;
    return (
      <div className="main-wrapper">
        {players.length > 0 && (
          <div className="row my-2">
            <div className="col-12">
              <span>
                <strong>Players:</strong>
              </span>
              {players
                .sort((a, b) => {
                  if (a.points > b.points) return -1;
                  if (a.points < b.points) return 1;
                  return 0;
                })
                .map((player, i) => {
                  const card_czar = round && round.card_czar.name === player.name;
                  return (
                    <span key={i} className={'ml-3 p-2 ' + (card_czar ? ' bg-dark text-white' : '')}>
                      {player.name} - Points: {player.points}
                    </span>
                  );
                })}
            </div>
          </div>
        )}
        <div className="p-5 text-center">
          {game_uuid && name && owner && !round && !next_round && (
            <div className="alert p-3 alert-dark">
              Game UUID: <strong>{game_uuid}</strong>
              <div className="m-3">
                <button className="btn btn-danger" disabled={players.length === 0} onClick={this.onGameStart}>
                  START
                </button>
              </div>
            </div>
          )}
          {owner && next_round && (
            <div className="alert p-3 alert-dark">
              <button className="btn btn-dark" onClick={this.onNextRound}>
                NEXT ROUND
              </button>
            </div>
          )}
          {!owner && next_round && <div className="alert p-3 alert-dark">Waiting for next round...</div>}
          {game_uuid && name && !owner && !round && !next_round && (
            <div className="alert p-3 alert-dark">Waiting game to start...</div>
          )}
          {!game_uuid && (
            <div className="text-center">
              <button className="btn btn-lg mr-2 btn-dark" onClick={this.onCreateGame}>
                CREATE NEW GAME
              </button>
              <button className="btn btn-lg ml-2 btn-dark" onClick={this.onJoinGame}>
                JOIN A GAME
              </button>
            </div>
          )}
        </div>
        {round && !answers && (
          <div className="container text-center mb-4">
            <div className="alert alert-dark">
              <p className="display-4" dangerouslySetInnerHTML={{ __html: this._getFullTextAnswer() }} />
              {answer && !answered && (
                <button className="btn btn-dark" onClick={this.onConfirmAnswer}>
                  CONFIRM
                </button>
              )}
            </div>
          </div>
        )}
        {round && answers && (
          <div className="container text-center mb-4">
            <div className="alert alert-dark">
              {is_card_czar && <h2>Which one do you prefer?</h2>}
              <div className="list-group">
                {answers.map((answer, i) => {
                  return (
                    <div key={i} className="list-group-item p-5 d-flex justify-content-between align-items-center">
                      <span dangerouslySetInnerHTML={{ __html: answer.text }} />
                      {is_card_czar && (
                        <button className="btn btn-dark" onClick={e => this.onChooseWinner(answer)}>
                          <Octicon icon={Heart} size="small" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {player && round && !is_card_czar && !answers && (
          <div className="container">
            <h4 className="text-center">COMPLETE THE SENTENCES...</h4>
            <div className="row">
              {player.answers.map((answer, i) => {
                return (
                  <div key={i} className="col-lg-3 col-2">
                    <button className="btn btn-link" onClick={e => this.onAnswer(e, answer)}>
                      <div className="card p-3 mb-3">
                        <div className="card-body">
                          <div className="card-text" dangerouslySetInnerHTML={{ __html: answer.text }} />
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {player && round && !is_card_czar && answers && answer && (
          <div className="container ">
            <h4>
              Wait for <strong>{round.card_czar.name}</strong> to choose the winner...
            </h4>
          </div>
        )}
      </div>
    );
  }

  componentDidMount() {
    this.socket = socketIOClient();
    this.socket.on('news', data => {
      console.log('Got', data);
    });
    this.socket.on('game:created', game_uuid => {
      console.log('Got', game_uuid);
      this.setState({ game_uuid });
    });
    this.socket.on('game:joined', player => {
      this.setState({ player });
    });
    this.socket.on('player:update', player => {
      console.log('player', player);
      this.setState({ player });
    });
    this.socket.on('game:join_error', message => {
      console.log('Got', message);
      this.setState({ game_uuid: null });
      akToast(message, 3000, true);
    });
    this.socket.on('game:players', players => {
      this.setState({ players });
    });
    this.socket.on('game:started', () => {
      akToast('Game Started!', 2000);
    });
    this.socket.on('round:start', round => {
      this.setState({ round, answers: undefined, answer: undefined, next_round: false });
    });
    this.socket.on('round:answers', answers => {
      this.setState({ answers });
    });
    this.socket.on('player:joined', player => {
      if (player !== this.state.name) {
        akToast(`${player} joined the game!`);
      }
    });
    this.socket.on('round:winner', winner => {
      this.setState(
        {
          next_round: true
        },
        () => {
          akAlert(
            <p>
              <strong>{winner.player}</strong> with:
              <br />
              <span dangerouslySetInnerHTML={{ __html: winner.text }} />
            </p>,
            'ROUND WINNER'
          );
        }
      );
    });
  }

  componentWillUnmount() {
    this.socket.emit('Bye');
  }

  onAnswer = (e, answer) => {
    e.preventDefault();
    if (!this.state.round) {
      return;
    }
    this.setState({ answer });
  };

  onConfirmAnswer = () => {
    if (!this.state.round || !this.state.answer) {
      return;
    }
    this.socket.emit('round:answer', this.state.answer);
  };

  onCreateGame = () => {
    this.setState({ owner: true }, () => {
      this.askName(() => {
        this.socket.emit('game:create', this.state.name);
      });
    });
  };

  onJoinGame = () => {
    this.askGameUUID();
  };

  askName = cb => {
    if (this.state.name) {
      cb();
      return;
    }
    akPrompt(
      "What's your nickname ?",
      name => {
        if (!name) {
          return;
        }
        this.setState({ name }, cb);
      },
      null,
      'text',
      'NICKNAME'
    );
  };

  askGameUUID = () => {
    akPrompt(
      'Please insert Game UUID',
      game_uuid => {
        if (!game_uuid) {
          return;
        }
        this.setState(
          {
            game_uuid
          },
          () => {
            this.askName(() => {
              this.socket.emit('game:join', {
                game_uuid,
                player_name: this.state.name
              });
            });
          }
        );
      },
      () => {},
      'text',
      'GAME'
    );
  };

  onGameStart = () => {
    this.socket.emit('game:start');
  };

  _getFullTextAnswer() {
    const { round, answer } = this.state;
    if (!answer) {
      return round.question.text;
    }
    const { question } = round;
    let text = question.text;
    if (text.indexOf('_') < 0) {
      text += `<strong>${answer.text}</strong>`;
    } else {
      if (question.numAnswers === 1) {
        text = text.replace('_', ` <strong>${answer.text}</strong> `);
      } else if (question.numAnswers > 1) {
        for (let i = 0; i < question.numAnswers; i++) {
          text = text.replace('_', ` <strong>${answer.text[i]}</strong> `);
        }
      }
    }
    return text;
  }

  onChooseWinner = answer => {
    this.socket.emit('round:winner', answer);
  };

  onNextRound = () => {
    this.socket.emit('round:next');
  };
}

export default Main;
