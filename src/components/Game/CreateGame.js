import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { doGetCockpitExpansions } from '../../modules/cockpit';
import { getPlayersNumber } from '../../lib/utils/commonutils';
import { STORAGE_KEY_PLAYER_NAME } from '../Main';
import Octicon, { Dash, Plus, Search, Trashcan } from '@primer/octicons-react';
import { akPrompt } from '../Common/AKAlertConfirm';
import { addDeck, loadDecks, removeDeck } from '../../lib/utils/decksUtil';

class CreateGame extends PureComponent {
  static propTypes = {
    onCreateGame: PropTypes.func.isRequired,
    onAbort: PropTypes.func.isRequired,
    cockpit: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  state = {
    name: '',
    rounds: '20',
    expansions: [],
    search: '',
    decks: [],
    showDecks: false
  };

  ref_player_name = React.createRef();
  ref_rounds = React.createRef();

  constructor(props) {
    super(props);
    const playerName = localStorage.getItem(STORAGE_KEY_PLAYER_NAME);
    if (playerName) {
      this.state.name = playerName;
    }
  }

  render() {
    const { name, rounds, expansions, search, decks, showDecks } = this.state;
    const { cockpit } = this.props;

    let currentQuestions = 0;
    let currentAnswers = 0;
    if (expansions.length > 0) {
      expansions.forEach(expansion => {
        currentQuestions += expansion.q;
        currentAnswers += expansion.a;
      });
    }
    const hasCockpitManyExpansions = cockpit.loaded && Object.keys(cockpit.expansions).length > 1;
    return (
      <div className="container text-center">
        <div className="alert alert-dark mt-4 text-left">
          <div className="float-right">
            <button className="btn btn-danger float-right" onClick={this.props.onAbort}>
              &times;
            </button>
          </div>
          <h2>Create a new game</h2>

          <form onSubmit={e => e.preventDefault()}>
            <div className="form-group mb-2">
              <label>Choose a Nickname</label>
              <input
                ref={this.ref_player_name}
                placeholder="Choose a Nickname"
                className="form-control"
                type="text"
                value={name}
                onChange={e => this.setState({ name: e.target.value })}
              />
            </div>
            {name && (
              <div className="form-group mb-2">
                <label>Rounds</label>
                <input
                  ref={this.ref_rounds}
                  placeholder="Choose n° of Rounds"
                  className="form-control"
                  type="text"
                  value={rounds}
                  onChange={this.changeRounds}
                />
              </div>
            )}

            {!cockpit.loaded && (
              <div className="progress">
                <div
                  className="progress-bar progress-bar-striped bg-success"
                  role="progressbar"
                  style={{ width: '25%' }}
                />
              </div>
            )}
            {name && rounds && hasCockpitManyExpansions && (
              <div className="row">
                <div className="col-6">
                  <div className="form-group mb-2">
                    <div className="input-group">
                      <input type="text" className="form-control" value={search} onChange={this.onSearch} />
                      <div className="input-group-append">
                        <span className="input-group-text">
                          <Octicon icon={Search} />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ height: '390px', overflow: 'auto' }}>
                    <div className="list-group">
                      {Object.keys(cockpit.expansions)
                        .filter(name => {
                          const expansion = cockpit.expansions[name];
                          if (expansions.includes(expansion)) {
                            return false;
                          }
                          if (search) {
                            const expansion = cockpit.expansions[name];
                            return expansion.name.toLowerCase().indexOf(search.toLowerCase()) >= 0;
                          } else {
                            return true;
                          }
                        })
                        .sort((a, b) => {
                          return 0;
                        })
                        .map((name, i) => {
                          const expansion = cockpit.expansions[name];
                          return (
                            <button
                              onClick={e => this.onExpansionClick(e, expansion)}
                              type="button"
                              key={i}
                              className="text-left list-group-item"
                            >
                              <div className="d-flex justify-content-between">
                                <div>
                                  <strong dangerouslySetInnerHTML={{ __html: expansion.name }} />
                                  <span className="ml-3">Q: {expansion.q}</span>
                                  <span className="ml-3">A: {expansion.a}</span>
                                  <br />
                                  <span className="">Language: {expansion.lang}</span>
                                </div>
                                <div style={{ paddingTop: 12 }}>
                                  <Octicon icon={Plus} />
                                </div>
                              </div>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex justify-content-between mb-2">
                    <button
                      className="btn btn-outline-dark"
                      disabled={decks.length === 0}
                      title={decks.length === 0 ? 'No decks saved' : 'Choose from your decks'}
                      onClick={this.onShowDecks}
                    >
                      LOAD DECK
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-dark"
                      onClick={this.onSaveDeck}
                      disabled={expansions.length < 2}
                      title="Save current deck"
                    >
                      SAVE DECK
                    </button>
                  </div>
                  {expansions.length > 0 && (
                    <div className="mb-3">
                      <div className="mt-2">
                        <span className="">
                          <strong>Expansions:</strong> {expansions.length}
                        </span>
                        <span className="ml-3">
                          <strong>Questions:</strong> {currentQuestions}
                        </span>
                        <span className="ml-3">
                          <strong>Answers:</strong> {currentAnswers}
                        </span>
                      </div>

                      <p className="alert alert-info mt-2">
                        <span>
                          There are enough questions/answers for{' '}
                          {getPlayersNumber(rounds, currentQuestions, currentAnswers)} players
                        </span>
                      </p>

                      <div style={{ height: '286px', overflow: 'auto' }}>
                        <div className="list-group">
                          {expansions.map((expansion, i) => {
                            return (
                              <button
                                onClick={e => this.onExpansionClick(e, expansion)}
                                type="button"
                                key={i}
                                className="text-left list-group-item"
                              >
                                <div className="d-flex justify-content-between">
                                  <div>
                                    <strong dangerouslySetInnerHTML={{ __html: expansion.name }} />
                                    <span className="ml-3">Q: {expansion.q}</span>
                                    <span className="ml-3">A: {expansion.a}</span>
                                    <br />
                                    <span className="">Language: {expansion.lang}</span>
                                  </div>
                                  <div style={{ paddingTop: 12 }}>
                                    <Octicon icon={Dash} />
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mt-3 text-center">
              <button
                type="button"
                className="btn btn-dark"
                onClick={this.onCreate}
                disabled={!name || !rounds || expansions.length === 0}
              >
                CREATE
              </button>
            </div>
          </form>
        </div>
        {showDecks && (
          <div className="ak-modal-wrapper">
            <div
              className="modal fade show"
              style={{ display: 'block', zIndex: 10005 }}
              onClick={() => this.setState({ showDecks: false })}
            >
              <div className={'modal-dialog modal-dialog-centered modal-lg'} role="document">
                <div className="modal-content " onClick={e => e.stopPropagation()}>
                  <div className="modal-header bg-dark text-light">
                    <h5 className="modal-title">SELECT DECK</h5>
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                      aria-label="Close"
                      onClick={() => this.setState({ showDecks: false })}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body p-3">
                    <div className="list-group list-group-flush">
                      {decks.map((deck, i) => {
                        return (
                          <div key={i} className="list-group-item">
                            <div className="d-flex justify-content-between">
                              <button className="btn btn-link" onClick={() => this.onSelectDeck(deck)}>
                                {deck.name} ({deck.expansions.length} expansions)
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={e => this.onDeleteDeck(e, deck.name)}
                              >
                                <Octicon icon={Trashcan} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-backdrop fade show" style={{ zIndex: 10001 }} />
          </div>
        )}
      </div>
    );
  }

  componentDidMount() {
    if (this.state.name) {
      this.ref_rounds.current.focus();
    } else {
      this.ref_player_name.current.focus();
    }
    if (!this.props.cockpit.loaded) {
      this.props.dispatch(doGetCockpitExpansions());
    }
    const decks = loadDecks();
    if (decks) {
      this.setState({ decks });
    }
  }

  onSearch = e => {
    this.setState({ search: e.target.value });
  };

  onShowDecks = () => {
    this.setState({ showDecks: true });
  };

  onDeleteDeck = (e, name) => {
    e.currentTarget.blur();
    const decks = removeDeck(name);
    this.setState({ decks, showDecks: decks.length > 0 });
  };

  onSelectDeck = deck => {
    const { cockpit } = this.props;
    const expansions = [];
    deck.expansions.forEach(expansion => {
      if (cockpit.expansions[expansion]) {
        expansions.push(cockpit.expansions[expansion]);
      }
    });
    this.setState({ showDecks: false, expansions });
  };

  onSaveDeck = () => {
    akPrompt({
      message: 'Set a name for this deck',
      onOk: deck_name => {
        deck_name = deck_name.trim();
        if (!deck_name) {
          return;
        }
        const decks = addDeck(
          deck_name,
          this.state.expansions.map(expansion => expansion.code)
        );
        this.setState({ decks });
      },
      title: 'SAVE DECK'
    });
  };

  changeRounds = e => {
    let rounds = e.target.value;
    if (rounds === '') {
      this.setState({ rounds });
      return;
    }
    if (isNaN(rounds)) {
      return;
    }
    rounds = Math.floor(Number(rounds));
    if (rounds === Infinity || String(rounds) !== e.target.value || rounds < 1 || rounds > 100) {
      return;
    }
    this.setState({ rounds });
  };

  onExpansionClick = (e, expansion) => {
    e.currentTarget.blur();
    const { expansions } = this.state;
    let _next_expansions;
    if (expansions.includes(expansion)) {
      _next_expansions = expansions.filter(_expansion => _expansion !== expansion);
    } else {
      _next_expansions = expansions.map(a => a);
      _next_expansions.push(expansion);
    }
    this.setState({ expansions: _next_expansions });
  };

  onCreate = () => {
    const { name, rounds, expansions } = this.state;
    if (!name) {
      return;
    }
    if (!rounds) {
      return;
    }
    localStorage.setItem(STORAGE_KEY_PLAYER_NAME, name);
    if (expansions.length === 0) {
      return;
    } else {
      this.props.onCreateGame(
        name,
        Number(rounds),
        expansions.map(expansion => expansion.code)
      );
    }
  };
}

function mapStateToProps(state) {
  const { cockpit } = state;

  return {
    cockpit
  };
}

export default connect(mapStateToProps)(CreateGame);
