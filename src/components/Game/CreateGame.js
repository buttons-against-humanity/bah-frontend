import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { doGetCockpitExpansions } from '../../modules/cockpit';
import { getPlayersNumber } from '../../lib/utils/commonutils';
import { STORAGE_KEY_PLAYER_NAME } from '../Main';
import Octicon, { Search } from '@primer/octicons-react';

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
    search: ''
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
    const { name, rounds, expansions, search } = this.state;
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

          <form onSubmit={this.onCreate}>
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
                              <strong dangerouslySetInnerHTML={{ __html: expansion.name }} />
                              <span className="ml-3">Q: {expansion.q}</span>
                              <span className="ml-3">A: {expansion.a}</span>
                              <br />
                              <span className="">Language: {expansion.lang}</span>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="mb-3">
                    {expansions.length > 0 && (
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
                    )}
                    <div className={expansions.length > 0 ? 'visible' : 'invisible'}>
                      <p className="alert alert-info mt-2">
                        <span>
                          There are enough questions/answers for{' '}
                          {getPlayersNumber(rounds, currentQuestions, currentAnswers)} players
                        </span>
                      </p>
                    </div>
                    <div style={{ height: '331px', overflow: 'auto' }}>
                      <div className="list-group">
                        {expansions.map((expansion, i) => {
                          return (
                            <button
                              onClick={e => this.onExpansionClick(e, expansion)}
                              type="button"
                              key={i}
                              className="text-left list-group-item"
                            >
                              <strong dangerouslySetInnerHTML={{ __html: expansion.name }} />
                              <span className="ml-3">Q: {expansion.q}</span>
                              <span className="ml-3">A: {expansion.a}</span>
                              <br />
                              <span className="">Language: {expansion.lang}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-2 text-center">
              <button
                type="submit"
                className="btn btn-dark"
                onClick={this.onCreate}
                disabled={!name || !rounds || expansions.length === 0}
              >
                CREATE
              </button>
            </div>
          </form>
        </div>
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
  }

  onSearch = e => {
    this.setState({ search: e.target.value });
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

  onCreate = e => {
    e.preventDefault();
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
