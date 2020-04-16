import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { doGetCockpitExpansions } from '../../modules/cockpit';
import { getPlayersNumber } from '../../lib/utils/commonutils';

class CreateGame extends PureComponent {
  static propTypes = {
    onCreateGame: PropTypes.func.isRequired,
    onAbort: PropTypes.func.isRequired,
    cockpit: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  state = {
    name: '',
    rounds: '',
    expansions: [],
    choose: false
  };

  render() {
    const { name, rounds, expansions, choose } = this.state;
    const { cockpit } = this.props;

    let currentQuestions = 0;
    let currentAnswers = 0;
    if (expansions.length > 0) {
      expansions.forEach(expansion => {
        currentQuestions += expansion.q;
        currentAnswers += expansion.a;
      });
    }
    return (
      <div className="container text-center">
        <div className="alert alert-dark mt-4 text-left">
          <div className="row">
            <div className="col-9">
              <h2>Create a new game</h2>
            </div>
            <div className="col-1 offset-2">
              <button className="btn btn-danger float-right" onClick={this.props.onAbort}>
                &times;
              </button>
            </div>
          </div>

          <form onSubmit={this.onCreate}>
            <div className="form-group mb-2">
              <label>Choose a Nickname</label>
              <input
                placeholder="Choose a Nickname"
                className="form-control ml-2"
                type="text"
                value={name}
                onChange={e => this.setState({ name: e.target.value })}
              />
            </div>
            {name && name.length > 2 && (
              <div className="form-group mb-2">
                <label>Rounds</label>
                <input
                  placeholder="Choose n° of Rounds"
                  className="form-control ml-2"
                  type="text"
                  value={rounds}
                  onChange={this.changeRounds}
                />
              </div>
            )}
          </form>
          {!cockpit.loaded && (
            <div className="progress">
              <div
                className="progress-bar progress-bar-striped bg-success"
                role="progressbar"
                style={{ width: '25%' }}
              />
            </div>
          )}
          {cockpit.loaded && rounds && (
            <div>
              <div className="mb-3">
                Select expansions (default: All){' '}
                <button
                  className="btn btn-dark mx-4"
                  disabled={expansions.length === 0}
                  onClick={() => this.setState({ expansions: [], choose: false })}
                >
                  ALL
                </button>
                <button
                  className="btn btn-dark mx-4"
                  disabled={expansions.length > 0}
                  onClick={() => this.setState({ choose: true })}
                >
                  CHOOSE
                </button>
                {expansions.length > 0 && <span className="ml-3">Expansions: {expansions.length}</span>}
                {expansions.length > 0 && <span className="ml-3">Questions: {currentQuestions}</span>}
                {expansions.length > 0 && <span className="ml-3">Answers: {currentAnswers}</span>}
                {expansions.length > 0 && (
                  <div className="ml-3">
                    You have got enough questions/answers for{' '}
                    {getPlayersNumber(rounds, currentQuestions, currentAnswers)} players
                  </div>
                )}
              </div>
              {choose && (
                <div style={{ height: '50vh', overflow: 'auto' }}>
                  <div className="list-group">
                    {Object.keys(cockpit.expansions).map((name, i) => {
                      const expansion = cockpit.expansions[name];
                      expansion.name = name;
                      return (
                        <button
                          onClick={() => this.onExpansionClick(expansion)}
                          type="button"
                          key={i}
                          className={'list-group-item' + (expansions.includes(expansion) ? ' active' : '')}
                        >
                          <span dangerouslySetInnerHTML={{ __html: name }} />
                          <span className="ml-4">Q: {expansion.q}</span>
                          <span className="ml-4">A: {expansion.a}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-2 text-center">
            <button
              className="btn btn-dark"
              onClick={this.onCreate}
              disabled={!name || !rounds || (expansions.length === 0 && choose)}
            >
              CREATE
            </button>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    if (!this.props.cockpit.loaded) {
      this.props.dispatch(doGetCockpitExpansions());
    }
  }

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
    console.log(rounds);
    this.setState({ rounds });
  };

  onExpansionClick = expansion => {
    const { expansions } = this.state;
    let _next_expansions;
    if (expansions.includes(expansion)) {
      _next_expansions = expansions.filter(_expansion => _expansion !== expansion);
    } else {
      _next_expansions = expansions.map(a => a);
      _next_expansions.push(expansion);
    }
    console.log('expansions', _next_expansions);
    this.setState({ expansions: _next_expansions });
  };

  onCreate = () => {
    const { name, rounds, expansions } = this.state;
    if (!name) {
      return;
    }
    if (expansions.length === 0) {
      this.props.onCreateGame(name, rounds);
    } else {
      this.props.onCreateGame(
        name,
        rounds,
        expansions.map(expansion => expansion.name)
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
