import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { doGetCockpitExpansions } from '../../modules/cockpit';

class CreateGame extends PureComponent {
  static propTypes = {
    onCreateGame: PropTypes.func.isRequired,
    onAbort: PropTypes.func.isRequired,
    cockpit: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  state = {
    name: '',
    expansions: []
  };

  render() {
    const { name, expansions } = this.state;
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
          <h2>Create a new game</h2>

          <form className="form-inline">
            <div className="form-group mb-2">
              <label>Nickname</label>
              <input
                placeholder="Nickname"
                className="form-control ml-2"
                type="text"
                value={name}
                onChange={e => this.setState({ name: e.target.value })}
              />
            </div>
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
          {cockpit.loaded && (
            <div>
              <div className="mb-3">
                Select expansions{' '}
                <button
                  className="btn btn-dark"
                  disabled={expansions.length === 0}
                  onClick={() => this.setState({ expansions: [] })}
                >
                  ALL
                </button>
                {expansions.length > 0 && <span className="ml-3">Expansions: {expansions.length}</span>}
                {expansions.length > 0 && <span className="ml-3">Questions: {currentQuestions}</span>}
                {expansions.length > 0 && <span className="ml-3">Answers: {currentAnswers}</span>}
              </div>
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
            </div>
          )}

          <div className="mt-2">
            <button className="btn btn-dark" onClick={this.onCreate} disabled={!name}>
              CREATE
            </button>
            <button className="btn btn-danger float-right" onClick={this.props.onAbort}>
              CANCEL
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
    const { name, expansions } = this.state;
    if (!name) {
      return;
    }
    if (expansions.length === 0) {
      this.props.onCreateGame(name);
    } else {
      this.props.onCreateGame(
        name,
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
