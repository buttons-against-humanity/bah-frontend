import React, { PureComponent } from 'react';
import { akPrompt } from './Common/AKAlertConfirm';
import socketIOClient from 'socket.io-client';
import { akToast } from './Common/AkToast';
import PlayersBar from './Game/PlayersBar';
import Homepage from './Game/Homepage';
import AnswersList from './Game/AnswersList';
import RoundHeader from './Game/RoundHeader';
import ButtonsList from './Game/ButtonsList';
import OwnerInitialPage from './Game/OwnerInitialPage';
import OwnerNextRound from './Game/OwnerNextRound';
import CreateGame from './Game/CreateGame';
import Scoreboard from './Game/Scoreboard';

export const STORAGE_KEY_PLAYER_NAME = 'player_name';
const initialState = {
  name: '',
  game_uuid: null,
  owner: false,
  player: null,
  players: [],
  round: null,
  answers: undefined,
  answer: [],
  next_round: false,
  answered: false,
  rounds: 0,
  round_end_at: false,
  creating_game: false,
  winner: false,
  game_ended: false,
  loading: false
};

class Main extends PureComponent {
  state = Object.assign({}, initialState);

  socket;

  render() {
    const {
      game_uuid,
      owner,
      player,
      players,
      round,
      rounds,
      answers,
      answer,
      next_round,
      answered,
      round_end_at,
      creating_game,
      winner,
      game_ended,
      loading
    } = this.state;
    if (loading) {
      return (
        <div className="container mt-5">
          <div className="progress">
            <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: '45%' }} />
          </div>
        </div>
      );
    }
    if (creating_game) {
      return <CreateGame onCreateGame={this._onCreateGame} onAbort={() => this.setState({ creating_game: false })} />;
    }
    if (game_ended) {
      return <Scoreboard players={players} onContinue={this.onGameEnded} />;
    }
    const is_card_czar = round && round.card_czar.uuid === player.uuid;
    let has_valid_answers = false;
    if (answers) {
      has_valid_answers = answers.some(answer => !!answer.text);
    }
    const isPlayoff = round && round.n === -999;
    const isPlayoffPlayer = isPlayoff && round.players.includes(player.uuid);
    const isRoundPlayer = player && round && !is_card_czar && ((isPlayoff && isPlayoffPlayer) || !isPlayoff);
    const showButtons = !answered && isRoundPlayer;

    return (
      <div className="main-wrapper">
        <PlayersBar isPlayoff={isPlayoff} player={player} players={players} round={round} rounds={rounds} />
        <div className="p-3 text-center">
          {!game_uuid && <Homepage onCreateGame={this.onCreateGame} onJoinGame={this.onJoinGame} />}
          {game_uuid && owner && !round && !next_round && (
            <OwnerInitialPage
              players={players}
              game_uuid={game_uuid}
              onGameStart={this.onGameStart}
              onGameEnd={this.onEndGame}
            />
          )}
          {game_uuid && !owner && !round && !next_round && (
            <div className="container alert p-3 alert-dark">Waiting for the game to start...</div>
          )}
          {owner && next_round && <OwnerNextRound onEndGame={this.onEndGame} onNextRound={this.onNextRound} />}
          {!owner && next_round && <div className="container alert p-3 alert-dark">Waiting for the next round...</div>}
        </div>
        {round && !answers && (
          <RoundHeader
            isRoundPlayer={isRoundPlayer}
            answered={answered}
            onAnswerTimeout={this.onAnswerTimeout}
            onConfirmAnswer={this.onConfirmAnswer}
            round={round}
            answer={answer}
            round_end_at={round_end_at}
          />
        )}
        {round && answers && (
          <AnswersList
            winner={winner}
            card_czar_name={round.card_czar.name}
            is_card_czar={is_card_czar}
            has_valid_answers={has_valid_answers}
            answers={answers}
            onChooseWinner={this.onChooseWinner}
          />
        )}
        {showButtons && <ButtonsList onAnswer={this.onAnswer} player={player} />}
      </div>
    );
  }

  componentDidMount() {
    this.setupSocket();
  }

  componentWillUnmount() {
    if (this.socket && this.socket.connected) {
      this.socket.emit('bye', () => {
        this.socket.close();
      });
    }
  }

  setupSocket() {
    this.socket = socketIOClient({
      autoConnect: false,
      reconnectionDelay: 500,
      reconnectionAttempts: 20
    });
    this.socket.on('game:created', game_uuid => {
      this.setState({ game_uuid, loading: false });
    });
    this.socket.on('game:joined', player => {
      this.setState({ player });
    });
    this.socket.on('game:join_error', message => {
      this.setState({ game_uuid: null });
      akToast(message, 3000, true);
    });
    this.socket.on('game:players', players => {
      this.setState({ players });
    });
    this.socket.on('game:started', data => {
      akToast('Game Started!', 2000);
      this.setState({ rounds: data.rounds });
    });
    this.socket.on('game:owner_change', owner => {
      if (owner.uuid === this.state.player.uuid) {
        this.setState({ owner: true });
        akToast(`You are the new game owner!`, 4000);
      } else {
        akToast(`${owner.name} is the new game owner`, 2000);
      }
    });
    this.socket.on('game:czar_change', czar => {
      if (czar.uuid === this.state.player.uuid) {
        akToast(`You are the new card czar!`, 4000);
      } else {
        akToast(`${czar.name} is the new card czar`, 2000);
      }
      const { round } = this.state;
      const _round = Object.assign({}, round);
      _round.card_czar = czar;
      this.setState({ round: _round });
    });
    this.socket.on('game:ended', () => {
      this.socket.close();
      if (!this.state.players || this.state.players.length < 2) {
        this.onGameEnded();
      } else {
        this.setState({ game_ended: true });
      }
    });
    this.socket.on('player:update', player => {
      console.log('player', player);
      this.setState({ player });
    });
    this.socket.on('player:joined', player => {
      if (player !== this.state.name) {
        akToast(`${player} joined the game!`);
      }
    });
    this.socket.on('player:left', player => {
      if (player !== this.state.name) {
        akToast(`${player} left the game!`);
      }
    });
    this.socket.on('round:start', round => {
      this.setState({
        round,
        answers: undefined,
        answer: [],
        next_round: false,
        answered: false,
        winner: false,
        round_end_at: Date.now() + 60000
      });
    });
    this.socket.on('round:answers', answers => {
      this.setState({ answers });
    });
    this.socket.on('round:winner', winner => {
      this.setState({
        next_round: true,
        winner
      });
    });
  }

  onGameEnded = () => {
    this.setState(Object.assign({}, initialState));
  };

  onAnswer = answer => {
    if (!this.state.round) {
      return;
    }
    const { round, answer: currentAnswer } = this.state;
    const { numAnswers } = round.question;

    const newAnswer = [];
    if (currentAnswer.length < numAnswers) {
      currentAnswer.forEach(ans => newAnswer.push(ans));
    }
    newAnswer.push(answer);
    this.setState({ answer: newAnswer });
  };

  onConfirmAnswer = () => {
    if (!this.state.round || !this.state.answer) {
      return;
    }
    this.setState({ answered: true }, () => {
      this.socket.emit('round:answer', this.state.answer);
    });
  };

  onCreateGame = () => {
    this.setState({
      creating_game: true
    });
  };

  _onCreateGame = (name, rounds, expansions = false) => {
    this.setState(
      {
        creating_game: false,
        loading: true,
        name,
        owner: true
      },
      () => {
        const sendMsg = () => {
          this.socket.emit('game:create', { owner: name, rounds, expansions });
        };
        if (!this.socket.connected) {
          this.socket.open();
          setTimeout(sendMsg, 200);
        } else {
          sendMsg();
        }
      }
    );
  };

  onEndGame = () => {
    this.socket.emit('game:end');
  };

  onJoinGame = () => {
    this.askGameUUID();
  };

  askName = cb => {
    const nickname = localStorage.getItem(STORAGE_KEY_PLAYER_NAME);
    akPrompt({
      message: "What's your nickname ?",
      onOk: name => {
        name = name.trim();
        if (!name) {
          return;
        }
        localStorage.setItem(STORAGE_KEY_PLAYER_NAME, name);
        this.setState({ name }, cb);
      },
      title: 'NICKNAME',
      defaultValue: nickname
    });
  };

  askGameUUID = () => {
    akPrompt({
      message: 'Please insert Game UUID',
      onOk: game_uuid => {
        game_uuid = game_uuid.trim();
        if (!game_uuid) {
          return;
        }
        this.setState(
          {
            game_uuid
          },
          () => {
            this.askName(() => {
              const sendMsg = () => {
                this.socket.emit('game:join', {
                  game_uuid,
                  player_name: this.state.name
                });
              };
              if (!this.socket.connected) {
                this.socket.open();
                setTimeout(sendMsg, 200);
              } else {
                sendMsg();
              }
            });
          }
        );
      },
      title: 'GAME'
    });
  };

  onGameStart = () => {
    this.socket.emit('game:start');
  };

  onChooseWinner = answer => {
    this.socket.emit('round:winner', answer);
  };

  onNextRound = () => {
    this.socket.emit('round:next');
  };

  onAnswerTimeout = () => {
    akToast('Timeout expired!', 2000, true);
    if (!this.state.round) {
      return;
    }
    this.setState({ answered: true }, () => {
      this.socket.emit('round:answer', false);
    });
  };
}

export default Main;
